import { useTranslation } from "react-i18next";

// images
import ProgramImg from "../../../assets/display/entrepeneurship.png";
import CoreProImg from "../../../assets/display/corepro.png";
import WorkspaceImg from "../../../assets/display/workspace.png";
import ConsultingImg from "../../../assets/display/consulting.png"; // ✅ add your real image

type ServiceCardConfig = {
    id: string;
    titleKey: string;
    bodyKey: string;
    imageSrc: string;
};

const SERVICE_CARDS: ServiceCardConfig[] = [
    {
        id: "program",
        titleKey: "homePage.servicesSection.cards.program.title",
        bodyKey: "homePage.servicesSection.cards.program.body",
        imageSrc: ProgramImg,
    },
    {
        id: "corePro",
        titleKey: "homePage.servicesSection.cards.corePro.title",
        bodyKey: "homePage.servicesSection.cards.corePro.body",
        imageSrc: CoreProImg,
    },
    {
        id: "workspace",
        titleKey: "homePage.servicesSection.cards.workspace.title",
        bodyKey: "homePage.servicesSection.cards.workspace.body",
        imageSrc: WorkspaceImg,
    },
    {
        id: "consulting",
        titleKey: "homePage.servicesSection.cards.consulting.title",
        bodyKey: "homePage.servicesSection.cards.consulting.body",
        imageSrc: ConsultingImg,
    },
];

export default function ServiceSection() {
    const { t, i18n } = useTranslation();
    const isRTL = (i18n.dir?.() || "ltr") === "rtl";

    return (
        <section className="py-12 md:py-16">
            <div className="layout-shell  mx-auto space-y-10">
                {/* Heading + subtitle */}
                <div className={`space-y-3 ${isRTL ? "text-right" : "text-left"}  md:text-inherit`}>
                    <h2 className="text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent">
                        {t("homePage.servicesSection.title")}
                    </h2>

                    <p
                        className={`text-sm md:text-base max-w-2xl text-core-textDark dark:text-core-textLight/90 ${isRTL ? "md:ml-auto" : "md:mr-auto"
                            }`}
                    >
                        {t("homePage.servicesSection.subtitle")}
                    </p>
                </div>

                {/* Cards */}
                <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {SERVICE_CARDS.map((card) => (
                        <article
                            key={card.id}
                            className="card-surface overflow-hidden group relative h-[420px] md:h-[460px]"
                        >
                            {/* Image */}
                            <img
                                src={card.imageSrc}
                                alt={t(card.titleKey)}
                                className="absolute inset-0 h-full w-full object-cover"
                                draggable={false}
                            />

                            {/* overlay */}
                            <div className="absolute inset-0 bg-black/15" />

                            {/* Panel */}
                            <div
                                className={`
                  absolute inset-x-0 bottom-0
                  bg-core-brand/95 dark:bg-core-accent/80 text-white
                  transition-all duration-500 ease-out
                  px-6 py-5
                  h-[220px] md:h-[86px] md:group-hover:h-[220px]
                  ${isRTL ? "text-right" : "text-left"}
                `}
                            >
                                <h3 className="text-lg md:text-xl font-semibold">
                                    {t(card.titleKey)}
                                </h3>

                                <p
                                    className={`
                    mt-3 text-sm leading-relaxed text-white/90
                    transition-all duration-500 ease-out
                    opacity-100 translate-y-0
                    md:opacity-0 md:translate-y-2
                    md:group-hover:opacity-100 md:group-hover:translate-y-0
                  `}
                                >
                                    {t(card.bodyKey)}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
