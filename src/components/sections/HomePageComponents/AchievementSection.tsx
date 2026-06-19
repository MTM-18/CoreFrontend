import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
    FaBriefcase,
    FaBuilding,
    FaGraduationCap,
    FaHandshake,
    FaLightbulb,
    FaMoneyBillWave,
    FaUsers,
    FaUserTie,
} from "react-icons/fa";

export default function AchievementsSection() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith("ar");





    const metrics = useMemo(
        () => [
            { key: "beneficiaries", value: isRTL ? "+5,000" : "5,000+", icon: FaUsers },
            { key: "programs", value: "27", icon: FaBriefcase },
            { key: "donors", value: "10", icon: FaBuilding },
            { key: "partners", value: "60", icon: FaHandshake },
            { key: "experts", value: isRTL ? "+100" : "100+", icon: FaUserTie },
            { key: "graduates", value: isRTL ? "+600" : "600+", icon: FaGraduationCap },
            { key: "startups", value: "67", icon: FaLightbulb },
            {
                key: "investments",
                value: isRTL ? "5 مليون دولار" : "$5M",
                icon: FaMoneyBillWave,
            },
        ],
        [isRTL]
    );

    return (
        <section className="py-4 md:py-8" dir={isRTL ? "rtl" : "ltr"}>
            <div className="layout-shell mx-auto">
                <div className=" rounded-[28px] p-4 md:p-6">
                    <div className={`mb-5 ${isRTL ? "text-right" : "text-left"}`}>
                        <h2 className="text-xl font-semibold text-core-brand dark:text-core-textAccent md:text-3xl">
                            {t("homePage.achievements.title")}
                        </h2>


                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">                        {metrics.map((metric) => {
                            const Icon = metric.icon;

                            return (
                                <article
                                    key={metric.key}
                                    className="rounded-2xl border border-black/6 bg-white p-3 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
                                >
                                    <div
                                        className={`flex items-center gap-3 ${
                                            isRTL ? "flex-row-reverse text-right" : "text-left"
                                        }`}
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-core-brand/10 text-core-brand dark:bg-core-textAccent/12 dark:text-core-textAccent">
                                            <Icon className="text-lg" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-2xl font-bold leading-none text-core-brand dark:text-core-textAccent">
                                                {metric.value}
                                            </div>

                                            <p className="mt-1 truncate text-xs text-core-textDark dark:text-core-textLight md:text-base">
                                                {t(`homePage.achievements.items.${metric.key}`)}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}