import { useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import goal01Symbol from "../../../assets/sdg/goal-01-symbol.png";
import goal04Symbol from "../../../assets/sdg/goal-04-symbol.png";
import goal05Symbol from "../../../assets/sdg/goal-05-symbol.png";
import goal08Symbol from "../../../assets/sdg/goal-08-symbol.png";
import goal09Symbol from "../../../assets/sdg/goal-09-symbol.png";
import goal10Symbol from "../../../assets/sdg/goal-10-symbol.png";
import goal11Symbol from "../../../assets/sdg/goal-11-symbol.png";
import goal12Symbol from "../../../assets/sdg/goal-12-symbol.png";
import goal17Symbol from "../../../assets/sdg/goal-17-symbol.png";

type LocalizedText = { en: string; ar: string };

type SdgGoal = {
    number: number;
    color: string;
    symbol: string;
    title: LocalizedText;
    description: LocalizedText;
};

const GOALS: SdgGoal[] = [
    {
        number: 1,
        color: "#e5243b",
        symbol: goal01Symbol,
        title: { en: "No Poverty", ar: "القضاء على الفقر" },
        description: {
            en: "We expand access to practical learning and career opportunities that help young people build sustainable livelihoods.",
            ar: "نوسّع الوصول إلى التعلّم العملي والفرص المهنية التي تساعد الشباب على بناء سبل عيش مستدامة.",
        },
    },
    {
        number: 4,
        color: "#c5192d",
        symbol: goal04Symbol,
        title: { en: "Quality Education", ar: "التعليم الجيد" },
        description: {
            en: "Our training programs connect knowledge with real projects, workplace skills, mentorship, and lifelong learning.",
            ar: "تربط برامجنا التدريبية المعرفة بالمشاريع الحقيقية ومهارات العمل والإرشاد والتعلّم المستمر.",
        },
    },
    {
        number: 5,
        color: "#ff3a21",
        symbol: goal05Symbol,
        title: { en: "Gender Equality", ar: "المساواة بين الجنسين" },
        description: {
            en: "We promote inclusive participation and equal access to learning, leadership, and professional development.",
            ar: "نعزّز المشاركة الشاملة وتكافؤ الوصول إلى التعلّم والقيادة والتطوير المهني.",
        },
    },
    {
        number: 8,
        color: "#a21942",
        symbol: goal08Symbol,
        title: { en: "Decent Work and Economic Growth", ar: "العمل اللائق ونمو الاقتصاد" },
        description: {
            en: "Career preparation, workplace immersion, and entrepreneurship support help young people enter the labor market with confidence.",
            ar: "يساعد الإعداد المهني والمعايشة العملية ودعم ريادة الأعمال الشباب على دخول سوق العمل بثقة.",
        },
    },
    {
        number: 9,
        color: "#fd6925",
        symbol: goal09Symbol,
        title: { en: "Industry, Innovation and Infrastructure", ar: "الصناعة والابتكار والهياكل الأساسية" },
        description: {
            en: "We encourage technology, creative problem-solving, and entrepreneurial experimentation that turn ideas into useful solutions.",
            ar: "نشجّع التكنولوجيا وحل المشكلات بشكل إبداعي والتجارب الريادية التي تحوّل الأفكار إلى حلول مفيدة.",
        },
    },
    {
        number: 10,
        color: "#dd1367",
        symbol: goal10Symbol,
        title: { en: "Reduced Inequalities", ar: "الحد من أوجه عدم المساواة" },
        description: {
            en: "Accessible programs and community partnerships help more young people benefit regardless of background or circumstance.",
            ar: "تساعد البرامج المتاحة والشراكات المجتمعية مزيداً من الشباب على الاستفادة بغض النظر عن خلفياتهم أو ظروفهم.",
        },
    },
    {
        number: 11,
        color: "#fd9d24",
        symbol: goal11Symbol,
        title: { en: "Sustainable Cities and Communities", ar: "مدن ومجتمعات محلية مستدامة" },
        description: {
            en: "Our spaces and community programs bring people together to learn, collaborate, and contribute to resilient local communities.",
            ar: "تجمع مساحاتنا وبرامجنا المجتمعية الناس للتعلّم والتعاون والمساهمة في بناء مجتمعات محلية أكثر مرونة.",
        },
    },
    {
        number: 12,
        color: "#bf8b2e",
        symbol: goal12Symbol,
        title: { en: "Responsible Consumption and Production", ar: "الاستهلاك والإنتاج المسؤولان" },
        description: {
            en: "We integrate responsible choices, resource awareness, and sustainable thinking into projects and organizational practice.",
            ar: "ندمج الاختيارات المسؤولة والوعي بالموارد والتفكير المستدام في المشاريع والممارسات المؤسسية.",
        },
    },
    {
        number: 17,
        color: "#19486a",
        symbol: goal17Symbol,
        title: { en: "Partnerships for the Goals", ar: "عقد الشراكات لتحقيق الأهداف" },
        description: {
            en: "We work with institutions, experts, businesses, and community partners to create broader and more lasting impact.",
            ar: "نعمل مع المؤسسات والخبراء والشركات والشركاء المجتمعيين لصناعة أثر أوسع وأكثر استدامة.",
        },
    },
];

const wrapIndex = (index: number) => (index + GOALS.length) % GOALS.length;

const relativeIndex = (index: number, selectedIndex: number) => {
    const difference = index - selectedIndex;
    if (difference > GOALS.length / 2) return difference - GOALS.length;
    if (difference < -GOALS.length / 2) return difference + GOALS.length;
    return difference;
};

function GoalSymbol({ goal, className = "h-10 w-10" }: { goal: SdgGoal; className?: string }) {
    return (
        <span className={`block shrink-0 ${className}`} aria-hidden="true">
            <img src={goal.symbol} alt="" className="h-full w-full object-contain" />
        </span>
    );
}

export default function SdgSection() {
    const { i18n } = useTranslation();
    const isAr = i18n.language.startsWith("ar");
    const lang = isAr ? "ar" : "en";
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const wheelRef = useRef<HTMLDivElement | null>(null);
    const wheelDeltaRef = useRef(0);
    const wheelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dragRef = useRef({
        active: false,
        moved: false,
        pointerId: -1,
        startY: 0,
        offset: 0,
    });

    const activeGoal = GOALS[selectedIndex];

    const selectGoal = (index: number) => {
        const nextIndex = wrapIndex(index);
        setSelectedIndex(nextIndex);
        setDragOffset(0);
    };

    const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragRef.current = {
            active: true,
            moved: false,
            pointerId: event.pointerId,
            startY: event.clientY,
            offset: 0,
        };
    };

    const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag.active) return;

        const delta = event.clientY - drag.startY;
        if (Math.abs(delta) > 3 && !drag.moved) {
            drag.moved = true;
            wheelRef.current?.setPointerCapture(event.pointerId);
        }
        drag.offset = Math.max(-54, Math.min(54, delta));
        setDragOffset(drag.offset);
    };

    const finishDrag = () => {
        const drag = dragRef.current;
        if (!drag.active) return;
        drag.active = false;

        if (wheelRef.current?.hasPointerCapture(drag.pointerId)) {
            wheelRef.current.releasePointerCapture(drag.pointerId);
        }

        const steps = Math.round(-drag.offset / 44);
        if (steps !== 0) selectGoal(selectedIndex + steps);
        else setDragOffset(0);
    };

    const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
        event.preventDefault();
        wheelDeltaRef.current += event.deltaY;

        if (wheelTimerRef.current) clearTimeout(wheelTimerRef.current);
        wheelTimerRef.current = setTimeout(() => {
            const direction = Math.sign(wheelDeltaRef.current);
            if (direction !== 0) {
                setSelectedIndex((current) => wrapIndex(current + direction));
            }
            wheelDeltaRef.current = 0;
        }, 70);
    };

    return (
        <section className="py-10 md:py-14" dir={isAr ? "rtl" : "ltr"}>
            <div className="layout-shell mx-auto">
                <div className="px-1 md:px-2">
                    <div className="max-w-3xl">
                        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-core-textAccent">
                            {isAr ? "أثرنا" : "Our Impact"}
                        </span>
                        <h2 className="mt-3 text-2xl font-semibold text-white md:text-3xl">
                            {isAr ? "أهداف التنمية المستدامة" : "Sustainable Development Goals"}
                        </h2>
                        <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
                            {isAr
                                ? "حرّك العجلة لاستكشاف الأهداف التي تدعمها برامج Core Istanbul."
                                : "Scroll or use the arrows to explore the goals supported by Core Istanbul programs."}
                        </p>
                    </div>

                    <div className="mt-5 overflow-hidden">
                        <div className="grid xl:min-h-[640px] xl:grid-cols-[minmax(600px,1.08fr),minmax(420px,0.92fr)]">
                            <div className="relative min-h-[640px] overflow-hidden">
                                <div
                                    ref={wheelRef}
                                    role="listbox"
                                    aria-label={isAr ? "عجلة أهداف التنمية المستدامة" : "Sustainable Development Goals wheel"}
                                    tabIndex={0}
                                    onPointerDown={startDrag}
                                    onPointerMove={moveDrag}
                                    onPointerUp={finishDrag}
                                    onPointerCancel={finishDrag}
                                    onWheel={handleWheel}
                                    onKeyDown={(event) => {
                                        if (event.key === "ArrowLeft" || event.key === "ArrowUp") selectGoal(selectedIndex - 1);
                                        if (event.key === "ArrowRight" || event.key === "ArrowDown") selectGoal(selectedIndex + 1);
                                    }}
                                    className="absolute inset-0 cursor-grab touch-none select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-core-accent"
                                >
                                    <div className="absolute inset-x-0 top-[47%] h-[500px] -translate-y-1/2 xl:right-[9%] xl:top-[44%]">
                                        {GOALS.map((goal, index) => {
                                            const relative = relativeIndex(index, selectedIndex);
                                            const distance = Math.abs(relative);
                                            const isActive = distance === 0;
                                            if (distance > 2) return null;

                                            // Keep a consistent 10px edge gap even though each depth uses a different height.
                                            const verticalOffset =
                                                relative === 0 ? 0 : Math.sign(relative) * (distance === 1 ? 127 : 207);
                                            const width = isActive ? 94 : distance === 1 ? 88 : 78;
                                            const height = isActive ? 158 : distance === 1 ? 76 : 64;

                                            return (
                                                <button
                                                    key={goal.number}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isActive}
                                                    onClick={() => {
                                                        if (!dragRef.current.moved) selectGoal(index);
                                                        dragRef.current.moved = false;
                                                    }}
                                                    className={[
                                                        "absolute top-1/2 flex items-center overflow-hidden rounded-[18px] px-5 text-start text-white",
                                                        "transition-[transform,width,height,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
                                                        "focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-7",
                                                        isActive
                                                            ? "start-[3%] xl:start-[6%]"
                                                            : distance === 1
                                                              ? "start-[6%] xl:start-[3%]"
                                                              : "start-[11%] xl:start-0",
                                                    ].join(" ")}
                                                    style={{
                                                        width: `${width}%`,
                                                        height,
                                                        opacity: isActive ? 1 : distance === 1 ? 0.82 : 0.58,
                                                        zIndex: isActive ? 10 : 5 - distance,
                                                        backgroundColor: goal.color,
                                                        borderRadius: 18,
                                                        transform: `translate3d(0, calc(-50% + ${verticalOffset + dragOffset}px), 0)`,
                                                    }}
                                                >
                                                    <span
                                                        className={
                                                            isActive
                                                                ? "w-16 shrink-0 text-5xl font-black leading-none sm:w-24 sm:text-6xl"
                                                                : "w-14 shrink-0 text-2xl font-black leading-none sm:w-16 sm:text-3xl"
                                                        }
                                                    >
                                                        {String(goal.number).padStart(2, "0")}
                                                    </span>
                                                    <span
                                                        className={
                                                            isActive
                                                                ? "min-w-0 flex-1 text-xl font-bold leading-tight sm:text-3xl"
                                                                : "min-w-0 flex-1 text-sm font-semibold leading-tight sm:text-base"
                                                        }
                                                    >
                                                        {goal.title[lang]}
                                                    </span>
                                                    <GoalSymbol
                                                        goal={goal}
                                                        className={
                                                            isActive
                                                                ? "ms-2 h-20 w-24 sm:ms-4 sm:h-[118px] sm:w-[150px]"
                                                                : distance === 1
                                                                  ? "ms-3 h-12 w-16"
                                                                  : "ms-3 h-10 w-14"
                                                        }
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="absolute inset-x-0 bottom-2 flex items-center justify-center gap-3" dir="ltr">
                                    <button
                                        type="button"
                                        onClick={() => selectGoal(selectedIndex - 1)}
                                        aria-label={isAr ? "الهدف السابق" : "Previous goal"}
                                        className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-white/10"
                                    >
                                        <FaChevronLeft />
                                    </button>
                                    <span className="text-xs text-white/55">
                                        {isAr ? "اسحب أو استخدم الأسهم" : "Drag or use the arrows"}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => selectGoal(selectedIndex + 1)}
                                        aria-label={isAr ? "الهدف التالي" : "Next goal"}
                                        className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-black/30 text-white transition hover:bg-white/10"
                                    >
                                        <FaChevronRight />
                                    </button>
                                </div>
                            </div>

                            <article className="relative flex min-h-[420px] overflow-hidden px-7 py-10 text-white md:px-10 xl:min-h-[640px]">
                                <div className="relative flex w-full flex-col justify-center">
                                    <div className="flex items-center gap-4">
                                        <div className="text-7xl font-black leading-none text-white/10 md:text-8xl">
                                            {String(activeGoal.number).padStart(2, "0")}
                                        </div>
                                        <div className="flex items-center gap-3" style={{ color: activeGoal.color }}>
                                            <GoalSymbol goal={activeGoal} className="h-14 w-16" />
                                            <h3 className="text-2xl font-bold leading-tight text-white md:text-3xl">
                                                {activeGoal.title[lang]}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="mt-5 flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: activeGoal.color }}
                                        />
                                        <span
                                            className="h-px w-20 border-t border-dashed"
                                            style={{ borderColor: activeGoal.color }}
                                        />
                                    </div>
                                    <p className="mt-5 max-w-xl text-base leading-8 text-white/80 md:text-lg md:leading-9">
                                        {activeGoal.description[lang]}
                                    </p>
                                    <div className="mt-10 flex max-w-xl items-center justify-center gap-2">
                                        {GOALS.map((goal, index) => (
                                            <button
                                                key={goal.number}
                                                type="button"
                                                onClick={() => selectGoal(index)}
                                                aria-label={goal.title[lang]}
                                                className={[
                                                    "h-2.5 rounded-full transition-all",
                                                    index === selectedIndex ? "w-7" : "w-2.5 bg-white/25 hover:bg-white/50",
                                                ].join(" ")}
                                                style={index === selectedIndex ? { backgroundColor: activeGoal.color } : undefined}
                                            />
                                        ))}
                                        <span className="ms-3 text-xs font-semibold text-white/45">
                                            {selectedIndex + 1} / {GOALS.length}
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
