// src/pages/StylizedGlobe.tsx
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import * as topojson from "topojson-client";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

import BackgroundOrbits from "../compnents/layout/BackgroundOrbits";
import coreLogo from "../assets/logo/fullWhiteLogo.svg";

const WORLD_TOPO = "/data/countries-110m.json";
const BRANCH_COUNTRIES = new Set(["Turkey", "Syria", "Iraq"]);

type Branch = {
    id: string;
    label: string;
    countryName: string;
    lat: number;
    lng: number;
    route: string;
};

const BRANCHES: Branch[] = [
    { id: "istanbul", label: "Core Istanbul", countryName: "Turkey", lat: 41.0082, lng: 28.9784, route: "/home" },
    { id: "aleppo", label: "Core Aleppo ", countryName: "Syria", lat: 36.2021, lng: 38.0, route: "/branch/aleppo" },
    { id: "damscus", label: "Core Damascus", countryName: "Syria", lat: 33.5138, lng: 36.2765, route: "/branch/damscus" },
    { id: "diyala", label: "Core Diyala", countryName: "Iraq", lat: 33.7733, lng: 45.149, route: "/branch/diyala" }
];

function parseRgb(rgb: string) {
    // "rgb(106, 27, 154)" => [106,27,154]
    const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!m) return null;
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]) };
}
function rgbaFromCssColor(cssColor: string, a: number) {
    const parsed = parseRgb(cssColor);
    if (!parsed) return cssColor;
    return `rgba(${parsed.r},${parsed.g},${parsed.b},${a})`;
}
function mixRgb(cssA: string, cssB: string, t: number) {
    const a = parseRgb(cssA);
    const b = parseRgb(cssB);
    if (!a || !b) return cssA;
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bb = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${bb})`;
}
function hashString(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
    return Math.abs(h);
}

export default function StylizedGlobe() {
    const navigate = useNavigate();

    const [polys, setPolys] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredBranchCountry, setHoveredBranchCountry] = useState<string | null>(null);
    const [isCompact, setIsCompact] = useState(() =>
        typeof window !== "undefined" ? window.innerWidth < 1050 : false
    );

    // ✅ Coming soon modal state
    const [comingSoon, setComingSoon] = useState<Branch | null>(null);
    const closeComingSoon = useCallback(() => setComingSoon(null), []);

    useEffect(() => {
        if (!comingSoon) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeComingSoon();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [comingSoon, closeComingSoon]);

    const globeRef = useRef<any>(null);
    const ribbonsRef = useRef<Array<{ mesh: THREE.Mesh; spin: number }>>([]);
    const haloRef = useRef<THREE.Mesh | null>(null);
    const starsRef = useRef<THREE.Points | null>(null);
    const rafRef = useRef<number | null>(null);

    // ✅ Tailwind color probes (reads core.brand & core.accent from CSS)
    const brandProbeRef = useRef<HTMLSpanElement | null>(null);
    const accentProbeRef = useRef<HTMLSpanElement | null>(null);

    const [brandCss, setBrandCss] = useState({
        purple: "rgb(106, 27, 154)", // fallback matches your tailwind config core.brand
        orange: "rgb(243, 123, 39)" // fallback matches your tailwind config core.accent
    });

    useLayoutEffect(() => {
        const purple = brandProbeRef.current ? getComputedStyle(brandProbeRef.current).color : null;
        const orange = accentProbeRef.current ? getComputedStyle(accentProbeRef.current).color : null;

        setBrandCss((prev) => ({
            purple: purple || prev.purple,
            orange: orange || prev.orange
        }));
    }, []);

    const getName = useCallback((d: any) => {
        return d?.properties?.name ?? d?.properties?.NAME_LONG ?? d?.properties?.NAME ?? "";
    }, []);

    // load polygons
    useEffect(() => {
        let mounted = true;

        fetch(WORLD_TOPO)
            .then((r) => r.json())
            .then((topology) => {
                if (!mounted) return;
                const gj = topojson.feature(topology, (topology as any).objects.countries) as any;
                setPolys(gj.features || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));

        return () => {
            mounted = false;
        };
    }, []);

    // responsive
    useEffect(() => {
        const onResize = () => setIsCompact(window.innerWidth < 1050);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // camera + controls
    useEffect(() => {
        const g = globeRef.current;
        if (!g) return;

        g.pointOfView({ lat: 10, lng: 10, altitude: 3.5 }, 0);

        const target = { lat: 36, lng: 37.5, altitude: isCompact ? 0.75 : 0.55 };
        const t = setTimeout(() => g.pointOfView(target, 3500), 200);

        const controls = g.controls?.();
        if (controls) {
            controls.enablePan = false;
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.autoRotate = false;
            controls.autoRotateSpeed = 0.35;
        }

        return () => clearTimeout(t);
    }, [isCompact]);

    // background gradient based on core.brand
    const bgGradient = useMemo(() => {
        const top = mixRgb(brandCss.purple, "rgb(0,0,0)", 0.35);
        const mid = mixRgb(brandCss.purple, "rgb(0,0,0)", 0.75);
        const bot = mixRgb(brandCss.purple, "rgb(0,0,0)", 0.92);
        return `radial-gradient(circle at 50% 20%, ${top} 0%, ${mid} 45%, ${bot} 100%)`;
    }, [brandCss.purple]);

    // ✅ sea = brand purple
    const globeMaterial = useMemo(() => {
        const sea = new THREE.Color(brandCss.purple).lerp(new THREE.Color("black"), 0.85);
        const glow = new THREE.Color(brandCss.purple).lerp(new THREE.Color("black"), 0.65);

        return new THREE.MeshPhongMaterial({
            color: sea,
            emissive: glow,
            shininess: 18
        });
    }, [brandCss.purple]);

    // softer oranges for non-branch
    const orangePalette = useMemo(() => {
        return [0.75, 0.65, 0.55, 0.45, 0.35].map((t) => mixRgb(brandCss.orange, "rgb(255,255,255)", t));
    }, [brandCss.orange]);

    const nonBranchColorFor = useCallback(
        (name: string) => {
            const idx = hashString(name || "x") % orangePalette.length;
            return orangePalette[idx];
        },
        [orangePalette]
    );

    const polygonCapColor = useCallback(
        (d: any) => {
            const name = getName(d);
            if (BRANCH_COUNTRIES.has(name)) {
                const alpha = hoveredBranchCountry === name ? 1 : 0.95;
                return rgbaFromCssColor(brandCss.orange, alpha);
            }
            return nonBranchColorFor(name);
        },
        [brandCss.orange, getName, hoveredBranchCountry, nonBranchColorFor]
    );

    const polygonStrokeColor = useCallback(
        (d: any) => {
            const name = getName(d);
            if (BRANCH_COUNTRIES.has(name)) return "rgba(255,241,224,0.98)";
            return rgbaFromCssColor(brandCss.orange, 0.45);
        },
        [brandCss.orange, getName]
    );

    // labels (TS-safe)
    const htmlElement = useCallback(
        (obj: any) => {
            const d = obj as Branch;

            const wrap = document.createElement("div");
            wrap.style.pointerEvents = "none";
            wrap.style.transform = "translate(-50%, -70%)";

            const button = document.createElement("button");
            button.type = "button";
            button.textContent = d.label;
            button.setAttribute("aria-label", d.label);

            button.className =
                "pointer-events-auto select-none whitespace-nowrap rounded-full " +
                "px-3 py-2 text-[13px] font-extrabold tracking-wide " +
                "text-white bg-black/60 backdrop-blur-md border border-white/15 " +
                "transition-transform duration-150 ease-out cursor-pointer";

            button.style.boxShadow = `0 0 18px ${rgbaFromCssColor(brandCss.orange, 0.55)}`;

            button.onmouseenter = () => {
                setHoveredBranchCountry(d.countryName);
                button.style.transform = "translateY(-2px) scale(1.03)";
                button.style.background = "rgba(20, 10, 40, 0.78)";
                button.style.boxShadow = `0 0 28px ${rgbaFromCssColor(brandCss.purple, 0.65)}`;
                document.body.style.cursor = "pointer";
            };

            button.onmouseleave = () => {
                setHoveredBranchCountry(null);
                button.style.transform = "translateY(0px) scale(1)";
                button.style.background = "rgba(0,0,0,0.60)";
                button.style.boxShadow = `0 0 18px ${rgbaFromCssColor(brandCss.orange, 0.55)}`;
                document.body.style.cursor = "grab";
            };

            button.onclick = (ev: MouseEvent) => {
                ev.preventDefault();
                ev.stopPropagation();

                if (d.id === "istanbul") {
                    navigate(d.route);
                    return;
                }

                setComingSoon(d);
            };

            wrap.appendChild(button);
            return wrap;
        },
        [brandCss.orange, brandCss.purple, navigate]
    );

    // ribbons/halo/stars (brand-based)
    useEffect(() => {
        const g = globeRef.current;
        if (!g) return;

        const scene: THREE.Scene = g.scene();
        const R = g.getGlobeRadius ? g.getGlobeRadius() : 100;

        const addRibbon = () => {
            const major = R * 1.18;
            const tube = R * 0.01;
            const tilt = 0.3;
            const phase = 0;

            const pts: THREE.Vector3[] = [];
            const SEG = 360;
            for (let i = 0; i <= SEG; i++) {
                const t = (i / SEG) * Math.PI * 2;
                const v = new THREE.Vector3(major * Math.cos(t), major * Math.sin(t), 0);
                v.applyEuler(new THREE.Euler(tilt, phase, 0));
                pts.push(v);
            }

            const curve = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0);
            const geo = new THREE.TubeGeometry(curve, 800, tube, 24, true);

            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(brandCss.purple),
                transparent: true,
                opacity: 0.42,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(geo, mat);
            scene.add(mesh);
            ribbonsRef.current.push({ mesh, spin: 0.0015 });
        };

        addRibbon();

        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(R * 1.03, 64, 64),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(brandCss.orange),
                transparent: true,
                opacity: 0.14,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            })
        );
        scene.add(halo);
        haloRef.current = halo;

        const starGeo = new THREE.BufferGeometry();
        const COUNT = 900;
        const positions = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            const r = R * (1.8 + Math.random() * 1.1);
            positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const stars = new THREE.Points(
            starGeo,
            new THREE.PointsMaterial({ size: R * 0.006, color: 0xffffff, transparent: true, opacity: 0.55 })
        );
        scene.add(stars);
        starsRef.current = stars;

        const tick = () => {
            ribbonsRef.current.forEach(({ mesh, spin }) => (mesh.rotation.y += spin));
            if (starsRef.current) starsRef.current.rotation.y += 0.00015;
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            ribbonsRef.current.forEach(({ mesh }) => scene.remove(mesh));
            ribbonsRef.current = [];
            if (haloRef.current) scene.remove(haloRef.current);
            haloRef.current = null;
            if (starsRef.current) scene.remove(starsRef.current);
            starsRef.current = null;
            document.body.style.cursor = "default";
        };
    }, [brandCss.orange, brandCss.purple, polys.length]);

    return (
        <div className="relative w-full h-[100dvh] overflow-hidden" style={{ background: bgGradient }}>
            {/* Tailwind probes (hidden) */}
            <span ref={brandProbeRef} className="hidden text-core-brand" />
            <span ref={accentProbeRef} className="hidden text-core-accent" />

            {/* ✅ use your existing background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <BackgroundOrbits />
            </div>

            {/* logo + hint */}
            <div className="absolute top-4 left-5 z-20 flex items-center gap-3">
                <img src={coreLogo} alt="Core" className="h-9 w-auto" />
                <span className="rounded-full px-3 py-2 text-[12px] font-semibold text-white border border-white/15 bg-black/50 backdrop-blur-md">
                    Istanbul opens now • others coming soon
                </span>
            </div>

            {/* ✅ Coming soon modal */}
            {comingSoon && (
                <div
                    className="absolute inset-0 z-[40] grid place-items-center bg-black/60 backdrop-blur-sm"
                    onClick={closeComingSoon}
                >
                    <div
                        className="w-[min(92vw,420px)] rounded-2xl border border-white/15 bg-black/70 p-5 text-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                        style={{ boxShadow: `0 0 40px ${rgbaFromCssColor(brandCss.purple, 0.45)}` }}
                    >
                        <div className="text-[12px] font-semibold tracking-wide text-white/65">Branch</div>
                        <div className="mt-1 text-[22px] font-extrabold leading-tight">{comingSoon.label}</div>
                        <div className="mt-2 text-sm text-white/80">Coming soon.</div>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                onClick={closeComingSoon}
                                className="rounded-xl px-4 py-2 text-sm font-semibold border border-white/15 bg-white/10 hover:bg-white/15 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* loading */}
            {loading && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-black/60 backdrop-blur-sm">
                    <div className="text-center">
                        <div className="mx-auto mb-3 h-10 w-10 rounded-full border-4 border-white/10 border-t-4 animate-spin" />
                        <div className="text-white text-[13px] font-semibold">Initialising globe…</div>
                    </div>
                </div>
            )}

            <div className="absolute inset-0 z-[1]">
                <Globe
                    ref={globeRef}
                    backgroundColor="rgba(0,0,0,0)"
                    showAtmosphere={false}
                    showGraticules={false}
                    globeMaterial={globeMaterial}
                    polygonsData={polys}
                    polygonCapColor={polygonCapColor}
                    polygonSideColor={() => "rgba(0,0,0,0)"}
                    polygonStrokeColor={polygonStrokeColor}
                    polygonAltitude={() => 0.02}
                    polygonsTransitionDuration={500}
                    onPolygonHover={(d: any) => {
                        const name = d ? getName(d) : null;
                        setHoveredBranchCountry(name && BRANCH_COUNTRIES.has(name) ? name : null);
                    }}
                    pointsData={[]}
                    htmlElementsData={BRANCHES}
                    htmlLat={(obj: any) => (obj as Branch).lat}
                    htmlLng={(obj: any) => (obj as Branch).lng}
                    htmlElement={htmlElement}
                />
            </div>
        </div>
    );
}
