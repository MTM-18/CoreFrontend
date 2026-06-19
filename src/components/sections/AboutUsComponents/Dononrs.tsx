import { useTranslation } from "react-i18next";

import namaaCharityLogo from "../../../assets/donorsLogos/namaaCharityLogo.png";
import abdullahNoriCharityLogo from "../../../assets/donorsLogos/abdullahNoriCharityLogo.png";
import dhiaAcademyLogo from "../../../assets/donorsLogos/dhiaAcademy.png";
import islamicDevelopmentBankLogo from "../../../assets/donorsLogos/islamicDevelopmentBank.png";
import qatarAlkhairiahLogo from "../../../assets/donorsLogos/qatarAlkhairiah.png";
import sparkLogo from "../../../assets/donorsLogos/Spark.png";
import unhcrLogo from "../../../assets/donorsLogos/UNHCR.png";

type Donor = {
    id: string;
    image: string;
};

const DONORS: Donor[] = [
    { id: "namaa", image: namaaCharityLogo },
    { id: "nouri", image: abdullahNoriCharityLogo },
    { id: "dhiaAcademy", image: dhiaAcademyLogo },
    { id: "islamicDevelopmentBank", image: islamicDevelopmentBankLogo },
    { id: "qatarAlkhairiah", image: qatarAlkhairiahLogo },
    { id: "spark", image: sparkLogo },
    { id: "unhcr", image: unhcrLogo },
];

const DONORS_LOOP = [...DONORS, ...DONORS];

export default function DonorsSection() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language?.startsWith("ar");

    return (
        <section className="py-12 overflow-x-hidden" dir={isRtl ? "rtl" : "ltr"}>
            <style>{`
                .donors-marquee {
                    overflow: hidden;
                    direction: ltr;
                }

                .donors-track {
                    display: flex;
                    width: max-content;
                    will-change: transform;
                    animation: donors-scroll 28s linear infinite;
                }

                .donors-marquee:hover .donors-track {
                    animation-play-state: paused;
                }

                @keyframes donors-scroll {
                    from {
                        transform: translate3d(0, 0, 0);
                    }
                    to {
                        transform: translate3d(-50%, 0, 0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .donors-track {
                        animation: none;
                        transform: none;
                    }
                }
            `}</style>

            <div className="layout-shell mx-auto space-y-8">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold text-core-brand dark:text-core-textAccent md:text-3xl">
                        {t("aboutPage.donors.title")}
                    </h2>

                    <p className="max-w-xl text-sm text-core-textDark dark:text-core-textLight md:text-base">
                        {t("aboutPage.donors.subtitle")}
                    </p>
                </div>
            </div>

            <div className="relative left-1/2 mt-8 w-screen -translate-x-1/2 overflow-hidden">
                <div
                    className="
                        donors-marquee px-4 sm:px-6 lg:px-8
                        [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
                        [-webkit-mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]
                    "
                >
                    <div className="donors-track gap-4 md:gap-5">
                        {DONORS_LOOP.map((donor, idx) => (
                            <div
                                key={`${donor.id}-${idx}`}
                                className="
                                    w-[180px] shrink-0 rounded-3xl border border-white/10
                                    bg-white/5 p-4 text-center backdrop-blur-sm
                                    transition hover:-translate-y-1 hover:bg-white/10
                                    sm:w-[200px] lg:w-[220px]
                                "
                            >
                                <div
                                    className="
                                        flex h-32 w-full items-center justify-center rounded-2xl
                                        bg-white px-2 py-2 shadow-sm md:h-28
                                    "
                                >
                                    <img
                                        src={donor.image}
                                        alt={t(`aboutPage.donors.list.${donor.id}.name`)}
                                        className="h-full w-full object-contain"
                                        loading="lazy"
                                        decoding="async"
                                        draggable={false}
                                    />
                                </div>

                                <p
                                    dir={isRtl ? "rtl" : "ltr"}
                                    className="mt-3 text-sm leading-snug text-core-textLight"
                                >
                                    {t(`aboutPage.donors.list.${donor.id}.name`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}