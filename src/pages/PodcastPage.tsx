import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight, FaPlay, FaTimes, FaYoutube } from "react-icons/fa";
import PageShell from "../compnents/layout/PageShell";

type LocalizedText = { en: string; ar: string };

type Episode = {
    number: number;
    videoId: string;
    title: LocalizedText;
    guest: LocalizedText;
    description: LocalizedText;
};

type PodcastShort = {
    videoId: string;
    episode: number;
    title: LocalizedText;
};

const EPISODES: Episode[] = [
    {
        number: 1,
        videoId: "-0N8RswPKso",
        title: {
            en: "From Silicon Valley to Istanbul: A Recipe for Building Startups",
            ar: "من وادي السيليكون إلى إسطنبول: وصفة بناء الشركات الناشئة",
        },
        guest: {
            en: "Niels Nielsen, entrepreneur and entrepreneurship leader",
            ar: "نيلز نيلسن (Niels Nielsen)، رائد أعمال وقائد في مجال ريادة الأعمال",
        },
        description: {
            en: "The episode explores the right steps for raising funds and when founders should move from bootstrapping to angel investment. It also discusses startup collaboration through shared solutions, market integration, and unified purchasing power.",
            ar: "ناقشت الحلقة الخطوات الصحيحة لجمع التمويل ومتى يجب على رائد الأعمال الانتقال من التمويل الذاتي إلى المستثمرين الملائكيين، مع التركيز على وضوح القيمة المضافة والتعاون بين الشركات الناشئة في الحلول والأسواق والقوة الشرائية.",
        },
    },
    {
        number: 2,
        videoId: "MTM7acSSqMM",
        title: {
            en: "From Nuclear Engineering to Youth Empowerment and Entrepreneurship",
            ar: "من هندسة الطاقة النووية إلى تمكين الشباب وريادة الأعمال",
        },
        guest: {
            en: "Engineer Ayman Jarwan, founder and president of Yoho Work",
            ar: "المهندس أيمن جروان، مؤسس ورئيس منصة Yoho Work",
        },
        description: {
            en: "Ayman shares his journey from studying nuclear engineering in the United States to entrepreneurship and economic empowerment. The conversation covers service exports, connecting youth in crisis-affected areas to global markets, and the importance of patience when building a career.",
            ar: "استعرض المهندس أيمن رحلته من دراسة الهندسة النووية في أمريكا إلى ريادة الأعمال والتمكين الاقتصادي، وفلسفة تصدير الخدمات وربط الشباب في مناطق الأزمات بالسوق العالمي، مع التأكيد على الصبر وعدم حرق المراحل.",
        },
    },
];

const YOUTUBE_SHORTS: PodcastShort[] = [
    {
        videoId: "s1OQW7W-R-w",
        episode: 1,
        title: {
            en: "Three questions to answer before asking for investment",
            ar: "ثلاثة أسئلة يجب أن تجيب عنها قبل طلب أي استثمار",
        },
    },
    {
        videoId: "pANINpWMNUg",
        episode: 1,
        title: {
            en: "How do you value your company correctly?",
            ar: "كيف تُقيّم شركتك بطريقة صحيحة؟",
        },
    },
    {
        videoId: "VdtRe1oQ_CU",
        episode: 1,
        title: {
            en: "What you want from your business determines its size",
            ar: "ما تريده من مشروعك هو ما يحدد حجمه",
        },
    },
    {
        videoId: "VzQeDWjnPTs",
        episode: 1,
        title: {
            en: "From 800 million to only 2.5 dollars: timing matters",
            ar: "من 800 مليون إلى 2.5 دولار فقط، والسبب التوقيت",
        },
    },
    {
        videoId: "dKgQbILblao",
        episode: 1,
        title: {
            en: "What I would do immediately as an entrepreneur in Turkey",
            ar: "لو كنت رائد أعمال في تركيا لفعلت هذا فوراً",
        },
    },
    {
        videoId: "3ff4u4zdvj4",
        episode: 1,
        title: {
            en: "Fear of sharing can stop a business from growing",
            ar: "الخوف من المشاركة أحد أسباب فشل نمو المشاريع",
        },
    },
    {
        videoId: "hGUk88IdSWk",
        episode: 2,
        title: {
            en: "From a small room at home to working with the global market",
            ar: "من غرفة صغيرة في بلدي إلى العمل مع السوق العالمي، كيف؟",
        },
    },
    {
        videoId: "hBqFtoUqsg8",
        episode: 2,
        title: {
            en: "Skills are the new currency of the labor market",
            ar: "المهارة، عملة سوق العمل الجديدة",
        },
    },
    {
        videoId: "WIbKiX_r3iA",
        episode: 2,
        title: {
            en: "Changing career paths is easier today than ever",
            ar: "تغيير المسار المهني اليوم أسهل من أي وقت مضى",
        },
    },
    {
        videoId: "QUCpNC_ISjo",
        episode: 2,
        title: {
            en: "Real education teaches us how to think",
            ar: "في التعليم الحقيقي، نتعلّم كيف نفكّر، لا ماذا نفكّر",
        },
    },
    {
        videoId: "rhiEeuFPoN0",
        episode: 2,
        title: {
            en: "Failure is not the end, but the beginning of success",
            ar: "الفشل ليس النهاية، بل هو بداية قصة نجاحك",
        },
    },
];

