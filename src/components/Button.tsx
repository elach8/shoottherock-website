type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
};

export default function Button({
  children,
  href = "#",
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-8 py-4 text-center font-black transition";

  const styles =
    variant === "primary"
      ? "bg-orange-500 text-black hover:bg-orange-400"
      : "border border-white/20 text-white hover:border-orange-400 hover:text-orange-400";

  return (
    <a href={href} className={`${base} ${styles}`}>
      {children}
    </a>
  );
}