import { useTranslation } from "react-i18next";
import { FiPhone, FiCalendar, FiMessageSquare } from "react-icons/fi";

export default function ContactIntroCards() {
    const { t } = useTranslation();

    const ITEMS = [
        { key: "phone", icon: FiPhone },
        { key: "hours", icon: FiCalendar },
        { key: "email", icon: FiMessageSquare },
    ] as const;

    return (
        <section className="layout-shell py-16 md:py-20">
            <div className="max-w-5xl mx-auto text-center mb-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-3">
                    {t("contactPage.intro.title")}
                </h1>
                <p className="text-base text-core-textDark dark:text-core-textLight">
                    {t("contactPage.intro.subtitle")}
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
                {ITEMS.map(({ key, icon: Icon }) => (
                    <article
                        key={key}
                        className="
group
        card-surface rounded-2xl p-6 md:p-7
        flex flex-col justify-between h-full
        border border-core-border/60
        transition-all duration-200
        hover:border-core-accent hover:bg-core-accent/5
                        "
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">
                                    {t(`contactPage.cards.${key}.label`)}
                                </h3>
                                <p className="text-sm text-core-textDark dark:text-core-textLight">
                                    {t(`contactPage.cards.${key}.primary`)}
                                </p>
                                {t(`contactPage.cards.${key}.secondary`) && (
                                    <p className="mt-1 text-sm font-semibold text-core-accent">
                                        {t(`contactPage.cards.${key}.secondary`)}
                                    </p>
                                )}
                            </div>

                            <div className="inline-flex items-center justify-center 
                                            rounded-xl w-10 h-10
                                            border border-core-border/60
                                            bg-core-surfaceAlt dark:bg-core-surfaceAltDark
                                            transition-all duration-200
                                            group-hover:border-core-accent 
                                            group-hover:bg-core-accent/10">
                                <Icon className="text-core-brand 
                                                 transition-all duration-200 
                                                 group-hover:text-core-accent" />
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