const thumbnailUrl = (videoId: string) => `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

export default function PodcastPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language.startsWith("ar") ? "ar" : "en";
    const isAr = lang === "ar";
    const [activeVideoId, setActiveVideoId] = useState(EPISODES[0].videoId);
    const [activeShort, setActiveShort] = useState<PodcastShort | null>(null);
    const shortsRef = useRef<HTMLDivElement | null>(null);
    const shortsDragRef = useRef({
        active: false,
        moved: false,
        startX: 0,
        startScrollLeft: 0,
        lastX: 0,
        lastTime: 0,
        velocity: 0,
        pointerId: -1,
    });
    const suppressShortClickRef = useRef(false);
    const activeEpisode = EPISODES.find((episode) => episode.videoId === activeVideoId) ?? EPISODES[0];
    const activeEpisodeShorts = YOUTUBE_SHORTS.filter(
        (short) => short.episode === activeEpisode.number
    );

    const selectEpisode = (videoId: string) => {
        setActiveVideoId(videoId);
        setActiveShort(null);
        if (shortsRef.current) shortsRef.current.scrollLeft = 0;
    };

    useEffect(() => {
        if (!activeShort) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveShort(null);
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [activeShort]);

    const scrollShorts = (direction: -1 | 1) => {
        shortsRef.current?.scrollBy({
            left: direction * Math.min(window.innerWidth * 0.72, 720),
            behavior: "smooth",
        });
    };

    const startShortsDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "mouse" || event.button !== 0 || !shortsRef.current) return;

        shortsDragRef.current = {
            active: true,
            moved: false,
            startX: event.clientX,
            startScrollLeft: shortsRef.current.scrollLeft,
            lastX: event.clientX,
            lastTime: event.timeStamp,
            velocity: 0,
            pointerId: event.pointerId,
        };
        shortsRef.current.style.scrollSnapType = "none";
        shortsRef.current.style.scrollBehavior = "auto";
    };

    const moveShortsDrag = (event: React.PointerEvent<HTMLDivElement>) => {
        const drag = shortsDragRef.current;
        if (!drag.active || !shortsRef.current) return;

        const distance = event.clientX - drag.startX;
        if (Math.abs(distance) > 5 && !drag.moved) {
            drag.moved = true;
            shortsRef.current.setPointerCapture(event.pointerId);
        }
        shortsRef.current.scrollLeft = drag.startScrollLeft - distance;

        const elapsed = event.timeStamp - drag.lastTime;
        if (elapsed > 0) {
            const instantVelocity = (drag.lastX - event.clientX) / elapsed;
            drag.velocity = drag.velocity * 0.7 + instantVelocity * 0.3;
            drag.lastX = event.clientX;
            drag.lastTime = event.timeStamp;
        }
    };

    const finishShortsDrag = () => {
        const drag = shortsDragRef.current;
        if (!drag.active) return;

        drag.active = false;
        if (shortsRef.current?.hasPointerCapture(drag.pointerId)) {
            shortsRef.current.releasePointerCapture(drag.pointerId);
        }

        const carousel = shortsRef.current;
        if (carousel) {
            carousel.style.scrollBehavior = "smooth";
            carousel.scrollBy({ left: drag.velocity * 280, behavior: "smooth" });
            window.setTimeout(() => {
                carousel.style.scrollSnapType = "";
                carousel.style.scrollBehavior = "";
            }, 350);
        }

        if (drag.moved) {
            suppressShortClickRef.current = true;
            window.setTimeout(() => {
                suppressShortClickRef.current = false;
            }, 0);
        }
    };

    const openShort = (short: PodcastShort) => {
        if (!suppressShortClickRef.current) setActiveShort(short);
    };

    return (
        <PageShell>
            <section
                className="mx-auto w-full max-w-6xl overflow-hidden px-4 py-10 sm:px-6 md:py-16 lg:px-0"
                dir={isAr ? "rtl" : "ltr"}
            >
                <header className="max-w-5xl py-3 md:py-5">
                    <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                        {isAr ? "حوارات ملهمة وتجارب حقيقية" : "Real Stories. Practical Conversations."}
                    </h1>
                    <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-core-brand to-core-accent" />
                </header>

                <section className="mt-3">
                    <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                        {isAr ? "أحدث الحلقات" : "Latest Episodes"}
                    </h2>

                    <div className="podcast-episode-layout overflow-hidden rounded-[24px] border border-white/10 bg-black/25 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                        <div className="aspect-video w-full bg-black">
                            <iframe
                                key={activeEpisode.videoId}
                                src={`https://www.youtube-nocookie.com/embed/${activeEpisode.videoId}?rel=0`}
                                title={activeEpisode.title[lang]}
                                className="h-full w-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                            />
                        </div>

                        <aside className="podcast-episode-sidebar border-t border-white/10 bg-black/20">
                            <div className="bg-gradient-to-br from-white/[0.07] to-transparent p-5 sm:p-6 md:p-8">
                                <h3 className="max-w-4xl text-2xl font-semibold leading-tight text-white md:text-3xl">
                                    {activeEpisode.title[lang]}
                                </h3>
                                <p className="mt-3 text-sm font-semibold leading-6 text-white">
                                    {isAr ? "الضيف: " : "Guest: "}
                                    {activeEpisode.guest[lang]}
                                </p>
                            </div>
                            <div>
                                <div className="border-t border-white/10 px-5 py-4 text-sm font-semibold text-white/75 sm:px-6">
                                    {isAr ? "الحلقات التالية" : "Next Episodes"}
                                </div>
                                <div className="grid gap-px bg-white/10 md:grid-cols-2">
                                    {EPISODES.map((episode) => {
                                        const isActive = episode.videoId === activeEpisode.videoId;
                                        return (
                                            <button
                                                key={episode.videoId}
                                                type="button"
                                                onClick={() => selectEpisode(episode.videoId)}
                                                className={[
                                                    "grid w-full grid-cols-[120px,minmax(0,1fr)] items-center gap-4 overflow-hidden bg-[#1a0b1b]/95 p-4 text-start transition sm:grid-cols-[170px,minmax(0,1fr)]",
                                                    isActive ? "bg-white/10 shadow-[inset_0_3px_0_#f37b27]" : "hover:bg-white/[0.06]",
                                                ].join(" ")}
                                            >
                                                <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
                                                    <img
                                                        src={thumbnailUrl(episode.videoId)}
                                                        alt=""
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-full w-full object-cover"
                                                    />
                                                    <span className="absolute inset-0 grid place-items-center bg-black/15">
                                                        <span className="grid h-9 w-9 place-items-center rounded-full bg-red-600 text-[11px] text-white shadow-lg">
                                                            <FaPlay className="ms-0.5" />
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="line-clamp-3 break-words text-sm font-semibold leading-6 text-white sm:text-base">
                                                        {episode.title[lang]}
                                                    </h4>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mt-14">
                    <div className="flex items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <FaYoutube className="text-2xl text-red-500" />
                                <h2 className="text-xl font-semibold text-white md:text-2xl">
                                    {isAr ? "مقتطفات قصيرة" : "YouTube Shorts"}
                                </h2>
                            </div>
                            <p className="mt-2 text-sm text-white">
                                {isAr
                                    ? "أفكار سريعة ولحظات مختارة من الحلقة المحددة."
                                    : "Quick ideas and selected moments from the selected episode."}
                            </p>
                        </div>
                        <div className="hidden items-center gap-2 sm:flex" dir="ltr">
                            <button
                                type="button"
                                onClick={() => scrollShorts(-1)}
                                aria-label={isAr ? "السابق" : "Previous Shorts"}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
                            >
                                <FaChevronLeft />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollShorts(1)}
                                aria-label={isAr ? "التالي" : "Next Shorts"}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-white/75 transition hover:bg-white/10 hover:text-white"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={shortsRef}
                        dir="ltr"
                        onPointerDown={startShortsDrag}
                        onPointerMove={moveShortsDrag}
                        onPointerUp={finishShortsDrag}
                        onPointerCancel={finishShortsDrag}
                        onDragStart={(event) => event.preventDefault()}
                        className="mt-5 flex cursor-grab snap-x snap-proximity select-none gap-4 overflow-x-auto overscroll-x-contain scroll-smooth pb-5 touch-pan-x active:cursor-grabbing [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]"
                    >
                        {activeEpisodeShorts.map((short) => (
                            <button
                                key={short.videoId}
                                type="button"
                                onClick={() => openShort(short)}
                                dir={isAr ? "rtl" : "ltr"}
                                className="group relative aspect-[9/16] w-[190px] shrink-0 snap-start overflow-hidden rounded-2xl border border-white/10 bg-black shadow-lg transition duration-300 hover:-translate-y-1 hover:border-white/25 sm:w-[220px]"
                            >
                                <img
                                    src={thumbnailUrl(short.videoId)}
                                    alt={short.title[lang]}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                                <span className="absolute end-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-red-600 text-sm text-white shadow-lg transition group-hover:scale-110">
                                    <FaPlay className="ms-0.5" />
                                </span>
                                <div className="absolute inset-x-0 bottom-0 p-4">
                                    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                                        {isAr ? `من الحلقة ${short.episode}` : `From Episode ${short.episode}`}
                                    </span>
                                    <h3 className="mt-3 line-clamp-3 text-sm font-semibold leading-5 text-white">
                                        {short.title[lang]}
                                    </h3>
                                    <div className="mt-3 text-[11px] font-semibold text-white/65">
                                        {isAr ? "تشغيل المقطع" : "Play Short"}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </section>

            {activeShort && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeShort.title[lang]}
                    className="fixed inset-0 z-[100] grid place-items-center bg-black/85 p-4 backdrop-blur-md"
                    onClick={() => setActiveShort(null)}
                >
                    <div
                        className="relative w-[min(94vw,calc((100dvh-6rem)*9/16))] max-w-[470px] rounded-[28px] bg-gradient-to-br from-core-brand via-fuchsia-600 to-core-accent p-[2px] shadow-[0_30px_100px_rgba(0,0,0,0.7)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="overflow-hidden rounded-[26px] bg-[#100617]">
                            <div className="flex items-center justify-between gap-4 px-4 py-3">
                                <div className="min-w-0">
                                    <h2 className="truncate text-sm font-semibold text-white">
                                        {activeShort.title[lang]}
                                    </h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveShort(null)}
                                    aria-label={isAr ? "إغلاق" : "Close"}
                                    className="grid h-8 w-8 shrink-0 place-items-center text-white/80 transition hover:text-white"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="aspect-[9/16] w-full bg-black">
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${activeShort.videoId}?autoplay=1&playsinline=1&rel=0`}
                                    title={activeShort.title[lang]}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    referrerPolicy="strict-origin-when-cross-origin"
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    );
}
