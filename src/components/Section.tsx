type SectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
}: SectionProps) {
  return (
    <section id={id} className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        {(eyebrow || title) && (
          <div className="max-w-3xl">
            {eyebrow && (
              <div className="mb-5 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black tracking-[0.25em] text-orange-400">
                {eyebrow}
              </div>
            )}

            <h2 className="text-4xl font-black tracking-tight sm:text-6xl">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="mt-14">
          {children}
        </div>
      </div>
    </section>
  );
}