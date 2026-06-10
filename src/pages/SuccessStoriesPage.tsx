import { FaArrowUpRightFromSquare, FaPlay } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

import PageShell from "../compnents/layout/PageShell";
import samaImage from "../assets/stories/sama.png";
import shorouqImage from "../assets/stories/shorouq.png";
import awwabImage from "../assets/stories/awwab.png";

const STORIES = [
    {
        name: { en: "Sama Issa Oghlo", ar: "سما عيسى أوغلو" },
        program: { en: "E-commerce", ar: "التجارة الإلكترونية" },
        quote: {
            en: "From ambition to a real practical project.",
            ar: "من الطموح إلى مشروع عملي حقيقي.",
        },
        link: "https://drive.google.com/drive/folders/150wvwtkO5YZHJrbze3NZz7scjVw36_AQ",
        image: samaImage,
        imagePosition: "object-center",
    },
    {
        name: { en: "Shorouq Osama", ar: "شروق أسامة" },
        program: { en: "E-commerce", ar: "التجارة الإلكترونية" },
        quote: {
            en: "From uncertainty to clarity and confidence.",
            ar: "من التردد إلى الوضوح والثقة.",
        },
        link: "https://drive.google.com/drive/folders/1mkXziAn2A4bwalASBjDNhlIT0UEQ2TxU",
        image: shorouqImage,
        imagePosition: "object-center",
    },
    {
        name: { en: "Awwab Faisal", ar: "أواب فيصل" },
        program: { en: "E-commerce", ar: "التجارة الإلكترونية" },
        quote: {
            en: "From an idea to a planned e-commerce journey.",
            ar: "من الفكرة إلى رحلة تجارة إلكترونية مدروسة.",
        },
        link: "https://drive.google.com/drive/folders/1dp15W-0uBm2XHdqj-P7QXVkes_HfdUgZ",
        image: awwabImage,
        imagePosition: "object-center",
    },
] as const;

export default function SuccessStoriesPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language.startsWith("ar") ? "ar" : "en";
    const isAr = lang === "ar";

    return (
        <PageShell>
            <section
                dir={isAr ? "rtl" : "ltr"}
                className="min-h-screen bg-core-bg px-4 py-9 text-core-textDark dark:text-core-textLight sm:px-6 sm:py-12 lg:px-10"
            >
                <div className="mx-auto w-full max-w-6xl">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-core-accent">
                            {isAr ? "خريجو برامج كور" : "Core program graduates"}
                        </p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                            {isAr ? "قصص النجاح" : "Success Stories"}
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-core-textDark/80 dark:text-white/80 md:text-base">
                            {isAr
                                ? "تعرّفوا إلى تجارب خريجينا، والمهارات التي اكتسبوها، والخطوات التي بدأوا بها رحلتهم المهنية."
                                : "Meet our graduates and discover the skills, confidence, and practical steps that shaped their professional journeys."}
                        </p>
                    </div>

                    <div className="mt-8 grid gap-5 sm:mt-10 md:grid-cols-3">
                        {STORIES.map((story) => (
                            <a
                                key={story.name.en}
                                href={story.link}
                                target="_blank"
                                rel="noreferrer"
                                className="group isolate block overflow-hidden rounded-[2rem] bg-white/70 shadow-[0_22px_65px_rgba(31,10,45,0.14)] transition-shadow duration-300 hover:shadow-[0_26px_70px_rgba(31,10,45,0.22)] dark:bg-[#1b0b20]"
                                style={{ transform: "translateZ(0)" }}
                            >
                                <div className="relative h-64 overflow-hidden bg-black/10 sm:h-72 md:aspect-[4/5] md:h-auto">
                                    <img
                                        src={story.image}
                                        alt=""
                                        aria-hidden="true"
                                        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl md:hidden ${story.imagePosition}`}
                                    />
                                    <div className="absolute inset-0 bg-black/20 md:hidden" />
                                    <img
                                        src={story.image}
                                        alt={story.name[lang]}
                                        className={`relative h-full w-full object-contain md:object-cover ${story.imagePosition}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b0b20] via-black/20 via-35% to-transparent" />

                                    <span className="absolute start-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md md:start-5 md:top-5">
                                        {story.program.en}
                                    </span>

                                    <span className="absolute bottom-7 end-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-core-brand shadow-[0_12px_32px_rgba(0,0,0,0.38)] transition group-hover:scale-105 md:bottom-8 md:end-6 md:h-14 md:w-14">
                                        <FaPlay className="ms-1 text-sm md:text-lg" />
                                    </span>
                                </div>

                                <div className="relative bg-white/70 p-5 pt-4 dark:bg-[#1b0b20] md:p-6 md:pt-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold text-core-textDark dark:text-white md:text-[1.7rem]">
                                                {story.name[lang]}
                                            </h2>
                                            <p className="mt-3 border-s-2 border-core-accent ps-3 text-sm italic leading-6 text-core-textDark/75 dark:text-white/80 md:text-[0.95rem]">
                                                &ldquo;{story.quote[lang]}&rdquo;
                                            </p>
                                        </div>
                                        <FaArrowUpRightFromSquare className="mt-1 shrink-0 text-core-brand transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-core-textAccent" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
