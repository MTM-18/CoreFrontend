import { useTranslation } from "react-i18next";
import { useCmsItems } from "../../../cms/useCmsItems";

export default function PhotoLibrarySection() {
    const { t, i18n } = useTranslation();
    const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
    const cmsGallery = useCmsItems("gallery");

    return (
        <section className="py-10 md:py-12">
            <div className="layout-shell mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-core-brand dark:text-core-textAccent md:text-3xl">
                        {t("aboutPage.gallery.title")}
                    </h2>
                    <p className="max-w-2xl text-sm leading-7 text-core-textDark dark:text-core-textLight md:text-base">
                        {t("aboutPage.gallery.subtitle")}
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {cmsGallery.map((item) => (
                        <figure
                            key={item.id}
                            className="overflow-hidden rounded-3xl border border-black/8 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5"
                        >
                            <img src={item.image_path} alt={lang === "ar" ? item.title_ar : item.title_en} className="h-56 w-full object-cover" loading="lazy" decoding="async" />
                            <figcaption className="px-4 py-3 text-sm text-core-textDark dark:text-core-textLight">
                                {lang === "ar" ? item.title_ar : item.title_en}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
