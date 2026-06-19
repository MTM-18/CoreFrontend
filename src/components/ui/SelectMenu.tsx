import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";

export type SelectOption = {
    value: string;
    label: string;
};

export default function SelectMenu({
    value,
    options,
    onChange,
    placeholder,
    className = "",
    dark = false,
    light = false,
}: {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    placeholder: string;
    className?: string;
    dark?: boolean;
    light?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);
    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        const close = (event: MouseEvent) => {
            if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div ref={rootRef} className={`relative ${className}`}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={`flex min-h-12 w-full items-center justify-between gap-4 rounded-full border px-5 text-sm transition ${
                    light
                        ? "border-black/10 bg-white text-core-textDark shadow-inner shadow-black/[0.03] hover:border-core-accent/45 focus:border-core-accent focus:ring-4 focus:ring-core-accent/15"
                        : dark
                        ? "border-white/12 bg-white/[0.055] text-white hover:border-core-accent/60"
                        : "border-white/15 bg-white/[0.06] text-white shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl hover:border-core-accent/55"
                }`}
            >
                <span className="truncate">{selected?.label || placeholder}</span>
                <FaChevronDown className={`shrink-0 text-xs text-core-accent transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            {open && (
                <div
                    role="listbox"
                    className={`absolute inset-x-0 top-[calc(100%+.55rem)] z-40 max-h-72 overflow-auto rounded-2xl border p-1.5 shadow-[0_24px_60px_rgba(0,0,0,.28)] backdrop-blur-2xl ${
                        light
                            ? "border-black/10 bg-white text-core-textDark"
                            : "border-white/12 bg-[#1a0b20]/95 text-white"
                    }`}
                >
                    {options.map((option) => (
                        <button
                            type="button"
                            role="option"
                            aria-selected={option.value === value}
                            key={option.value}
                            onClick={() => {
                                onChange(option.value);
                                setOpen(false);
                            }}
                            className={`w-full rounded-xl px-4 py-2.5 text-start text-sm transition ${
                                option.value === value
                                    ? "bg-gradient-to-r from-core-brand to-core-accent text-white"
                                    : light
                                    ? "text-core-textDark/78 hover:bg-core-accent/10 hover:text-core-textDark"
                                    : "text-white/75 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
