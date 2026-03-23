import { useTranslation } from "react-i18next";

import programmingImg from "../../../assets/display/programming.webp";
import ecommerceImg from "../../../assets/display/ecommerce.webp";
import marketing1Img from "../../../assets/display/marketing1.webp";
import marketing2Img from "../../../assets/display/marketing2.webp";
import designImg from "../../../assets/display/design.webp";
import interiorImg from "../../../assets/display/interior.webp";
import accountingImg from "../../../assets/display/accounting.webp";
import coworkingImg from "../../../assets/display/coworking.webp";
import vocationalImg from "../../../assets/display/vocaltional.webp";
import entrepreneurshipImg from "../../../assets/display/entrepreneurship.webp";

const GALLERY = [
    { id: "programming", image: programmingImg },
    { id: "ecommerce", image: ecommerceImg },
    { id: "marketing1", image: marketing1Img },
    { id: "marketing2", image: marketing2Img },
    { id: "design", image: designImg },
    { id: "interior", image: interiorImg },
    { id: "accounting", image: accountingImg },
    { id: "coworking", image: coworkingImg },
    { id: "vocational", image: vocationalImg },
    { id: "entrepreneurship", image: entrepreneurshipImg },
] as const;

export default function PhotoLibrarySection() {
    const { t } = useTranslation();

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
                    {GALLERY.map((item) => (
                        <figure
                            key={item.id}
                            className="overflow-hidden rounded-3xl border border-black/8 bg-white/80 shadow-sm dark:border-white/10 dark:bg-white/5"
                        >
                            <img
                                src={item.image}
                                alt={t(`aboutPage.gallery.items.${item.id}.label`)}
                                className="h-56 w-full object-cover"
                                loading="lazy"
                                decoding="async"
                            />
                            <figcaption className="px-4 py-3 text-sm text-core-textDark dark:text-core-textLight">
                                {t(`aboutPage.gallery.items.${item.id}.label`)}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}