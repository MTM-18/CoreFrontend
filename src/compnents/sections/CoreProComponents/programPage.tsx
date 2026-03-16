import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { ComponentType, ReactNode } from "react";
import {
    FaBrain,
    FaBullhorn,
    FaCalculator,
    FaCamera,
    FaCode,
    FaCouch,
    FaFeatherAlt,
    FaHandshake,
    FaHeartbeat,
    FaIndustry,
    FaLaptopCode,
    FaPenNib,
    FaRocket,
    FaShoppingCart,
    FaTasks,
    FaTruck,
    FaVideo,
} from "react-icons/fa";

const program1Logos = Object.values(
    import.meta.glob("/src/assets/logo/studentLogos/program1/*.{png,jpg,jpeg,webp,svg}", {
        eager: true,
        import: "default",
    })
) as string[];

const program2Logos = Object.values(
    import.meta.glob("/src/assets/logo/studentLogos/program2/*.{png,jpg,jpeg,webp,svg}", {
        eager: true,
        import: "default",
    })
) as string[];

const program3Logos = Object.values(
    import.meta.glob("/src/assets/logo/studentLogos/program3/*.{png,jpg,jpeg,webp,svg}", {
        eager: true,
        import: "default",
    })
) as string[];

type TabKey = "vocational" | "advanced" | "internship" | "entrepreneurship";
type Stat = { value: string; label: string };
type Quote = { name: string; text: string };
type Stage = { title: string; desc: string };

function SectionCard({ title, children }: { title?: string; children: ReactNode }) {
    return (
        <section className="rounded-3xl border border-black/8 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5 md:p-6">
            {title ? (
                <h3 className="mb-4 text-lg font-semibold text-core-textDark dark:text-core-textLight">{title}</h3>
            ) : null}
            {children}
        </section>
    );
}

function SimpleGrid({
                        items,
                        icons,
                    }: {
    items: string[];
    icons: Array<ComponentType<{ className?: string }>>;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((label, index) => {
                const Icon = icons[index] ?? icons[icons.length - 1];
                return (
                    <div
                        key={`${label}-${index}`}
                        className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-core-brand/10 text-core-brand dark:bg-core-textAccent/12 dark:text-core-textAccent">
                            <Icon className="text-base" />
                        </div>
                        <span className="text-sm font-medium leading-6 text-core-textDark dark:text-core-textLight">{label}</span>
                    </div>
                );
            })}
        </div>
    );
}

function StatsGrid({ stats }: { stats: Stat[] }) {
    return (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat, index) => (
                <div
                    key={`${stat.label}-${index}`}
                    className="rounded-2xl border border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                    <div className="text-2xl font-semibold text-core-textDark dark:text-core-textLight">{stat.value}</div>
                    <div className="mt-2 text-sm leading-6 text-core-textMuted dark:text-core-textMutedDark">{stat.label}</div>
                </div>
            ))}
        </div>
    );
}

