import { useTranslation } from "react-i18next";

// import all the assets
import abdullahImg from "../../../assets/testimonials/abdullah.webp";
import gassanImg from "../../../assets/testimonials/gassan.webp";
import jammalImg from "../../../assets/testimonials/jammal.webp";
import saadImg from "../../../assets/testimonials/saad.webp";
import yassenImg from "../../../assets/testimonials/yassen.webp";


type TestimonialConfig = {
    id: "yassen" | "saad" | "jammal" | "gassan" | "abdullah";
    image: string;
    quoteKey: string;
    nameKey: string;
    roleKey: string;
};

const Testimonials: TestimonialConfig[] = [
    {
        id: "yassen",
        image: yassenImg,
        quoteKey: "homePage.testimonials.items.yassen.quote",
        nameKey: "homePage.testimonials.items.yassen.name",
        roleKey: "homePage.testimonials.items.yassen.role",
    },
    {
        id: "saad",
        image: saadImg,
        quoteKey: "homePage.testimonials.items.saad.quote",
        nameKey: "homePage.testimonials.items.saad.name",
        roleKey: "homePage.testimonials.items.saad.role",
    },
    {
        id: "jammal",
        image: jammalImg,
        quoteKey: "homePage.testimonials.items.jammal.quote",
        nameKey: "homePage.testimonials.items.jammal.name",
        roleKey: "homePage.testimonials.items.jammal.role",
    },
    {
        id: "gassan",
        image: gassanImg,
        quoteKey: "homePage.testimonials.items.gassan.quote",
        nameKey: "homePage.testimonials.items.gassan.name",
        roleKey: "homePage.testimonials.items.gassan.role",
    },
    {
        id: "abdullah",
        image: abdullahImg,
        quoteKey: "homePage.testimonials.items.abdullah.quote",
        nameKey: "homePage.testimonials.items.abdullah.name",
        roleKey: "homePage.testimonials.items.abdullah.role",
    },
];

export default function TestimonialsSection() {
    const { t } = useTranslation();



    return (
        <section  className="py-12 md:py-16">
            <div className="layout-shell max-w-7xl mx-auto space-y-10">
                {/* Heading */}
                <div className="space-y-3">
                    <h2
                        data-t-head
                        className="text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent"
                    >
                        {t("homePage.testimonials.title")}
                    </h2>
                    <p
                        data-t-head
                        className="text-sm md:text-base max-w-2xl text-core-textDark dark:text-core-textLight"
                    >
                        {t("homePage.testimonials.subtitle")}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3 [perspective:1200px]">
                    {Testimonials.map((item) => (
                        <article
                            key={item.id}
                            data-t-card
                            className="card-surface flex flex-col gap-6 p-6 md:p-8 transform-gpu transition-all duration-300 ease-out hover:-translate-y-1 hover:[transform:rotateX(5deg)_rotateY(-5deg)_translateY(-6px)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                            style={{
                                willChange: "transform, box-shadow",
                                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                            }}
                        >
                            <div data-t-quote className="text-core-brand text-3xl">
                                “
                            </div>

                            <p className="text-sm leading-relaxed text-core-textDark dark:text-core-textLight flex-1">
                                {t(item.quoteKey)}
                            </p>

                            <div className="flex items-center gap-3">
                                <img
                                    src={item.image}
                                    alt={t(item.nameKey)}
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div>
                                    <div className="text-sm font-semibold text-core-textDark dark:text-core-textLight">
                                        {t(item.nameKey)}
                                    </div>
                                    <div className="text-xs text-core-textMuted">
                                        {t(item.roleKey)}
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
