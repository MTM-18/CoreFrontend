import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FaCalendarDays,
    FaDownload,
    FaEye,
    FaFileLines,
    FaFilePdf,
} from "react-icons/fa6";

import { useCmsItems } from "../cms/useCmsItems";
import PageShell from "../components/layout/PageShell";
import SearchFilterBar from "../components/ui/SearchFilterBar";
import SectionEyebrow from "../components/ui/SectionEyebrow";

export default function ReportsPage() {
    const { i18n } = useTranslation();
    const lang = i18n.language.startsWith("ar") ? "ar" : "en";
    const isAr = lang === "ar";
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const cmsReports = useCmsItems("reports");
    const cmsFilters = useCmsItems("filters").filter((filter) => filter.program === "reports");
    const reports = cmsReports.map((report) => ({
        id: report.id,
        title: { en: report.title_en, ar: report.title_ar },
        description: { en: report.body_en, ar: report.body_ar },
        cover: report.image_path,
        type: { en: report.subtitle_en || "Report", ar: report.subtitle_ar || "تقرير" },
        year: report.published_at.slice(0, 4),
        viewUrl: report.media_path || report.external_url,
        downloadUrl: report.media_path || report.external_url,
        filterId: report.filter_id,
    }));
    const filters = cmsFilters.map((filter) => ({
        id: filter.id,
        label: lang === "ar" ? filter.title_ar : filter.title_en,
    }));
    const selectedFilter = activeFilter === "all" || filters.some((filter) => filter.id === activeFilter)
        ? activeFilter
        : "all";
    const normalizedSearch = search.trim().toLocaleLowerCase();
    const visibleReports = reports.filter((report) => {
        const text = `${report.title[lang]} ${report.description[lang]} ${report.type[lang]}`.toLocaleLowerCase();
        return (selectedFilter === "all" || report.filterId === selectedFilter) && (!normalizedSearch || text.includes(normalizedSearch));
    });

    return (
        <PageShell>
            <section
                dir={isAr ? "rtl" : "ltr"}
                className="min-h-screen bg-core-bg px-4 py-9 text-core-textDark dark:text-core-textLight sm:px-6 sm:py-12 lg:px-10"
            >
                <div className="mx-auto w-full max-w-6xl">
                    <div className="max-w-3xl">
                        <SectionEyebrow>{isAr ? "المعرفة والأثر" : "Core reports"}</SectionEyebrow>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
                            {isAr ? "التقارير" : "Reports"}
                        </h1>
                        <p className="mt-4 text-sm leading-7 text-core-textDark/80 dark:text-white/80 md:text-base">
                            {isAr
                                ? "استكشف تقاريرنا، اطلع عليها مباشرة، أو نزل نسخة للاحتفاظ بها."
                                : "Explore our publications, view them online, or download a copy to keep."}
                        </p>
                    </div>

                    <SearchFilterBar
                        search={search}
                        onSearch={setSearch}
                        searchPlaceholder={isAr ? "ابحث في التقارير" : "Search reports"}
                        filter={selectedFilter}
                        onFilter={setActiveFilter}
                        filterPlaceholder={isAr ? "كل التصنيفات" : "All filters"}
                        options={[
                            { value: "all", label: isAr ? "كل التصنيفات" : "All filters" },
                            ...filters.map((filter) => ({ value: filter.id, label: filter.label })),
                        ]}
                    />

                    <div className="mt-6 space-y-5">
                        {visibleReports.map((report, index) => {
                            const viewUrl = report.viewUrl;
                            const downloadUrl = report.downloadUrl;
                            return (
                                <article
                                    key={report.id}
                                    className="group relative isolate overflow-hidden rounded-[1.75rem] border border-black/10 bg-gradient-to-br from-[#291034] via-[#552451] to-[#8b3d27] shadow-[0_18px_55px_rgba(31,10,45,0.1)] transition-shadow duration-300 hover:shadow-[0_24px_65px_rgba(31,10,45,0.18)] dark:border-white/10 sm:grid sm:grid-cols-[13rem_1fr] lg:grid-cols-[14rem_1fr]"
                                    style={{ transform: "translateZ(0)" }}
                                >
                                    <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_12%_15%,white_0,transparent_30%),radial-gradient(circle_at_88%_85%,#ff7b27_0,transparent_32%)]" />
                                    <div className="relative block min-h-72 overflow-hidden sm:min-h-0">
                                        <img
                                            src={report.cover}
                                            alt={`${report.title[lang]} cover`}
                                            className="absolute inset-0 h-full w-full object-cover object-top"
                                            loading={index === 0 ? "eager" : "lazy"}
                                            decoding="async"
                                        />
                                        <span className="absolute start-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                                            <FaFilePdf />
                                            {isAr ? "تقرير كور" : "Core report"}
                                        </span>
                                    </div>

                                    <div className="relative flex flex-col justify-center p-5 text-white sm:p-6 lg:px-8 lg:py-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-core-accent">
                                            {isAr ? `الإصدار ${index + 1}` : `Publication ${String(index + 1).padStart(2, "0")}`}
                                        </p>
                                        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-[1.65rem]">
                                            {report.title[lang]}
                                        </h2>
                                        <p className="mt-2 max-w-4xl text-sm leading-6 text-white/75">
                                            {report.description[lang]}
                                        </p>

                                        <div className="mt-4 grid w-full max-w-4xl grid-cols-3 border-y border-white/10 py-3">
                                            <div className="flex items-center gap-2.5 pe-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-core-accent">
                                                    <FaFileLines />
                                                </span>
                                                <div>
                                                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                                                        {isAr ? "نوع التقرير" : "Report type"}
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-white">
                                                        {report.type[lang]}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 border-x border-white/10 px-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-core-accent">
                                                    <FaFilePdf />
                                                </span>
                                                <div>
                                                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                                                        {isAr ? "الصيغة" : "Format"}
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-white">PDF</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2.5 ps-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-core-accent">
                                                    <FaCalendarDays />
                                                </span>
                                                <div>
                                                    <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                                                        {isAr ? "السنة" : "Year"}
                                                    </p>
                                                    <p className="mt-0.5 text-xs font-medium text-white">{report.year}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 flex w-full max-w-3xl flex-wrap gap-3">
                                            <a
                                                href={viewUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-core-brand px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"
                                            >
                                                <FaEye />
                                                {isAr ? "عرض التقرير" : "View report"}
                                            </a>
                                            <a
                                                href={downloadUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-semibold text-core-textDark transition hover:-translate-y-0.5 hover:border-core-accent dark:border-white/20 dark:bg-white/10 dark:text-white"
                                            >
                                                <FaDownload />
                                                {isAr ? "تنزيل" : "Download"}
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                    {visibleReports.length === 0 && (
                        <p className="mt-8 text-center text-core-textDark/60 dark:text-white/60">
                            {reports.length === 0
                                ? (isAr ? "ستظهر التقارير هنا بعد نشرها من لوحة التحكم." : "Reports will appear here after they are published from the admin dashboard.")
                                : (isAr ? "لا توجد نتائج." : "No matching reports.")}
                        </p>
                    )}
                </div>
            </section>
        </PageShell>
    );
}
