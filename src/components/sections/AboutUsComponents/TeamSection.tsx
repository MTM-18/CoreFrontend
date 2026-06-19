import { useTranslation } from "react-i18next";
import { useCmsItems } from "../../../cms/useCmsItems";

export default function TeamSection() {
    const { t, i18n } = useTranslation();
    const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";
    const cmsTeam = useCmsItems("team");
    const team = cmsTeam.map((member) => ({
        id: member.id,
        image: member.image_path,
        name: { en: member.title_en, ar: member.title_ar },
        role: { en: member.subtitle_en, ar: member.subtitle_ar },
    }));

    return (
        <section className="py-8 md:py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="layout-shell mx-auto space-y-5 md:space-y-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-core-textAccent">
                            {t("aboutPage.team.title")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm md:text-base text-white/72">
                            {t("aboutPage.team.subtitle")}
                        </p>
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-core-accent/70 via-white/15 to-transparent md:block" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {team.map((member, index) => (
                        <article
                            key={member.id}
                            className="group overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-core-accent/50 hover:bg-white/[0.07]"
                        >
                            <div className="relative aspect-[1/1.08] overflow-hidden bg-black/30 sm:aspect-[4/5]">
                                <img
                                    src={member.image}
                                    alt={member.name[lang]}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    loading={index < 4 ? "eager" : "lazy"}
                                    fetchPriority={index < 4 ? "high" : "auto"}
                                    decoding="async"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="p-3 sm:p-4">
                                <h3 className="text-[13px] font-semibold leading-tight text-white sm:text-base">
                                    {member.name[lang]}
                                </h3>
                                <p className="mt-1 text-[11px] leading-4 text-core-textAccent sm:text-sm sm:leading-6">
                                    {member.role[lang]}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
