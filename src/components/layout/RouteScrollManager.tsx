import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        window.requestAnimationFrame(() => {
            const queried = hash ? document.querySelector(hash) : null;
            const target = queried instanceof HTMLElement ? queried : null;

            if (target) {
                target.scrollIntoView({ block: "start" });
                return;
            }

            window.scrollTo({ top: 0, left: 0 });
        });
    }, [pathname, hash]);

    return null;
}
