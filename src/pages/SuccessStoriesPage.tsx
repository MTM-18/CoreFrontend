import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlay, FaXmark } from "react-icons/fa6";

import { useCmsItems } from "../cms/useCmsItems";
import PageShell from "../components/layout/PageShell";
import SearchFilterBar from "../components/ui/SearchFilterBar";
import SectionEyebrow from "../components/ui/SectionEyebrow";

function driveEmbedUrl(url: string) {
    const pathMatch = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    const queryMatch = url.match(/[?&]id=([^&#]+)/);
    const fileId = pathMatch?.[1] || queryMatch?.[1];
    return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
}

export default function SuccessStoriesPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language.startsWith("ar") ? "ar" : "en";
    const isAr = lang === "ar";
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const cmsStories = useCmsItems("stories");
    const cmsFilters = useCmsItems("filters").filter((filter) => filter.program === "stories");
    const stories = cmsStories.map((story) => ({
        id: story.id,
        name: { en: story.title_en, ar: story.title_ar },
        program: { en: story.subtitle_en || story.program, ar: story.subtitle_ar || story.program },
        quote: { en: story.body_en, ar: story.body_ar },
        link: story.media_path || story.external_url,
        image: story.image_path,
        imagePosition: "object-center",
        filterId: story.filter_id,
    }));
    const filters = cmsFilters.map((filter) => ({
        id: filter.id,
        label: lang === "ar" ? filter.title_ar : filter.title_en,
    }));
    const selectedFilter = activeFilter === "all" || filters.some((filter) => filter.id === activeFilter)
        ? activeFilter
        : "all";
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const visibleStories = stories.filter((story) => {
        const text = `${story.name[lang]} ${story.program[lang]} ${story.quote[lang]}`.toLocaleLowerCase();
        return (selectedFilter === "all" || story.filterId === selectedFilter) && (!normalizedSearch || text.includes(normalizedSearch));
    });

    return (
        <PageShell>
            <section
                dir={isAr ? "rtl" : "ltr"}
                className="min-h-screen bg-core-bg px-4 py-9 text-core-textDark dark:text-core-textLight sm:px-6 sm:py-12 lg:px-10"
            >
                <div className="mx-auto w-full max-w-6xl">
                    <div className="max-w-3xl">
                        <SectionEyebrow>{isAr ? "خريجو برامج كور" : "Core program graduates"}</SectionEyebrow>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                            {isAr ? "القصص الملهمة" : "Inspiring Stories"}
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-core-textDark/80 dark:text-white/80 md:text-base">
                            {isAr
                                ? "تعرفوا إلى تجارب خريجينا، والمهارات التي اكتسبوها، والخطوات التي بدأوا بها رحلتهم المهنية."
                                : "Meet our graduates and discover the skills, confidence, and practical steps that shaped their professional journeys."}
                        </p>
                    </div>

                    <SearchFilterBar
                        search={search}
                        onSearch={setSearch}
                        searchPlaceholder={isAr ? "ابحث في القصص الملهمة" : "Search inspiring stories"}
                        filter={selectedFilter}
                        onFilter={setActiveFilter}
                        filterPlaceholder={isAr ? "كل التصنيفات" : "All filters"}
                        options={[
                            { value: "all", label: isAr ? "كل التصنيفات" : "All filters" },
                            ...filters.map((filter) => ({ value: filter.id, label: filter.label })),
                        ]}
                    />

                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {visibleStories.map((story) => (
                            <button
                                type="button"
                                key={story.id}
                                onClick={() => setActiveVideo(story.link)}
                                className="group isolate block overflow-hidden rounded-[1.4rem] bg-white/70 text-start shadow-[0_18px_45px_rgba(31,10,45,0.12)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(31,10,45,0.2)] dark:bg-[#1b0b20]"
                                style={{ transform: "translateZ(0)" }}
                            >
                                <div className="relative aspect-[4/4.4] overflow-hidden bg-black/10">
                                    <img
                                        src={story.image}
                                        alt=""
                                        aria-hidden="true"
                                        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl md:hidden ${story.imagePosition}`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-black/20 md:hidden" />
                                    <img
                                        src={story.image}
                                        alt={story.name[lang]}
                                        className={`relative h-full w-full object-contain md:object-cover ${story.imagePosition}`}
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1b0b20] via-black/20 via-35% to-transparent" />

                                    <span className="absolute start-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white shadow-lg backdrop-blur-md md:start-5 md:top-5">
                                        {story.program[lang]}
                                    </span>

                                    <span className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-core-brand shadow-[0_12px_32px_rgba(0,0,0,0.38)] transition group-hover:scale-105">
                                        <FaPlay className="ms-1 text-sm" />
                                    </span>
                                </div>

                                <div className="relative bg-white/70 p-4 dark:bg-[#1b0b20]">
                                    <h2 className="text-base font-semibold text-core-textDark dark:text-white">
                                        {story.name[lang]}
                                    </h2>
                                    <p className="mt-2 line-clamp-3 border-s-2 border-core-accent ps-3 text-xs italic leading-5 text-core-textDark/75 dark:text-white/80">
                                        &ldquo;{story.quote[lang]}&rdquo;
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                    {visibleStories.length === 0 && (
                        <p className="mt-8 text-center text-core-textDark/60 dark:text-white/60">
                            {stories.length === 0
                                ? (isAr ? "ستظهر القصص الملهمة هنا بعد نشرها من لوحة التحكم." : "Inspiring stories will appear here after they are published from the admin dashboard.")
                                : (isAr ? "لا توجد نتائج." : "No matching inspiring stories.")}
                        </p>
                    )}
                </div>
            </section>
            {activeVideo && (
                <div className="fixed inset-0 z-[100] grid place-items-center bg-[#09040c]/90 p-4 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
                    <div className="relative w-full max-w-5xl rounded-[2rem] bg-gradient-to-br from-core-brand via-[#552451] to-core-accent p-[2px] shadow-[0_35px_110px_rgba(0,0,0,.75)]" onClick={(event) => event.stopPropagation()}>
                        <div className="relative overflow-hidden rounded-[calc(2rem-2px)] border border-white/10 bg-[#0d0710] p-3 sm:p-4">
                            <button type="button" className="absolute end-5 top-5 z-20 flex h-10 w-10 items-center justify-center text-core-accent transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-core-accent" onClick={() => setActiveVideo(null)} aria-label={isAr ? "إغلاق" : "Close video"}><FaXmark className="text-2xl drop-shadow-[0_4px_14px_rgba(0,0,0,.7)]" /></button>
                            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-inner">
                                {activeVideo.includes("youtube.com") || activeVideo.includes("youtu.be") ? (
                                    <iframe title="Inspiring story video" src={activeVideo.replace("watch?v=", "embed/").replace("youtu.be/", "www.youtube.com/embed/")} className="aspect-video w-full" allow="autoplay; encrypted-media; picture-in-picture" loading="lazy" allowFullScreen />
                                ) : activeVideo.includes("drive.google.com") && driveEmbedUrl(activeVideo) ? (
                                    <iframe title="Success story media" src={driveEmbedUrl(activeVideo) || undefined} className="aspect-video w-full bg-black" allow="autoplay; fullscreen" loading="lazy" allowFullScreen />
                                ) : activeVideo.includes("drive.google.com/drive/folders/") ? (
                                    <div className="grid min-h-80 place-items-center px-6 py-16 text-center text-white">
                                        <div className="max-w-lg">
                                            <h3 className="text-xl font-semibold">This is a Google Drive folder link</h3>
                                            <p className="mt-3 text-sm leading-7 text-white/70">
                                                Open the video file inside the folder, choose Share, and paste the individual file link ending in /file/d/.../view.
                                            </p>
                                            <a href={activeVideo} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-full bg-core-accent px-5 py-3 text-sm font-semibold text-white">
                                                Open Drive folder
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <video src={activeVideo} className="max-h-[85vh] w-full" controls autoPlay playsInline />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PageShell>
    );
}
