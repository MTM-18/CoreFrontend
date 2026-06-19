import { useTranslation } from "react-i18next";
import { useCmsItems } from "../../../cms/useCmsItems";

export default function TestimonialsSection() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
    const cmsItems = useCmsItems("home_testimonials").slice(0, 5);

    if (cmsItems.length === 0) return null;

    return (
        <section className="py-12 md:py-16">
            <div className="layout-shell mx-auto max-w-7xl space-y-10">
                <div className="space-y-3">
                    <h2
                        data-t-head
                        className="text-2xl font-semibold text-core-brand dark:text-core-textAccent md:text-3xl"
                    >
                        {t("homePage.testimonials.title")}
                    </h2>
                    <p
                        data-t-head
                        className="max-w-2xl text-sm text-core-textDark dark:text-core-textLight md:text-base"
                    >
                        {t("homePage.testimonials.subtitle")}
                    </p>
                </div>

                <div className="grid gap-6 [perspective:1200px] md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                    {cmsItems.map((item) => (
                        <article
                            key={item.id}
                            data-t-card
                            className="card-surface flex flex-col gap-6 p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)] md:p-8"
                        >
                            <div data-t-quote className="text-3xl text-core-brand">&ldquo;</div>
                            <p className="flex-1 text-sm leading-relaxed text-core-textDark dark:text-core-textLight">
                                {lang === "ar" ? item.body_ar : item.body_en}
                            </p>
                            <div className="flex items-center gap-3">
                                {item.image_path && (
                                    <img
                                        src={item.image_path}
                                        alt=""
                                        className="h-12 w-12 rounded-full object-cover"
                                        loading="eager"
                                        fetchPriority="high"
                                        decoding="async"
                                    />
                                )}
                                <div>
                                    <div className="text-sm font-semibold text-core-textDark dark:text-core-textLight">
                                        {lang === "ar" ? item.title_ar : item.title_en}
                                    </div>
                                    <div className="text-xs text-core-textMuted">
                                        {lang === "ar" ? item.subtitle_ar : item.subtitle_en}
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
