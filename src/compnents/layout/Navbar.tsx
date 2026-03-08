import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useCallback } from "react";
import gsap from "gsap";

import ToggleSwitch from "../ui/ToggleSwitch";
import LogoColored from "../../assets/logo/fullColorLogo.svg";
import LogoWhite from "../../assets/logo/logoWhite.png";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const { t, i18n } = useTranslation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    const currentLang = i18n.language.startsWith("ar") ? "ar" : "en";
    const setLang = (lng: "en" | "ar") => {
        if (currentLang !== lng) i18n.changeLanguage(lng);
    };

    const langOptions = [
        { value: "en", label: "EN" },
        { value: "ar", label: "AR" },
    ];

    const themeOptions = [
        { value: "light", label: "☀" },
        { value: "dark", label: "🌙" },
    ];

    const handleThemeChange = (next: string) => {
        if (next !== theme) toggleTheme();
    };

    const navItems = useMemo(
        () => [
            { to: "/home", label: t("nav.home") },
            { to: "/home/about", label: t("nav.about") },
            { to: "/home/product", label: t("nav.product") },
            { to: "/home/workspace", label: t("nav.workspace") },
            { to: "/home/podcast", label: t("nav.podcast") },
            { to: "/home/reports", label: t("nav.reports") },
            { to: "/home/certificates", label: t("nav.certificates") },
            { to: "/home/blog", label: t("nav.blog") },
            { to: "/home/contact", label: t("nav.contact") },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [currentLang]
    );

    // ✅ /home exact only; others prefix
    const isPathActive = useCallback(
        (to: string) => {
            if (to === "/home") return location.pathname === "/home";
            return location.pathname === to || location.pathname.startsWith(to + "/");
        },
        [location.pathname]
    );

    const activeItem = navItems.find((item) => isPathActive(item.to)) || navItems[0];

    /* -------------------- DESKTOP: sliding capsule -------------------- */
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const navListRef = useRef<HTMLDivElement | null>(null);
    const capsuleRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const capsuleInitedRef = useRef(false);

    useEffect(() => {
        const idx = navItems.findIndex((item) => isPathActive(item.to));
        setActiveIndex(idx === -1 ? 0 : idx);
    }, [navItems, isPathActive]);

    const moveCapsule = useCallback(
        (immediate = false) => {
            const container = navListRef.current;
            const capsule = capsuleRef.current;
            const activeEl = itemRefs.current[activeIndex];

            if (!container || !capsule || !activeEl) return;

            const cRect = container.getBoundingClientRect();
            const aRect = activeEl.getBoundingClientRect();

            const x = aRect.left - cRect.left;
            const w = aRect.width;

            // let GSAP own the vertical centering (no Tailwind translate conflicts)
            if (!capsuleInitedRef.current || immediate) {
                gsap.set(capsule, { x, width: w, yPercent: -50 });
                capsuleInitedRef.current = true;
                return;
            }

            gsap.to(capsule, {
                x,
                width: w,
                duration: 0.35,
                ease: "power3.out",
                overwrite: true,
            });
        },
        [activeIndex]
    );

    // ✅ Do NOT reset to left each time. Initialize once, then animate.
    useLayoutEffect(() => {
        const raf = requestAnimationFrame(() => {
            // first time: set immediately; after that: animate
            moveCapsule(!capsuleInitedRef.current);
        });
        return () => cancelAnimationFrame(raf);
    }, [activeIndex, currentLang, moveCapsule]);

    // keep capsule correct on resize (set immediately to avoid weird jumps)
    useEffect(() => {
        const onResize = () => moveCapsule(true);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [moveCapsule]);

    const isDarkTheme = theme === "dark";

    /* -------------------- MOBILE: dropdown animation -------------------- */
    const mobileDropdownRef = useRef<HTMLDivElement | null>(null);
    const [mobileHoverIndex, setMobileHoverIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!mobileMenuOpen || !mobileDropdownRef.current) return;

        const ctx = gsap.context(() => {
            gsap.from(mobileDropdownRef.current, {
                opacity: 0,
                y: -8,
                scale: 0.97,
                duration: 0.15,
                ease: "power2.out",
            });

            gsap.from(".mobile-nav-item", {
                opacity: 0,
                y: 10,
                duration: 0.22,
                ease: "power2.out",
                stagger: 0.05,
                delay: 0.02,
            });
        }, mobileDropdownRef);

        return () => ctx.revert();
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!mobileMenuOpen) return;
        const idx = navItems.findIndex((item) => isPathActive(item.to));
        setMobileHoverIndex(idx === -1 ? 0 : idx);
    }, [mobileMenuOpen, navItems, isPathActive]);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header
            dir={currentLang === "ar" ? "rtl" : "ltr"}

            className="
        fixed top-0 inset-x-0 z-50
        bg-white/0 dark:bg-black/0
        backdrop-blur-md
      "
        >
            {/* ================= DESKTOP (>= 1050px) ================= */}
            <div className="hidden min-[1050px]:block">
                <div className="layout-shell px-10 h-16 flex items-center justify-between gap-4">
                    {/* LEFT: logo */}
                    <div className="flex items-center flex-shrink-0">
                        <img
                            src={LogoColored}
                            alt="Core Istanbul Logo"
                            className="h-10 w-auto dark:brightness-110"
                        />
                    </div>

                    {/* CENTER: navigation capsule */}
                    <nav className="flex items-center justify-center flex-1">
                        <div
                            className="
                relative inline-flex items-center
                rounded-full
                bg-gradient-to-r from-[#6b18d6] via-[#b835c8] to-[#f47a2f]
                px-2 py-1
                shadow-[0_14px_40px_rgba(0,0,0,0.32)]
              "
                        >
                            <div ref={navListRef} className="relative flex items-center gap-6">
                                <div
                                    ref={capsuleRef}
                                    className="
                    absolute top-1/2 left-0 h-8
                    rounded-full bg-white/95
                    shadow-[0_10px_30px_rgba(0,0,0,0.25)]
                    pointer-events-none
                  "
                                    style={{ width: 0 }}
                                />

                                {navItems.map((item, index) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === "/home"}
                                        ref={(el) => {
                                            itemRefs.current[index] = el;
                                        }}
                                        className={({ isActive }) =>
                                            [
                                                "relative z-10 nav-link text-sm transition-colors px-4 py-1.5",
                                                isActive
                                                    ? "font-semibold text-black"
                                                    : isDarkTheme
                                                        ? "text-white/90 hover:text-white"
                                                        : "text-white/95 hover:text-white",
                                            ].join(" ")
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </nav>

                    {/* RIGHT: switches */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <ToggleSwitch
                            options={langOptions}
                            value={currentLang}
                            onChange={(v) => setLang(v as "en" | "ar")}
                        />
                        <ToggleSwitch options={themeOptions} value={theme} onChange={handleThemeChange} />
                    </div>
                </div>
            </div>

            {/* ================= MOBILE (< 1050px) ================= */}
            <div className="min-[1050px]:hidden layout-shell px-4 pt-2 pb-3 flex flex-col gap-2">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center flex-shrink-0">
                        <img
                            src={LogoWhite}
                            alt="Core Istanbul Logo"
                            className="h-8 w-auto dark:brightness-110"
                        />
                    </div>

                    <div className="flex-1 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen((prev) => !prev)}
                            className="
                inline-flex items-center gap-2
                rounded-full
                bg-gradient-to-r from-[#6b18d6] via-[#b835c8] to-[#f47a2f]
                px-4 py-1.5
                text-[11px] font-medium text-white
                shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                whitespace-nowrap
              "
                        >
                            <span>{activeItem.label}</span>
                            <span className="text-[9px]">{mobileMenuOpen ? "▲" : "▼"}</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        <ToggleSwitch
                            options={langOptions}
                            value={currentLang}
                            onChange={(v) => setLang(v as "en" | "ar")}
                        />
                        <ToggleSwitch options={themeOptions} value={theme} onChange={handleThemeChange} />
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div
                        ref={mobileDropdownRef}
                        className="
              mt-2 w-full max-w-xs self-center
              rounded-3xl
              bg-white/95 text-black
              dark:bg-black/70 dark:text-white
              backdrop-blur-xl
              border border-black/10 dark:border-white/15
              px-4 py-3
              shadow-[0_18px_50px_rgba(0,0,0,0.35)]
            "
                    >
                        <nav className="flex flex-col gap-1">
                            {navItems.map((item, index) => {
                                const isHovered = mobileHoverIndex === index;
                                return (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        end={item.to === "/home"}
                                        className={() =>
                                            [
                                                "mobile-nav-item text-center text-sm font-medium py-2 rounded-full transition-colors",
                                                isHovered
                                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                                    : "text-black/80 hover:text-black dark:text-white/85 dark:hover:text-white",
                                            ].join(" ")
                                        }
                                        onPointerEnter={() => setMobileHoverIndex(index)}
                                        onPointerDown={() => setMobileHoverIndex(index)}
                                        onFocus={() => setMobileHoverIndex(index)}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {item.label}
                                    </NavLink>
                                );
                            })}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
