import type { CmsCollection, CmsItem } from "./types";
import { certificateProgramLabel, type CertificateProgramOption } from "./certificates";

const API_ROOT = "/api/cms.php";
const DEV_TOKEN = "core-local-development";
const DEV_STORAGE_KEY = "core-cms-local-items-v2";
const LEGACY_DEV_STORAGE_KEY = "core-cms-local-items";
const DEV_ADMIN_USERNAME = import.meta.env.VITE_CMS_ADMIN_USERNAME;
const DEV_ADMIN_PASSWORD = import.meta.env.VITE_CMS_ADMIN_PASSWORD;
const LOCAL_SEED_COLLECTIONS: CmsCollection[] = [
    "news",
    "home_testimonials",
    "program_testimonials",
    "team",
    "podcasts",
    "reports",
    "stories",
    "certificates",
    "workspace_images",
    "gallery",
    "filters",
];

type ApiResponse<T> = {
    ok: boolean;
    message?: string;
    items?: T[];
    item?: T;
    token?: string;
};

export type CertificateVerificationResult = {
    full_name: string;
    certificate_code: string;
    certificate_type: string;
    program: string;
    issued_at: string;
    file_url: string;
};

function normalizeCertificateName(value: string) {
    return value.trim().toLocaleLowerCase().normalize("NFKC").replace(/\s+/g, " ");
}

function parseLocalItems(value: string | null): CmsItem[] {
    try {
        const parsed = JSON.parse(value || "[]");
        return Array.isArray(parsed)
            ? parsed.map((item) => ({
                ...item,
                image_path: typeof item.image_path === "string"
                    ? item.image_path.replace(/(\/uploads\/image\/[^./]+)\.(?:png|jpe?g)$/i, "$1.webp")
                    : "",
                certificate_code: typeof item.certificate_code === "string" ? item.certificate_code : "",
                certificate_type: typeof item.certificate_type === "string" ? item.certificate_type : "",
                first_name: typeof item.first_name === "string" ? item.first_name : "",
                birthdate: typeof item.birthdate === "string" ? item.birthdate : "",
                shorts: Array.isArray(item.shorts) ? item.shorts : [],
            }))
            : [];
    } catch {
        return [];
    }
}

async function readLocalItems(): Promise<CmsItem[]> {
    const saved = localStorage.getItem(DEV_STORAGE_KEY);

    const seedResponses = await Promise.all(
        LOCAL_SEED_COLLECTIONS.map(async (collection) => {
            const response = await fetch(`/storage/${collection}.json`, { cache: "no-store" });
            if (!response.ok) return [];
            const items = await response.json().catch(() => []);
            return Array.isArray(items) ? items : [];
        }),
    );
    const savedItems = parseLocalItems(saved);
    const legacyItems = parseLocalItems(localStorage.getItem(LEGACY_DEV_STORAGE_KEY));
    const merged = [...seedResponses.flat(), ...legacyItems, ...savedItems].reduce<CmsItem[]>((items, candidate) => {
        if (!candidate || typeof candidate !== "object") return items;
        const item = { ...candidate, shorts: Array.isArray(candidate.shorts) ? candidate.shorts : [] } as CmsItem;
        return [item, ...items.filter((entry) => entry.id !== item.id || entry.collection !== item.collection)];
    }, []);
    writeLocalItems(merged);
    return merged;
}

function writeLocalItems(items: CmsItem[]) {
    localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("core-cms-updated"));
}

function fileAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Unable to read the selected file"));
        reader.readAsDataURL(file);
    });
}

async function imageAsWebpDataUrl(file: File) {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to process the selected image");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    return new Promise<string>((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Unable to convert the image to WebP"));
                return;
            }
            fileAsDataUrl(new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" }))
                .then(resolve)
                .catch(reject);
        }, "image/webp", 0.82);
    });
}

async function request<T>(url: string, init?: RequestInit): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
        ...init,
        cache: "no-store",
        headers: {
            Accept: "application/json",
            ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
            ...init?.headers,
        },
    });
    const data = await response.json().catch(() => ({ ok: false, message: "Invalid server response" }));
    if (!response.ok || !data.ok) throw new Error(data.message || "Request failed");
    return data;
}

export async function login(username: string, password: string) {
    if (import.meta.env.DEV) {
        if (username === DEV_ADMIN_USERNAME && password === DEV_ADMIN_PASSWORD) return DEV_TOKEN;
        throw new Error("Incorrect username or password.");
    }
    const data = await request<CmsItem>(API_ROOT, {
        method: "POST",
        body: JSON.stringify({ action: "login", username, password }),
    });
    return data.token || "";
}

