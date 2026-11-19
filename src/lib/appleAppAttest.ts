
import "server-only";
import "reflect-metadata";

import {
  createHash,
  timingSafeEqual,
  X509Certificate,
} from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { decodeAllSync, decodeFirstSync } from "cbor";
import { X509Certificate as ParsedCertificate } from "@peculiar/x509";

export type AppAttestEnvironment = "development" | "production";

export interface VerifiedAppAttestation {
  keyId: string;
  publicKey: string;
  receipt: string;
  environment: AppAttestEnvironment;
  signCount: number;
}

const NONCE_OID = "1.2.840.113635.100.8.2";
const FLAG_AT = 0x40;
const FLAG_ED = 0x80;
const MAX_ATTESTATION_BYTES = 32 * 1024;

function invalid(message: string): never {
  throw new Error(`App Attest verification failed: ${message}`);
}

function check(condition: unknown, message: string): asserts condition {
  if (!condition) invalid(message);
}

function sha256(value: Buffer | string): Buffer {
  return createHash("sha256").update(value).digest();
}

function equal(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b);
}

function decodeBase64(value: string): Buffer {
  check(
    typeof value === "string" && value.length > 0,
    "Missing Base64 value"
  );

  check(
    /^[A-Za-z0-9+/_-]+={0,2}$/.test(value),
    "Invalid Base64 characters"
  );

  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Buffer.from(normalized, "base64");

  check(bytes.length > 0, "Empty Base64 value");

  check(
    bytes.toString("base64").replace(/=+$/, "") ===
      normalized.replace(/=+$/, ""),
    "Noncanonical Base64 value"
  );

  return bytes;
}

function readElement(
  data: Buffer,
  offset: number
): {
  tag: number;
  value: Buffer;
  next: number;
} {
  check(offset < data.length, "Truncated DER");

  const tag = data[offset++];

  check(offset < data.length, "Truncated DER length");

  const first = data[offset++];
  let length = first;

  if (first & 0x80) {
    const count = first & 0x7f;

    check(
      count > 0 &&
        count <= 4 &&
        offset + count <= data.length,
      "Invalid DER length"
    );

    check(data[offset] !== 0, "Nonminimal DER length");

    length = 0;

    for (let i = 0; i < count; i++) {
      length = length * 256 + data[offset++];
    }

    check(length >= 128, "Nonminimal DER length");
  }

  check(
    offset + length <= data.length,
    "Truncated DER value"
  );

  return {
    tag,
    value: data.subarray(offset, offset + length),
    next: offset + length,
  };
}



function certificateNonce(der: Buffer): Buffer {
  const cert = new ParsedCertificate(
    Uint8Array.from(der).buffer
  );

  const extension = cert.extensions.find(
    (entry) => entry.type === NONCE_OID
  );

  check(extension, "Missing Apple nonce extension");

  let encoded = Buffer.from(extension.value);

  // The certificate library may retain the outer
  // OCTET STRING around the extension contents.
  let element = readElement(encoded, 0);

  if (
    element.tag === 0x04 &&
    element.next === encoded.length
  ) {
    encoded = Buffer.from(element.value);
    element = readElement(encoded, 0);
  }

  check(
    element.tag === 0x30 &&
      element.next === encoded.length,
    "Invalid Apple nonce sequence"
  );

  // Apple's nonce is carried in a context-specific
  // [1] wrapper containing a 32-byte OCTET STRING.
  const context = readElement(element.value, 0);

  check(
    context.tag === 0xa1 &&
      context.next === element.value.length,
    "Invalid Apple nonce context"
  );

  const nonce = readElement(context.value, 0);

  check(
    nonce.tag === 0x04 &&
      nonce.next === context.value.length &&
      nonce.value.length === 32,
    "Invalid Apple nonce encoding"
  );

  return nonce.value;
}



function verifyChain(
  certificates: Buffer[]
): X509Certificate {
  check(
    certificates.length >= 2 &&
      certificates.length <= 5,
    "Invalid certificate chain length"
  );

  const chain = certificates.map(
    (der) => new X509Certificate(der)
  );

  const rootPath = join(
    process.cwd(),
    "certs",
    "Apple_App_Attestation_Root_CA.pem"
  );

  const root = new X509Certificate(
    readFileSync(rootPath)
  );

  const now = Date.now();

  check(
    root.ca && root.verify(root.publicKey),
    "Untrusted root certificate"
  );

  for (const cert of [...chain, root]) {
    check(
      now >= Date.parse(cert.validFrom) &&
        now <= Date.parse(cert.validTo),
      "Certificate expired or not yet valid"
    );
  }

  check(!chain[0].ca, "Leaf certificate is a CA");

  for (let i = 0; i < chain.length; i++) {
    const issuer = chain[i + 1] ?? root;

    check(
      issuer.ca,
      "Non-CA certificate in issuer position"
    );

    check(
      chain[i].checkIssued(issuer),
      "Certificate issuer mismatch"
    );

    check(
      chain[i].verify(issuer.publicKey),
      "Invalid certificate signature"
    );
  }

  return chain[0];
}

function mapValue(
  map: Map<unknown, unknown>,
  key: number
): unknown {
  return map.get(key);
}

