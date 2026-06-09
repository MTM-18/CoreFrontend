import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { ComponentType, ReactNode } from "react";
import {
    FaBrain,
    FaBriefcase,
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
    FaStar,
    FaShoppingCart,
    FaTasks,
    FaTruck,
    FaUsers,
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
        <section className="rounded-3xl border border-black/8 bg-white/80 px-5 py-4 shadow-sm dark:border-white/10 dark:bg-white/5 md:px-6 md:py-5">
            {title ? (
                <h3 className="mb-3 text-lg font-semibold text-core-textDark dark:text-core-textLight">{title}</h3>
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
                        className="flex items-center gap-3 rounded-2xl  p-4 "
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
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
            {stats.map((stat, index) => (
                <div
                    key={`${stat.label}-${index}`}
                    className="rounded-2xl border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                    <div className="text-2xl font-semibold text-core-textDark dark:text-core-textLight">
                        {stat.value}
                    </div>
                    <div className="mt-2 text-sm leading-6 text-core-textDark dark:text-core-textLight">
                        {stat.label}
                    </div>
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

function SectorsGrid({
                         items,
                         icons,
                     }: {
    items: string[];
    icons: Array<ComponentType<{ className?: string }>>;
}) {
    return (
        <div className="flex gap-4 overflow-x-auto px-1 pb-1 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-y-6 md:gap-x-8 md:overflow-visible md:justify-items-center xl:grid-cols-3">
            {items.map((label, index) => {
                const Icon = icons[index] ?? icons[icons.length - 1];

                return (
                    <div
                        key={`${label}-${index}`}
                        className="flex w-[calc(50%-0.5rem)] min-w-[calc(50%-0.5rem)] shrink-0 snap-start flex-col items-center justify-center md:w-auto md:min-w-0"
                    >
                        <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-3xl bg-core-brand/10 text-core-brand dark:bg-core-textAccent/12 dark:text-core-textAccent">
                            <Icon className="h-8 w-8" />
                        </div>

                        <span className="text-center text-sm font-semibold leading-5 text-core-textDark dark:text-core-textLight">
                            {label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

function StagesTimeline({ stages }: { stages: Stage[] }) {
    return (
        <div className="space-y-4">
            {stages.map((stage, index) => (
                <div key={`${stage.title}-${index}`} className="flex gap-4 rounded-2xl  border-black/8 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-core-brand text-sm font-semibold text-white dark:bg-core-textAccent dark:text-black">
                        {index + 1}
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-core-textDark dark:text-core-textLight md:text-base">{stage.title}</h4>
                        <p className="mt-2 text-sm leading-7 text-core-textDark dark:text-core-textLight">{stage.desc}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function QuotesGrid({ quotes }: { quotes: Quote[] }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:overflow-visible">
            {quotes.map((quote, index) => (
                <div
                    key={`${quote.name}-${index}`}
                    className="w-[88%] min-w-[88%] shrink-0 snap-start rounded-2xl border border-black/8 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5 md:w-auto md:min-w-0 md:shrink"
                >
                    <p className="text-sm leading-7 text-core-textDark dark:text-core-textLight">
                        “{quote.text}”
                    </p>
                    <div className="mt-3 text-sm font-semibold text-core-textDark dark:text-core-textLight">
                        {quote.name}
                    </div>
                </div>
            ))}
        </div>
    );
}

function ComingSoon({ title, body }: { title: string; body: string }) {
    return (
        <SectionCard title={title}>
            <p className="text-sm leading-7 text-core-textDark dark:text-core-textLight">{body}</p>
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
                <p className="max-w-3xl text-sm leading-7 text-core-textDark dark:text-core-textLight md:text-base">
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
                    <InternshipProgram isAr={isAr} />
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
    t: TFunction;
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
                <p className="mt-3 text-sm leading-7 text-core-textDark dark:text-core-textLight">
                    <span className="font-semibold text-core-textDark dark:text-core-textLight">{t(`${baseKey}.vocational.aboutTitle`)}: </span>
                    {t(`${baseKey}.vocational.about`)}
                </p>
            </SectionCard>

            <SectionCard title={t(`${baseKey}.vocational.sectorsTitle`)}>
                <SectorsGrid
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
    t: TFunction;
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
                <p className="mt-3 text-sm leading-7 text-core-textDark dark:text-core-textLight">
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
                <SectorsGrid items={sectors} icons={[FaTruck, FaIndustry, FaShoppingCart, FaBrain, FaLaptopCode, FaHeartbeat]} />
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

const INTERNSHIP_CONTENT = {
    en: {
        title: "Training and Workplace Immersion Program",
        intro: "Core Istanbul’s practical training program gives youth, students, and graduates the opportunity to gain real professional experience in a structured work environment. Participants contribute to training programs, project management, marketing, design, monitoring and evaluation, and communication with beneficiaries and partners.",
        goal: "The program develops practical skills and improves readiness for the labor market through an applied experience that combines learning, responsibility, and teamwork.",
        offersTitle: "What does the program offer?",
        offers: [
            "Real work experience inside an entrepreneurial and educational organization.",
            "Practical training across multiple fields based on organizational needs.",
            "Development of communication, organization, time management, and teamwork skills.",
            "Opportunities to contribute to programs and projects serving youth and the community.",
            "Supervision and ongoing support from the Core Istanbul team.",
            "A training certificate after successfully completing the program.",
        ],
        fieldsTitle: "Training fields",
        fields: [
            "Program and project management",
            "Marketing and content creation",
            "Graphic design",
            "Photography and video editing",
            "Monitoring and evaluation",
            "Partnerships and relations",
            "Administrative support and coordination",
        ],
    },
    ar: {
        title: "برنامج المعايشة والتدريب",
        intro: "يقدّم برنامج التدريب العملي في Core Istanbul فرصة للشباب والطلاب والخريجين لاكتساب خبرة مهنية حقيقية داخل بيئة عمل احترافية، من خلال المشاركة في تنفيذ البرامج التدريبية، إدارة المشاريع، التسويق، التصميم، المتابعة والتقييم، والتواصل مع المستفيدين والشركاء.",
        goal: "يهدف البرنامج إلى تطوير مهارات المتدربين العملية، وتعزيز جاهزيتهم لسوق العمل، من خلال تجربة تطبيقية تجمع بين التعلم، المسؤولية، والعمل ضمن فريق.",
        offersTitle: "ماذا يقدّم البرنامج؟",
        offers: [
            "تجربة عمل حقيقية داخل مؤسسة ريادية وتعليمية.",
            "تدريب عملي في مجالات متعددة حسب الاحتياج.",
            "تطوير مهارات التواصل، التنظيم، إدارة الوقت، والعمل الجماعي.",
            "فرصة للمشاركة في برامج ومشاريع تخدم الشباب والمجتمع.",
            "إشراف ومتابعة من فريق Core Istanbul.",
            "شهادة تدريب عند إتمام فترة التدريب بنجاح.",
        ],
        fieldsTitle: "مجالات التدريب",
        fields: [
            "إدارة البرامج والمشاريع",
            "التسويق وصناعة المحتوى",
            "التصميم الجرافيكي",
            "التصوير والمونتاج",
            "المتابعة والتقييم",
            "العلاقات والشراكات",
            "الدعم الإداري والتنسيق",
        ],
    },
};

function InternshipProgram({ isAr }: { isAr: boolean }) {
    const content = isAr ? INTERNSHIP_CONTENT.ar : INTERNSHIP_CONTENT.en;
    const fieldIcons = [FaBriefcase, FaBullhorn, FaPenNib, FaVideo, FaTasks, FaHandshake, FaUsers];

    return (
        <div className="space-y-4">
            <SectionCard>
                <div className="grid gap-6 lg:grid-cols-[1fr,auto] lg:items-start">
                    <div>
                        <h2 className="text-xl font-semibold text-core-textDark dark:text-core-textLight md:text-2xl">
                            {content.title}
                        </h2>
                        <p className="mt-4 text-sm leading-8 text-core-textDark dark:text-core-textLight">
                            {content.intro}
                        </p>
                        <p className="mt-3 text-sm leading-8 text-core-textDark dark:text-core-textLight">
                            {content.goal}
                        </p>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-core-brand to-core-accent text-3xl text-white shadow-lg">
                        <FaBriefcase />
                    </div>
                </div>
            </SectionCard>

            <SectionCard title={content.offersTitle}>
                <div className="grid gap-3 md:grid-cols-2">
                    {content.offers.map((item) => (
                        <div
                            key={item}
                            className="flex items-start gap-3 rounded-2xl border border-black/8 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5"
                        >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-core-accent/15 text-core-accent">
                                <FaStar className="text-xs" />
                            </div>
                            <p className="text-sm leading-7 text-core-textDark dark:text-core-textLight">{item}</p>
                        </div>
                    ))}
                </div>
            </SectionCard>

            <SectionCard title={content.fieldsTitle}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {content.fields.map((field, index) => {
                        const Icon = fieldIcons[index] ?? FaBriefcase;
                        return (
                            <div
                                key={field}
                                className="flex items-center gap-3 rounded-2xl bg-core-brand/5 p-4 dark:bg-white/5"
                            >
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-core-brand text-white dark:bg-core-textAccent dark:text-black">
                                    <Icon />
                                </div>
                                <span className="text-sm font-semibold leading-6 text-core-textDark dark:text-core-textLight">
                                    {field}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </SectionCard>
        </div>
    );
}
