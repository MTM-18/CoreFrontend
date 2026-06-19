import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { listItems } from "../../../cms/api";

import FallbackImage from "../../../assets/logo/fullColorLogo.svg";
import Vector1 from "../../../assets/icons/PatternCard6 1.svg";

type NewsItem = {
    id: string;
    title: string;
    body: string | null;
    image_path: string | null;
    published_at: string;
};

type NewsApiItem = {
    id?: unknown;
    title?: unknown;
    body?: unknown;
    image_path?: unknown;
    published_at?: unknown;
};

type NewsApiResponse = {
    ok?: boolean;
    items?: NewsApiItem[];
};

function nullableString(value: unknown): string | null {
    return typeof value === "string" ? value : null;
}

function formatDate(iso: string, lang: "ar" | "en") {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : "en", {
        month: "long",
        year: "numeric",
    }).format(d);
}

export default function NewsSection() {
    const { t, i18n } = useTranslation();

    const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";
    const isRTL = lang === "ar";

    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                setError("");

                if (import.meta.env.DEV) {
                    const localItems = await listItems("news");
                    setItems(localItems.slice(0, 4).map((item) => ({
                        id: item.id,
                        title: lang === "ar" ? item.title_ar : item.title_en,
                        body: lang === "ar" ? item.body_ar : item.body_en,
                        image_path: item.image_path || null,
                        published_at: item.published_at,
                    })));
                    return;
                }

                const res = await fetch(`/api/news.php?limit=4&lang=${lang}`, {
                    signal: controller.signal,
                    headers: { Accept: "application/json" },
                });

                const data = await res.json() as NewsApiResponse;

                if (!res.ok || !data?.ok) {
                    setError("Failed to load news");
                    setItems([]);
                    return;
                }

                const mapped: NewsItem[] = (data.items ?? []).map((n) => ({
                    id: String(n.id),
                    title: String(n.title ?? ""),
                    body: nullableString(n.body),
                    image_path: nullableString(n.image_path),
                    published_at: String(n.published_at ?? ""),
                }));

                setItems(mapped);
            } catch (error: unknown) {
                if (error instanceof DOMException && error.name === "AbortError") return;
                setError("Failed to load news");
                setItems([]);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [lang]);

    useEffect(() => {
        setActiveId("");
    }, [items, lang]);

    const list = useMemo(() => items, [items]); // latest -> oldest
    const active = useMemo(
        () => list.find((x) => x.id === activeId) ?? list[0],
        [list, activeId]
    );

    return (
        <section className="py-5 md:py-5" dir={isRTL ? "rtl" : "ltr"}>
            <div className="layout-shell mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold text-core-brand dark:text-core-textAccent">
                        {t("homePage.newsSection.title")}
                    </h2>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="grid gap-6 lg:grid-cols-[420px,1fr]">
                        <div className="card-surface h-[320px] md:h-[360px] animate-pulse" />
                        <div className="space-y-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="card-surface h-[96px] animate-pulse" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="card-surface p-4 text-sm text-core-textDark dark:text-core-textLight">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && list.length === 0 && (
                    <div className="text-sm text-core-textDark dark:text-core-textLight">
                        {t("homePage.newsSection.empty")}
                    </div>
                )}

                {/* Main */}
                {!loading && !error && list.length > 0 && active && (
                    <div className="grid gap-6 lg:grid-cols-[420px,1fr] items-start">
                        {/* LEFT: Latest News + IMAGE ONLY preview */}
                        <aside className="relative">
                            <img
                                src={Vector1}
                                alt=""
                                className={`pointer-events-none absolute -top-6 ${isRTL ? "-left-6" : "-right-6"
                                    } w-20 opacity-20`}
                                draggable={false}
                            />

                            <div className="space-y-4">


                                {/* ✅ Preview = image only, rounded */}
                                <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-card">
                                    <div className="relative h-[336px] xl:h-[372px]">
                                        <img
                                            src={active.image_path || FallbackImage}
                                            alt=""
                                            className={`absolute inset-0 h-full w-full ${active.image_path ? "object-cover" : "object-contain p-10"
                                                }`}
                                            draggable={false}
                                            loading="lazy"
                                            decoding="async"
                                            onError={(event) => {
                                                event.currentTarget.src = FallbackImage;
                                                event.currentTarget.className = "absolute inset-0 h-full w-full object-contain p-10";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                        {/* optional date pill */}
                                        <div className="absolute top-4 left-4">
                                            <span className="text-[11px] px-3 py-1 rounded-full bg-white/80 text-black">
                                                {formatDate(active.published_at, lang)}
                                            </span>
                                        </div>

                                        {/* NEW badge if selected is latest */}
                                        {list[0]?.id === active.id && (
                                            <div className="absolute top-4 right-4">
                                                <span className="text-[10px] px-2 py-1 rounded-full bg-core-accent text-white">
                                                    {t("homePage.newsSection.tagNew")}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* optional button */}
                                {/* <div>
                                    <a
                                        href="/home/news"
                                        className="inline-flex items-center gap-2 rounded-full bg-core-brand text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                                    >
                                        {t("homePage.newsSection.viewAll")}
                                        <span aria-hidden>↗</span>
                                    </a>
                                </div> */}
                            </div>
                        </aside>

                        {/* RIGHT: List + FAQ expand (desktop + mobile text) */}
                        <div className="space-y-3 lg:min-h-[336px] xl:min-h-[372px]">
                            {list.map((n, idx) => {
                                const selected = n.id === activeId;

                                return (
                                    <div
                                        key={`${lang}-${n.id}`}
                                        className="overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] shadow-[0_14px_35px_rgba(0,0,0,0.18)]"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setActiveId((current) => (current === n.id ? "" : n.id))}
                                            aria-expanded={selected}
                                            className={`
                        w-full min-h-[75px] px-5 py-3 flex items-start gap-4
                        transition
                        ${selected ? "bg-white/[0.07]" : "hover:bg-white/[0.06]"}
                        ${isRTL ? "text-right" : "text-left"}
                      `}
                                        >
                                            <div className="shrink-0 mt-1">
                                                <div
                                                    className={`
                            h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold
                            ${selected ? "bg-core-accent text-white" : "bg-white/10 text-white/80"}
                          `}
                                                >
                                                    {idx + 1}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="text-[11px] uppercase text-core-textMuted">
                                                    • {formatDate(n.published_at, lang)}
                                                </div>

                                                <div className="mt-1 text-sm md:text-base font-semibold leading-snug text-core-textDark dark:text-core-textLight line-clamp-2">
                                                    {n.title}
                                                </div>

                                                {/* Expand like FAQ (text only) */}
                                                <div
                                                    className={`
                            grid transition-[grid-template-rows,opacity] duration-300 ease-out
                            ${selected ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                          `}
                                                >
                                                    <div className="overflow-hidden">
                                                        {n.body && (
                                                            <p className="mt-3 text-sm text-core-textMuted leading-relaxed">
                                                                {n.body}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`shrink-0 mt-1 text-xl leading-none ${selected ? "text-core-accent" : "text-white/60"}`}>
                                                {selected ? "−" : "+"}
                                            </div>
                                        </button>

                                        {selected && (
                                            <div className="h-[2px] bg-gradient-to-r from-core-accent/70 to-transparent" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
