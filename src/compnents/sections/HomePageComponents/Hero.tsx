import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import HeroPhoto from "../../../assets/display/11.webp";
import HeroPhoto2 from "../../../assets/display/22.webp";
import HeroPhoto3 from "../../../assets/display/33.webp";
import HeroPhoto4 from "../../../assets/display/44.webp";

export default function Hero() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language.startsWith("ar");

    const slides = useMemo(
        () => [
            { title: t("hero.title1"), image: HeroPhoto },
            { title: t("hero.title1"), image: HeroPhoto2 },
            { title: t("hero.title1"), image: HeroPhoto3 },
            { title: t("hero.title1"), image: HeroPhoto4 },
        ],
        [t]
    );

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % slides.length);
        }, 4500);

        return () => window.clearInterval(timer);
    }, [slides.length]);

    const active = slides[activeIndex];

    return (
        <section
            dir={isRTL ? "rtl" : "ltr"}
            className="layout-shell grid  items-center px-4 gap-5 py-6 md:grid-cols-[1.05fr,0.95fr] md:px-6"
        >
            <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full border border-core-brand/15 bg-core-brand/8 px-3 py-1 text-xs font-semibold text-core-brand dark:border-core-textAccent/20 dark:bg-core-textAccent/10 dark:text-core-textAccent">
                    <span className="h-2 w-2 rounded-full bg-core-accent" />
                    {t("homePage.aboutSection.title")}
                </div>

                <div className="space-y-4">
                    <div className="min-h-[180px] sm:min-h-[200px] md:min-h-[220px] ">
                        <h1
                            key={activeIndex}
                            className="max-w-3xl text-3xl font-semibold leading-[1.18] text-core-textDark dark:text-core-textLight sm:text-4xl sm:leading-[1.4] md:text-5xl md:leading-[1.4]"                        >
                            {active.title}
                        </h1>
                    </div>


                </div>

                <div className="flex flex-wrap gap-3">
                    <NavLink
                        to="/home/about"
                        className="rounded-full bg-core-brand px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-core-textAccent dark:text-black"
                    >
                        {t("homePage.aboutSection.ctaPrimary")}
                    </NavLink>

                    <NavLink
                        to="/home/contact"
                        className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-core-textDark transition hover:bg-black/5 dark:border-white/10 dark:text-core-textLight dark:hover:bg-white/10"
                    >
                        {t("homePage.aboutSection.ctaSecondary")}
                    </NavLink>
                </div>


            </div>

            <div className="relative">
                <div className="overflow-hidden rounded-[28px] border border-black/8 bg-white/70 shadow-[0_20px_60px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-white/5">
                    <img
                        key={active.image}
                        src={active.image}
                        alt={active.title}
                        className="h-[320px] w-full object-cover sm:h-[420px] md:h-[520px]"
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <div className="flex items-center justify-center gap-2 pt-3">                    {slides.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 rounded-full transition-all ${
                                activeIndex === index
                                    ? "w-8 bg-core-brand dark:bg-core-textAccent"
                                    : "w-2.5 bg-black/20 hover:bg-black/35 dark:bg-white/20 dark:hover:bg-white/35"
                            }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}