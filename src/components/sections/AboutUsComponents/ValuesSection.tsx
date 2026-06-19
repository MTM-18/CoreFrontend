import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import CoreProLogo from "../../../assets/sections/corepro.png";
import CoreAcademyLogo from "../../../assets/sections/coreacademy.png";
import CoreVenturesLogo from "../../../assets/sections/coreventureslab.png";
import CorePodcastLogo from "../../../assets/sections/coretalk.png";
import CoreInternLogo from "../../../assets/sections/coreintern.png";
import CoreConsultingLogo from "../../../assets/sections/coreconsulting.png";

import CoreProLogoWhite from "../../../assets/sections/coreprowhite.png";
import CoreAcademyLogoWhite from "../../../assets/sections/coreacademywhite.png";
import CoreVenturesLogoWhite from "../../../assets/sections/coreventureslabwhite.png";
import CorePodcastLogoWhite from "../../../assets/sections/coretalkwhite.png";
import CoreInternLogoWhite from "../../../assets/sections/coreinternwhite.png";
import CoreConsultingLogoWhite from "../../../assets/sections/coreconsultingwhite.png";

type SectionItem = {
    id: string;
    logo: string; // light
    logoDark: string; // dark (white)
};

const SECTIONS: SectionItem[] = [
    { id: "corePro", logo: CoreProLogo, logoDark: CoreProLogoWhite },
    { id: "coreAcademy", logo: CoreAcademyLogo, logoDark: CoreAcademyLogoWhite },
    { id: "coreVentures", logo: CoreVenturesLogo, logoDark: CoreVenturesLogoWhite },
    { id: "corePodcast", logo: CorePodcastLogo, logoDark: CorePodcastLogoWhite },
    { id: "coreIntern", logo: CoreInternLogo, logoDark: CoreInternLogoWhite },
    { id: "coreConsulting", logo: CoreConsultingLogo, logoDark: CoreConsultingLogoWhite },
];

export default function OurSectionsTable() {
    const { t } = useTranslation();
    const [flippedId, setFlippedId] = useState<string | null>(null);

    // ✅ same idea as we did with the hero text: react instantly to theme toggle
    // (Tailwind dark mode toggles the "dark" class on <html>)
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const html = document.documentElement;

        const update = () => setIsDark(html.classList.contains("dark"));
        update();

        const obs = new MutationObserver(update);
        obs.observe(html, { attributes: true, attributeFilter: ["class"] });

        return () => obs.disconnect();
    }, []);

    const titleKey = (id: string) => `aboutPage.valuesSection.items.${id}.title`;
    const bodyKey = (id: string) => `aboutPage.valuesSection.items.${id}.body`;

    const getTitle = (id: string) => t(titleKey(id), { defaultValue: "" });
    const getBody = (id: string) => t(bodyKey(id), { defaultValue: "" });

    const toggle = (id: string) => setFlippedId((prev) => (prev === id ? null : id));

    return (
        <section className="py-10 md:py-10 lg:py-10">
            <div className="layout-shell mx-auto space-y-8">
                {/* Heading */}
                <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent">
                        {t("aboutPage.valuesSection.title")}
                    </h2>
                </div>

                {/* Cards */}
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {SECTIONS.map((s) => {
                        const title = getTitle(s.id);
                        const body = getBody(s.id);
                        const isFlipped = flippedId === s.id;

                        return (
                            <div
                                key={s.id}
                                role="button"
                                tabIndex={0}
                                aria-label={title || s.id}
                                className="group relative h-[230px] sm:h-[250px] lg:h-[270px] rounded-2xl outline-none [perspective:1200px]"
                                onPointerUp={(e) => {
                                    if (e.pointerType !== "mouse") toggle(s.id);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        toggle(s.id);
                                    }
                                }}
                            >
                                <div
                                    className={[
                                        "relative h-full w-full rounded-2xl transition-transform duration-500",
                                        "[transform-style:preserve-3d]",
                                        isFlipped
                                            ? "[transform:rotateY(180deg)]"
                                            : "group-hover:[transform:rotateY(180deg)]",
                                    ].join(" ")}
                                >
                                    {/* FRONT */}
                                    <div
                                        className="
                      absolute inset-0 overflow-hidden rounded-2xl
                      bg-white/90 dark:bg-black/60
                      shadow-sm dark:shadow-lg
                      [backface-visibility:hidden]
                    "
                                    >
                                        <div className="h-full p-5 sm:p-6 flex flex-col items-center justify-center gap-3">
                                            <img
                                                src={isDark ? s.logoDark : s.logo}
                                                alt={title}
                                                loading="lazy"
                                                decoding="async"
                                                className="
                          max-h-16 sm:max-h-20 lg:max-h-24 w-auto object-contain
                          opacity-90 dark:opacity-85
                          transition-transform duration-200
                          group-hover:scale-[1.03]
                        "
                                            />
                                            <div className="text-sm sm:text-base font-semibold text-core-brand dark:text-core-textAccent text-center py-2">
                                                {title}
                                            </div>
                                        </div>

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/0 via-transparent to-black/5 dark:to-white/40" />
                                    </div>

                                    {/* BACK */}
                                    <div
                                        className="
                      absolute inset-0 overflow-hidden rounded-2xl
                      bg-white/95 dark:bg-black/70
                      shadow-sm dark:shadow-lg
                      [transform:rotateY(180deg)]
                      [backface-visibility:hidden]
                    "
                                    >
                                        <div className="h-full p-5 sm:p-6 flex flex-col justify-center gap-3">
                                            <h3 className="text-base sm:text-lg font-semibold text-core-brand dark:text-core-textAccent">
                                                {title}
                                            </h3>

                                            <p className="text-sm sm:text-[15px] leading-relaxed text-black/75 dark:text-white/80 whitespace-pre-line">
                                                {body}
                                            </p>

                                            <p className="text-xs text-black/45 dark:text-white/45">
                                                {t("aboutPage.valuesSection.flipHint", { defaultValue: "" })}
                                            </p>
                                        </div>

                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/0 via-transparent to-black/5 dark:to-white/10" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}