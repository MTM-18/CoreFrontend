type SectionEyebrowProps = {
    children: string;
    className?: string;
};

export default function SectionEyebrow({ children, className = "" }: SectionEyebrowProps) {
    return (
        <p className={`text-xs font-semibold uppercase tracking-[0.28em] text-core-accent ${className}`}>
            {children}
        </p>
    );
}
