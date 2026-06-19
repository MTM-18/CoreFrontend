import { useEffect, useState } from "react";

import { listItems } from "./api";
import type { CmsCollection, CmsItem } from "./types";

export function useCmsItems(collection: CmsCollection) {
    const [items, setItems] = useState<CmsItem[]>([]);

    useEffect(() => {
        let active = true;
        const load = () => {
            listItems(collection)
                .then((result) => {
                    if (active) setItems(result);
                })
                .catch(() => {
                    if (active) setItems([]);
                });
        };
        const onStorage = (event: StorageEvent) => {
            if (!event.key || event.key === "core-cms-local-items-v2") load();
        };
        const onVisibility = () => {
            if (document.visibilityState === "visible") load();
        };

        load();
        window.addEventListener("core-cms-updated", load);
        window.addEventListener("storage", onStorage);
        window.addEventListener("focus", load);
        document.addEventListener("visibilitychange", onVisibility);
        return () => {
            active = false;
            window.removeEventListener("core-cms-updated", load);
            window.removeEventListener("storage", onStorage);
            window.removeEventListener("focus", load);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, [collection]);

    return items;
}