function verifiedCredentialKey(
  authData: Buffer,
  certificate: X509Certificate,
  suppliedKeyId: Buffer,
  environment: AppAttestEnvironment
): void {
  check(
    authData.length >= 55,
    "Truncated authenticator data"
  );

  const flags = authData[32];

  check(
    (flags & FLAG_AT) !== 0,
    "Attested credential flag missing"
  );

  check(
    (flags & FLAG_ED) === 0,
    "Unexpected authenticator extensions"
  );

  check(
    (flags & ~(FLAG_AT | 0x01)) === 0,
    "Unexpected authenticator flags"
  );

  check(
    authData.readUInt32BE(33) === 0,
    "Registration counter must be zero"
  );

  const expectedAAGUID =
    environment === "development"
      ? Buffer.from("appattestdevelop", "ascii")
      : Buffer.concat([
          Buffer.from("appattest", "ascii"),
          Buffer.alloc(7),
        ]);

  check(
    equal(authData.subarray(37, 53), expectedAAGUID),
    "Environment AAGUID mismatch"
  );

  const credentialIdLength = authData.readUInt16BE(53);

  check(
    credentialIdLength === 32,
    "Unexpected credential ID length"
  );

  const credentialEnd = 55 + credentialIdLength;

  check(
    authData.length > credentialEnd,
    "Missing credential public key"
  );

  check(
    equal(
      authData.subarray(55, credentialEnd),
      suppliedKeyId
    ),
    "Credential ID mismatch"
  );

  // App Attest credentials use a COSE EC2 P-256 key.
  // The CBOR object must consume the entire remainder.
  const remaining = authData.subarray(credentialEnd);

  let decoded: unknown[];

  try {
    decoded = decodeAllSync(remaining);
  } catch {
    invalid("Malformed credential CBOR");
  }

  check(
    decoded.length === 1 &&
      decoded[0] instanceof Map,
    "Invalid credential CBOR structure"
  );

  const cose = decoded[0] as Map<unknown, unknown>;

  check(
    mapValue(cose, 1) === 2,
    "Credential key is not EC2"
  );

  check(
    mapValue(cose, 3) === -7,
    "Credential algorithm is not ES256"
  );

  check(
    mapValue(cose, -1) === 1,
    "Credential curve is not P-256"
  );

  const coseX = mapValue(cose, -2);
  const coseY = mapValue(cose, -3);

  check(
    Buffer.isBuffer(coseX) &&
      coseX.length === 32,
    "Invalid credential X coordinate"
  );

  check(
    Buffer.isBuffer(coseY) &&
      coseY.length === 32,
    "Invalid credential Y coordinate"
  );

  const jwk = certificate.publicKey.export({
    format: "jwk",
  });

  check(
    jwk.kty === "EC" &&
      jwk.crv === "P-256",
    "Certificate public key is not P-256"
  );

  check(
    typeof jwk.x === "string" &&
      typeof jwk.y === "string",
    "Missing certificate key coordinates"
  );

  const certX = decodeBase64(jwk.x);
  const certY = decodeBase64(jwk.y);

  check(
    equal(coseX, certX) &&
      equal(coseY, certY),
    "Credential and certificate public keys differ"
  );

  const point = Buffer.concat([
    Buffer.from([0x04]),
    certX,
    certY,
  ]);

  check(
    equal(sha256(point), suppliedKeyId),
    "Key identifier does not match public key"
  );
}

export function verifyAppleAppAttestation(
  attestationBase64: string,
  keyId: string,
  challenge: string,
  environment: AppAttestEnvironment
): VerifiedAppAttestation {
  const teamId = process.env.APPLE_TEAM_ID;
  const bundleId = process.env.APPLE_BUNDLE_ID;

  check(
    teamId && bundleId,
    "App identity is not configured"
  );

  check(
    environment === "development" ||
      environment === "production",
    "Invalid environment"
  );

  const encoded = decodeBase64(attestationBase64);

  check(
    encoded.length <= MAX_ATTESTATION_BYTES,
    "Attestation exceeds size limit"
  );

  let decoded: unknown;

  try {
    decoded = decodeFirstSync(encoded);
  } catch {
    invalid("Malformed attestation CBOR");
  }

  check(
    decoded && typeof decoded === "object",
    "Invalid attestation object"
  );

  const attestation = decoded as {
    fmt?: unknown;
    authData?: unknown;
    attStmt?: {
      x5c?: unknown;
      receipt?: unknown;
    };
  };

  check(
    attestation.fmt === "apple-appattest",
    "Unexpected attestation format"
  );

  check(
    Buffer.isBuffer(attestation.authData),
    "Invalid authenticator data"
  );

  const authData = attestation.authData;
  const certificates = attestation.attStmt?.x5c;

  check(
    Array.isArray(certificates) &&
      certificates.every(Buffer.isBuffer),
    "Invalid certificate chain"
  );

  const leaf = verifyChain(certificates);

  const suppliedKeyId = decodeBase64(keyId);

  check(
    suppliedKeyId.length === 32,
    "Invalid key identifier length"
  );

  const challengeBytes = decodeBase64(challenge);

  check(
    challengeBytes.length === 32,
    "Invalid challenge length"
  );

  const clientDataHash = sha256(challengeBytes);

  const nonce = sha256(
    Buffer.concat([authData, clientDataHash])
  );

  check(
    equal(
      nonce,
      certificateNonce(certificates[0])
    ),
    "Certificate nonce mismatch"
  );

  const expectedRPID = sha256(
    `${teamId}.${bundleId}`
  );

  check(
    equal(
      authData.subarray(0, 32),
      expectedRPID
    ),
    "App identifier mismatch"
  );

  verifiedCredentialKey(
    authData,
    leaf,
    suppliedKeyId,
    environment
  );

  const receipt = attestation.attStmt?.receipt;

  check(
    Buffer.isBuffer(receipt) &&
      receipt.length > 0,
    "Missing Apple receipt"
  );

  return {
    keyId,
    publicKey: leaf.publicKey
      .export({
        type: "spki",
        format: "pem",
      })
      .toString(),
    receipt: receipt.toString("base64"),
    environment,
    signCount: 0,
  };
}