export async function listItems(collection: CmsCollection, token?: string) {
    if (import.meta.env.DEV) {
        if (token && token !== DEV_TOKEN) throw new Error("Unauthorized. Please sign in again.");
        return (await readLocalItems())
            .filter((item) => item.collection === collection && (token || (item.published && collection !== "certificates")))
            .sort((a, b) => a.sort_order - b.sort_order || b.published_at.localeCompare(a.published_at));
    }
    const query = new URLSearchParams({ collection });
    if (token) query.set("admin", "1");
    const data = await request<CmsItem>(`${API_ROOT}?${query}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data.items || [];
}

export async function listCertificatePrograms(): Promise<CertificateProgramOption[]> {
    if (import.meta.env.DEV) {
        const programs = new Map<string, string>();
        (await readLocalItems())
            .filter((item) => item.collection === "certificates" && item.published && item.program)
            .forEach((item) => programs.set(item.program, item.certificate_type || certificateProgramLabel(item.program)));
        return [...programs.entries()]
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }
    const data = await request<CertificateProgramOption>(API_ROOT, {
        method: "POST",
        body: JSON.stringify({ action: "certificate_programs" }),
    });
    return data.items || [];
}

export async function verifyCertificate(input: { program: string; fullName: string; birthdate: string }) {
    if (import.meta.env.DEV) {
        const program = input.program.trim();
        const fullName = normalizeCertificateName(input.fullName);
        const birthdate = input.birthdate.trim();
        const match = (await readLocalItems()).find((item) => (
            item.collection === "certificates"
            && item.published
            && item.program === program
            && normalizeCertificateName(item.title_en || item.title_ar) === fullName
            && item.birthdate === birthdate
        ));
        if (!match) throw new Error("No certificate matched those details.");
        return {
            full_name: match.title_en || match.title_ar,
            certificate_code: match.certificate_code,
            certificate_type: match.certificate_type,
            program: match.program || match.body_en,
            issued_at: match.published_at,
            file_url: match.media_path || match.external_url,
        } satisfies CertificateVerificationResult;
    }
    const data = await request<CertificateVerificationResult>(API_ROOT, {
        method: "POST",
        body: JSON.stringify({
            action: "verify_certificate",
            program: input.program,
            full_name: input.fullName,
            birthdate: input.birthdate,
        }),
    });
    if (!data.item) throw new Error("No certificate matched those details.");
    return data.item as CertificateVerificationResult;
}

export async function saveItem(item: CmsItem, token: string) {
    if (import.meta.env.DEV) {
        if (token !== DEV_TOKEN) throw new Error("Unauthorized. Please sign in again.");
        const now = new Date().toISOString();
        const saved: CmsItem = {
            ...item,
            id: item.id || crypto.randomUUID(),
            created_at: item.created_at || now,
            updated_at: now,
        };
        const items = await readLocalItems();
        writeLocalItems([saved, ...items.filter((entry) => entry.id !== saved.id)]);
        return saved;
    }
    const data = await request<CmsItem>(API_ROOT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "save", item }),
    });
    if (!data.item) throw new Error("The server did not return the saved item");
    return data.item;
}

export async function deleteItem(id: string, collection: CmsCollection, token: string) {
    if (import.meta.env.DEV) {
        if (token !== DEV_TOKEN) throw new Error("Unauthorized. Please sign in again.");
        writeLocalItems((await readLocalItems()).filter((item) => item.id !== id || item.collection !== collection));
        return;
    }
    await request<CmsItem>(API_ROOT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "delete", id, collection }),
    });
}

export async function saveOrder(collection: CmsCollection, ids: string[], token: string) {
    if (import.meta.env.DEV) {
        if (token !== DEV_TOKEN) throw new Error("Unauthorized. Please sign in again.");
        const positions = new Map(ids.map((id, index) => [id, index]));
        writeLocalItems((await readLocalItems()).map((item) => (
            item.collection === collection && positions.has(item.id)
                ? { ...item, sort_order: positions.get(item.id) ?? item.sort_order }
                : item
        )));
        return;
    }
    await request<CmsItem>(API_ROOT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ action: "reorder", collection, ids }),
    });
}

export async function uploadMedia(file: File, kind: "image" | "document" | "video", token: string) {
    if (import.meta.env.DEV) {
        if (token !== DEV_TOKEN) throw new Error("Unauthorized. Please sign in again.");
        return kind === "image" ? imageAsWebpDataUrl(file) : fileAsDataUrl(file);
    }
    const form = new FormData();
    form.append("action", "upload");
    form.append("kind", kind);
    form.append("file", file);
    const data = await request<CmsItem & { path?: string }>(API_ROOT, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
    });
    const path = (data as ApiResponse<CmsItem> & { path?: string }).path;
    if (!path) throw new Error("Upload path is missing");
    return path;
}
