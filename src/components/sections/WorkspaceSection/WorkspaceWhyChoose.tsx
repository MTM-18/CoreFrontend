import { useTranslation } from "react-i18next";

const WHY_KEYS = [
    "creativeEnvironment",
    "networking",
    "easyAccess",
    "events",
] as const;

export default function WorkspaceWhyChoose() {
    const { t } = useTranslation();

    return (
        <section className="layout-shell py-12 md:py-16 bg-core-subtleBg dark:bg-core-subtleBgDark">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent mb-2">
                    {t("workspacePage.whyChoose.title")}
                </h2>
                <p className="text-base text-core-textDark dark:text-core-textLight mb-8 max-w-2xl">
                    {t("workspacePage.whyChoose.subtitle")}
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    {WHY_KEYS.map((key) => (
                        <article
                            key={key}
                            className="
                group card-surface rounded-xl px-6 py-5
                bg-core-surfaceAlt dark:bg-core-surfaceAltDark
                text-core-textMuted dark:text-core-textMutedDark
                hover:bg-core-brand/5 hover:border-core-brand
                border border-core-border/60
                transition-all duration-200
              "
                        >
                            <h3 className="text-core-textDark dark:text-core-textLight md:text-lg font-semibold group-hover:text-core-brand dark:group-hover:text-core-textAccent">
                                {t(`workspacePage.whyChoose.items.${key}`)}
                            </h3>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
