
/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/api/attest/register": [
      "./certs/Apple_App_Attestation_Root_CA.pem",
    ],
  },
};

export default nextConfig;
