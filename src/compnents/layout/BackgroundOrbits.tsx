// src/components/layout/BackgroundOrbits.tsx
export default function BackgroundOrbits() {
    return (
        <div
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
            aria-hidden="true"
        >
            {/* GIANT BACKGROUND WASH */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="orbit-base h-[1400px] w-[1400px] bg-core-brand/10 dark:bg-core-darkSurface/40" />
            </div>

            {/* OUTER LAYERS */}

            {/* Top-left purple */}
            <div className="orbit-base absolute -top-72 -left-72 h-[620px] w-[620px] bg-core-brand/75" />

            {/* Bottom-right orange */}
            <div className="orbit-base absolute -bottom-80 -right-80 h-[700px] w-[700px] bg-core-accent/75" />

            {/* Top-right soft accent */}
            <div className="orbit-base absolute -top-64 right-0 h-[520px] w-[520px] bg-core-accent/50 dark:bg-core-accentDark/90" />

            {/* Bottom-left soft purple */}
            <div className="orbit-base absolute -bottom-64 left-0 h-[540px] w-[540px] bg-core-brandLight/80 dark:bg-core-darkSurface/90" />

            {/* FILLERS */}

            {/* Top-right filler */}
            <div className="orbit-base absolute -top-40 right-10 h-[480px] w-[480px] bg-core-brandLight/50 dark:bg-core-darkSurface/90" />

            {/* Mid-left filler */}
            <div className="orbit-base absolute top-[45%] -left-20 h-[360px] w-[360px] bg-core-accent/100 dark:bg-core-accentDark/90" />

            {/* CENTER CLUSTER */}

            {/* Wide center atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="orbit-base h-[900px] w-[900px] bg-core-brand/50 dark:bg-core-darkSurface/72" />
            </div>

            {/* Orange halo */}
            <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="orbit-base h-[700px] w-[700px] bg-core-accent/76 dark:bg-core-accentDark/78 mix-blend-screen" />
            </div>

            {/* Inner purple glow */}
            <div className="absolute top-[52%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="orbit-base h-[520px] w-[520px] bg-core-brandLight/72 dark:bg-core-brandLight/50" />
            </div>

            <style>{`
                .orbit-base {
                    border-radius: 9999px;
                    filter: blur(110px);
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }
            `}</style>
        </div>
    );
}