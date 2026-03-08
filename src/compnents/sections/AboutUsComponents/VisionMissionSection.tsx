import { useTranslation } from "react-i18next";

function EyeIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
                d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path
                d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
        </svg>
    );
}

function TargetIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
            <path
                d="M12 21a9 9 0 1 1 6.36-2.64A8.97 8.97 0 0 1 12 21Z"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 12l7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M16 5h3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function InfoCard({
    icon,
    label,
    title,
    body,
}: {
    icon: React.ReactNode;
    label: string;
    title: string;
    body: string;
}) {
    return (
        <article
            className="
        group relative overflow-hidden rounded-2xl
        border border-black/10 dark:border-white/10
        bg-white/70 dark:bg-white/5
        backdrop-blur-xl
        shadow-sm dark:shadow-lg
        transition
        hover:-translate-y-0.5
      "
        >
            <div className="p-6 md:p-7">
                <div className="flex items-center gap-3">
                    <div
                        className="
              h-10 w-10 rounded-xl flex items-center justify-center
              bg-core-brand/12 dark:bg-core-brand/20
              text-core-brand dark:text-core-textAccent
              border border-black/5 dark:border-white/10
            "
                    >
                        {icon}
                    </div>

                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-core-textMuted text-start">
                            {label}
                        </p>
                        <h3 className="text-sm md:text-base font-semibold text-core-textDark dark:text-core-textLight text-start">
                            {title}
                        </h3>
                    </div>
                </div>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-core-textDark/85 dark:text-core-textLight/80 text-start">
                    {body}
                </p>
            </div>

            {/* subtle theme-friendly sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-black/5 dark:to-white/10" />
        </article>
    );
}

export default function AboutHeroVisionMission() {
    const { t } = useTranslation();

    return (
        <section className="py-12 md:py-16">
            <div className="layout-shell  mx-auto">
                <div
                    className="
            relative overflow-hidden rounded-3xl
            border border-black/10 dark:border-white/10
            bg-white/60 dark:bg-black/50
            backdrop-blur-xl
          "
                >
                    {/* soft decorative blobs (light/dark safe) */}
                    <div className="pointer-events-none absolute -top-24 -start-24 h-64 w-64 rounded-full bg-core-brand/15 dark:bg-core-brand/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -end-24 h-64 w-64 rounded-full bg-core-accent/15 dark:bg-core-accent/20 blur-3xl" />

                    <div className="relative p-7 md:p-10">
                        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
                            {/* Left: About */}
                            <div className="space-y-4">


                                <h1 className="text-2xl md:text-4xl font-semibold text-core-textDark dark:text-core-textLight text-start">
                                    {t("aboutPage.hero.title")}
                                </h1>

                                <p className="text-sm md:text-base leading-relaxed text-core-textDark/85 dark:text-core-textLight/90 text-start">
                                    {t("aboutPage.hero.body")}
                                </p>
                            </div>

                            {/* Right: Vision / Mission */}
                            <div className="grid gap-5">
                                <InfoCard
                                    icon={<EyeIcon />}
                                    label={t("aboutPage.vision.title")}
                                    title={t("aboutPage.vision.title")}
                                    body={t("aboutPage.vision.body")}
                                />

                                <InfoCard
                                    icon={<TargetIcon />}
                                    label={t("aboutPage.mission.title")}
                                    title={t("aboutPage.mission.title")}
                                    body={t("aboutPage.mission.body")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
