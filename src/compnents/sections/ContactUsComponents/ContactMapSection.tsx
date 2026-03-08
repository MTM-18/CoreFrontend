import { useTranslation } from "react-i18next";

// Replace this with the new Google Maps embed URL when the final location is confirmed.
const CORE_ISTANBUL_MAP_EMBED =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.344938993721!2d28.826297576547506!3d41.00277231962856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa35afcb42f29%3A0xdd269a6c9d42a3e0!2s29%20Ekim%20Cd.%2011%20C%20D%3A51%2C%20Yenibosna%20Merkez%2C%2034197%20Bah%C3%A7elievler%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1700000000000!5m2!1sen!2str";

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