import { useTranslation } from "react-i18next";

const ABOUT_VIDEO_ID = "abZAhxDVUwk";

export default function AboutSection() {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.language?.startsWith("ar");

    return (
        <section className="">
            <div className="layout-shell mx-auto">
                {/* Soft container to “organize” the section */}
                <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_20px_80px_rgba(0,0,0,0.35)] p-6 md:p-10">
                    <div
                        dir={isRTL ? "rtl" : "ltr"}
                        className="grid gap-10 md:gap-12 lg:grid-cols-2 items-center"
                    >
                        {/* TEXT */}
                        <div className={isRTL ? "lg:order-2" : "lg:order-1"}>


                            <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent">
                                {t("homePage.aboutSection.title")}
                            </h2>

                            <p className="mt-5 max-w-prose text-base md:text-lg leading-relaxed text-core-textDark/90 dark:text-core-textLight/90">
                                {t("homePage.aboutSection.body")}
                            </p>

                            {/* Optional CTA row */}
                            <div className="mt-7 flex flex-wrap gap-3">
                                <a
                                    href="/about"
                                    className="rounded-full bg-core-brand dark:bg-core-accent px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition"
                                >
                                    {t("homePage.aboutSection.ctaPrimary") /* add key */}
                                </a>

                                <a
                                    href="/contact"
                                    className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
                                >
                                    {t("homePage.aboutSection.ctaSecondary") /* add key */}
                                </a>
                            </div>
                        </div>

                        {/* VIDEO */}
                        <div className={isRTL ? "lg:order-1" : "lg:order-2"}>
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
                                {/* subtle glow */}
                                <div className="pointer-events-none absolute -inset-20 opacity-30 blur-3xl bg-gradient-to-r from-core-brand to-core-accent" />
                                <div className="relative aspect-video">
                                    <iframe
                                        className="absolute inset-0 h-full w-full"
                                        src={`https://www.youtube.com/embed/${ABOUT_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
                                        title="Core Istanbul introduction video"
                                        loading="lazy"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