function LogoGrid({ logos }: { logos: string[] }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4 xl:grid-cols-5">
            {logos.map((src, index) => (
                <div
                    key={`${src}-${index}`}
                    className="flex h-32 w-32 shrink-0 snap-start items-center justify-center rounded-2xl border border-black/8 bg-white p-4 shadow-sm dark:border-white/10 sm:h-auto sm:w-auto sm:aspect-square"
                >
                    <img
                        src={src}
                        alt={`logo-${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            ))}
        </div>
    );
}

function StagesTimeline({ stages }: { stages: Stage[] }) {
    return (
        <div className="space-y-4">
            {stages.map((stage, index) => (
                <div key={`${stage.title}-${index}`} className="flex gap-4 rounded-2xl border border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-core-brand text-sm font-semibold text-white dark:bg-core-textAccent dark:text-black">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-core-textDark dark:text-core-textLight md:text-base">{stage.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark">{stage.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function QuotesGrid({ quotes }: { quotes: Quote[] }) {
    return (
        <div className="grid gap-3 md:grid-cols-2">
            {quotes.map((quote, index) => (
                <div key={`${quote.name}-${index}`} className="rounded-2xl border border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
                    <p className="text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark">“{quote.text}”</p>
                    <div className="mt-3 text-sm font-semibold text-core-textDark dark:text-core-textLight">{quote.name}</div>
                </div>
            ))}
        </div>
    );
}

function ComingSoon({ title, body }: { title: string; body: string }) {
    return (
        <SectionCard title={title}>
            <p className="text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark">{body}</p>
        </SectionCard>
    );
}

export default function ProgramsPage() {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language.startsWith("ar");
    const baseKey = "coreProPage";
    const [active, setActive] = useState<TabKey>("vocational");

    const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({
        vocational: null,
        advanced: null,
        internship: null,
        entrepreneurship: null,
    });

    useEffect(() => {
        tabRefs.current[active]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [active]);

    const getArray = <T,>(key: string): T[] => {
        const value = t(key, { returnObjects: true });
        return Array.isArray(value) ? (value as T[]) : [];
    };

    const tabs = useMemo(
        () => [
            { key: "vocational" as const, label: t(`${baseKey}.tabs.vocational`) },
            { key: "advanced" as const, label: t(`${baseKey}.tabs.advanced`) },
            { key: "internship" as const, label: t(`${baseKey}.tabs.internship`) },
            { key: "entrepreneurship" as const, label: t(`${baseKey}.tabs.entrepreneurship`) },
        ],
        [t]
    );

    const allLogos = useMemo(() => [...program1Logos, ...program2Logos, ...program3Logos], []);

    return (
        <section dir={isAr ? "rtl" : "ltr"} className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-0">
            <div className="mb-8 space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-core-textDark dark:text-core-textLight md:text-4xl">
                    {t(`${baseKey}.title`)}
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark md:text-base">
                    {t(`${baseKey}.subtitle`)}
                </p>
            </div>

            <div className="mb-6 flex justify-start sm:justify-center">
                <div className="flex max-w-full gap-2 overflow-x-auto rounded-full border border-black/10 bg-white/70 p-1 dark:border-white/10 dark:bg-white/5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            ref={(el) => {
                                tabRefs.current[tab.key] = el;
                            }}
                            type="button"
                            onClick={() => setActive(tab.key)}
                            className={[
                                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                                active === tab.key
                                    ? "bg-core-brand text-white dark:bg-core-textAccent dark:text-black"
                                    : "text-core-textDark hover:bg-black/5 dark:text-core-textLight dark:hover:bg-white/10",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {active === "vocational" && (
                    <Vocational t={t} getArray={getArray} baseKey={baseKey} />
                )}

                {active === "entrepreneurship" && (
                    <Entrepreneurship t={t} getArray={getArray} baseKey={baseKey} logos={allLogos} />
                )}

                {active === "advanced" && (
                    <ComingSoon
                        title={t(`${baseKey}.comingSoon.title`)}
                        body={t(`${baseKey}.comingSoon.desc`)}
                    />
                )}

                {active === "internship" && (
                    <ComingSoon
                        title={t(`${baseKey}.comingSoon.title`)}
                        body={t(`${baseKey}.comingSoon.desc`)}
                    />
                )}
            </div>
        </section>
    );
}

function Vocational({
                        t,
                        getArray,
                        baseKey,
                    }: {
    t: (key: string, options?: any) => string;
    getArray: <T,>(key: string) => T[];
    baseKey: string;
}) {
    const sectors = getArray<string>(`${baseKey}.vocational.sectors`);
    const stats = getArray<Stat>(`${baseKey}.vocational.stats`);
    const testimonials = getArray<Quote>(`${baseKey}.vocational.testimonials`);

    return (
        <div className="space-y-4">
            <SectionCard>
                <h2 className="text-xl font-semibold text-core-textDark dark:text-core-textLight">
                    {t(`${baseKey}.vocational.title`)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark">
                    <span className="font-semibold text-core-textDark dark:text-core-textLight">{t(`${baseKey}.vocational.aboutTitle`)}: </span>
                    {t(`${baseKey}.vocational.about`)}
                </p>
            </SectionCard>

            <SectionCard title={t(`${baseKey}.vocational.sectorsTitle`)}>
                <SimpleGrid
                    items={sectors}
                    icons={[FaBullhorn, FaShoppingCart, FaPenNib, FaCamera, FaCode, FaCalculator, FaVideo, FaTasks, FaCouch, FaFeatherAlt]}
                />
            </SectionCard>

            <SectionCard title={t(`${baseKey}.vocational.achievementsTitle`)}>
                <StatsGrid stats={stats} />
            </SectionCard>

            {testimonials.length > 0 && (
                <SectionCard title={t(`${baseKey}.vocational.testimonialsTitle`)}>
                    <QuotesGrid quotes={testimonials} />
                </SectionCard>
            )}
        </div>
    );
}

function Entrepreneurship({
                              t,
                              getArray,
                              baseKey,
                              logos,
                          }: {
    t: (key: string, options?: any) => string;
    getArray: <T,>(key: string) => T[];
    baseKey: string;
    logos: string[];
}) {
    const includes = getArray<string>(`${baseKey}.entrepreneurship.includes`);
    const stats = getArray<Stat>(`${baseKey}.entrepreneurship.stats`);
    const sectors = getArray<string>(`${baseKey}.entrepreneurship.sectors`);
    const stages = getArray<Stage>(`${baseKey}.entrepreneurship.stages`);

    return (
        <div className="space-y-4">
            <SectionCard>
                <h2 className="text-xl font-semibold text-core-textDark dark:text-core-textLight">
                    {t(`${baseKey}.entrepreneurship.title`)}
                </h2>
                <p className="mt-3 text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark">
                    <span className="font-semibold text-core-textDark dark:text-core-textLight">{t(`${baseKey}.entrepreneurship.aboutTitle`)}: </span>
                    {t(`${baseKey}.entrepreneurship.about`)}
                </p>
            </SectionCard>

            <SectionCard title={t(`${baseKey}.entrepreneurship.includesTitle`)}>
                <SimpleGrid items={includes} icons={[FaRocket, FaHandshake, FaRocket, FaHandshake]} />
            </SectionCard>

            <SectionCard title={t(`${baseKey}.entrepreneurship.achievementsTitle`)}>
                <StatsGrid stats={stats} />
            </SectionCard>

            <SectionCard title={t(`${baseKey}.entrepreneurship.sectorsTitle`)}>
                <SimpleGrid items={sectors} icons={[FaTruck, FaIndustry, FaShoppingCart, FaBrain, FaLaptopCode, FaHeartbeat]} />
            </SectionCard>

            <SectionCard title={t(`${baseKey}.entrepreneurship.cohortsTitle`)}>
                <LogoGrid logos={logos} />
            </SectionCard>

            <SectionCard title={t(`${baseKey}.entrepreneurship.stagesTitle`)}>
                <StagesTimeline stages={stages} />
            </SectionCard>
        </div>
    );
}