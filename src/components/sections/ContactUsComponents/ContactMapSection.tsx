import { useTranslation } from "react-i18next";

const CORE_ISTANBUL_MAP_EMBED =
    "https://www.google.com/maps?q=41.0117259,28.6544683&z=17&output=embed";

export default function ContactMapSection() {
    const { t } = useTranslation();

    return (
        <section className="layout-shell pb-16 md:pb-20">
            <div className="mx-auto mb-6 max-w-6xl text-center">
                <h2 className="mb-2 text-2xl font-semibold text-core-textDark dark:text-core-textLight md:text-3xl">
                    {t("contactPage.map.title")}
                </h2>
                <p className="text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark md:text-base">
                    {t("contactPage.map.subtitle")}
                </p>
            </div>

            <div className="mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-black/8 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5">
                <div className="relative w-full pt-[56.25%]">
                    <iframe
                        className="absolute inset-0 h-full w-full"
                        src={CORE_ISTANBUL_MAP_EMBED}
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        title={t("contactPage.map.title")}
                    />
                </div>
            </div>
        </section>
    );
}