import { Fragment, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import readXlsxFile from "read-excel-file/browser";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import {
    FaArrowDown,
    FaArrowRightFromBracket,
    FaArrowUp,
    FaBars,
    FaCloudArrowUp,
    FaEye,
    FaFileExcel,
    FaFloppyDisk,
    FaPen,
    FaPlus,
    FaTrash,
    FaXmark,
} from "react-icons/fa6";

import logo from "../assets/logo/fullWhiteLogo.svg";
import { deleteItem, listItems, login, saveItem, saveOrder, uploadMedia } from "../cms/api";
import { certificateProgramLabel, certificateProgramOptions, defaultCertificatePrograms, normalizeCertificateLookup } from "../cms/certificates";
import { CMS_COLLECTIONS, emptyCmsItem, type CmsCollection, type CmsItem } from "../cms/types";
import SelectMenu from "../components/ui/SelectMenu";
import "./AdminPage.css";

const TOKEN_KEY = "core-cms-token";
const sortItems = (items: CmsItem[]) => [...items].sort(
    (a, b) => a.sort_order - b.sort_order || b.published_at.localeCompare(a.published_at),
);
GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

async function pdfFirstPageCover(file: File) {
    const data = await file.arrayBuffer();
    const pdf = await getDocument({ data }).promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.8 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Unable to prepare the report cover.");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
            if (result) resolve(result);
            else reject(new Error("Unable to create the report cover."));
        }, "image/webp", 0.88);
    });
    return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}-cover.webp`, { type: "image/webp" });
}

function Login({ onSuccess }: { onSuccess: (token: string) => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError("");
            const token = await login(username, password);
            localStorage.setItem(TOKEN_KEY, token);
            onSuccess(token);
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login">
            <form className="admin-login-card" onSubmit={submit}>
                <img src={logo} alt="Core Istanbul" className="admin-login-logo" />
                <p>Content management dashboard</p>
                <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} required /></label>
                <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
                {error && <div className="admin-alert">{error}</div>}
                <button className="admin-primary" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
            </form>
        </main>
    );
}

function Field({ label, arabic, wide, children }: { label: string; arabic?: boolean; wide?: boolean; children: ReactNode }) {
    return <label className={`admin-field ${wide ? "admin-field-wide" : ""}`} dir={arabic ? "rtl" : "ltr"}><span>{label}</span>{children}</label>;
}

function MediaField({
    label,
    value,
    kind,
    accept,
    token,
    onChange,
}: {
    label: string;
    value: string;
    kind: "image" | "document" | "video";
    accept: string;
    token: string;
    onChange: (value: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    return (
        <Field label={label} wide>
            <div className="admin-upload-row">
                <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={kind === "image" ? "Upload an image" : "Upload a file"} />
                <label className="admin-upload-button">
                    <FaCloudArrowUp /> {uploading ? "Uploading..." : "Choose file"}
                    <input
                        type="file"
                        accept={accept}
                        disabled={uploading}
                        onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            try {
                                setUploading(true);
                                onChange(await uploadMedia(file, kind, token));
                            } finally {
                                setUploading(false);
                                event.target.value = "";
                            }
                        }}
                    />
                </label>
            </div>
            {value && kind === "image" && <img className="admin-upload-preview" src={value} alt="Upload preview" />}
        </Field>
    );
}

function ReportPdfField({
    mediaPath,
    imagePath,
    token,
    onMediaChange,
    onCoverChange,
}: {
    mediaPath: string;
    imagePath: string;
    token: string;
    onMediaChange: (value: string) => void;
    onCoverChange: (value: string) => void;
}) {
    const [uploading, setUploading] = useState(false);
    const [coverStatus, setCoverStatus] = useState("");

    return (
        <>
            <Field label="PDF report file" wide>
                <div className="admin-upload-row">
                    <input value={mediaPath} onChange={(event) => onMediaChange(event.target.value)} placeholder="Upload a PDF report" />
                    <label className="admin-upload-button">
                        <FaCloudArrowUp /> {uploading ? "Uploading..." : "Choose PDF"}
                        <input
                            type="file"
                            accept="application/pdf"
                            disabled={uploading}
                            onChange={async (event) => {
                                const file = event.target.files?.[0];
                                if (!file) return;
                                try {
                                    setUploading(true);
                                    setCoverStatus("Creating cover from page 1...");
                                    const [pdfPath, coverFile] = await Promise.all([
                                        uploadMedia(file, "document", token),
                                        pdfFirstPageCover(file),
                                    ]);
                                    const coverPath = await uploadMedia(coverFile, "image", token);
                                    onMediaChange(pdfPath);
                                    onCoverChange(coverPath);
                                    setCoverStatus("Cover generated from the first page.");
                                } catch (error) {
                                    setCoverStatus(error instanceof Error ? error.message : "Unable to generate the report cover.");
                                } finally {
                                    setUploading(false);
                                    event.target.value = "";
                                }
                            }}
                        />
                    </label>
                </div>
                <small className="admin-field-help">Uploading a PDF automatically uses page 1 as the report cover. You can still paste or upload a different cover below.</small>
                {coverStatus && <small className="admin-field-help">{coverStatus}</small>}
            </Field>
            <MediaField label="Report cover" value={imagePath} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={onCoverChange} />
        </>
    );
}

function ContentFields({
    item,
    token,
    filters,
    update,
}: {
    item: CmsItem;
    token: string;
    filters: CmsItem[];
    update: <K extends keyof CmsItem>(key: K, value: CmsItem[K]) => void;
}) {
    const bilingualTitle = (english: string, arabic: string) => (
        <>
            <Field label={english}><input value={item.title_en} onChange={(event) => update("title_en", event.target.value)} required /></Field>
            <Field label={arabic} arabic><input value={item.title_ar} onChange={(event) => update("title_ar", event.target.value)} required /></Field>
        </>
    );
    const bilingualBody = (english: string, arabic: string) => (
        <>
            <Field label={english}><textarea rows={5} value={item.body_en} onChange={(event) => update("body_en", event.target.value)} required /></Field>
            <Field label={arabic} arabic><textarea rows={5} value={item.body_ar} onChange={(event) => update("body_ar", event.target.value)} required /></Field>
        </>
    );
    const bilingualSubtitle = (english: string, arabic: string) => (
        <>
            <Field label={english}><input value={item.subtitle_en} onChange={(event) => update("subtitle_en", event.target.value)} required /></Field>
            <Field label={arabic} arabic><input value={item.subtitle_ar} onChange={(event) => update("subtitle_ar", event.target.value)} required /></Field>
        </>
    );
    const filterSelect = (
        <Field label="Filter category" wide>
            <SelectMenu
                dark
                value={item.filter_id}
                onChange={(value) => update("filter_id", value)}
                placeholder="Choose a filter"
                options={filters.map((filter) => ({ value: filter.id, label: `${filter.title_en} / ${filter.title_ar}` }))}
            />
            {filters.length === 0 && <small className="admin-field-help">Create a category in the Filters section first.</small>}
        </Field>
    );

    if (item.collection === "news") return (
        <>
            {bilingualTitle("News title (English)", "عنوان الخبر بالعربية")}
            {bilingualBody("Description (English)", "الوصف بالعربية")}
            <MediaField label="News picture" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
        </>
    );

    if (item.collection === "home_testimonials") return (
        <>
            {bilingualTitle("Person name (English)", "اسم الشخص بالعربية")}
            {bilingualSubtitle("Position (English)", "المنصب بالعربية")}
            {bilingualBody("Testimonial (English)", "الشهادة بالعربية")}
            <MediaField label="Person photo" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
        </>
    );

    if (item.collection === "program_testimonials") return (
        <>
            {bilingualTitle("Person name (English)", "اسم الشخص بالعربية")}
            {bilingualBody("Testimonial (English)", "الشهادة بالعربية")}
            <Field label="Program" wide>
                <SelectMenu
                    dark
                    value={item.program}
                    onChange={(value) => update("program", value)}
                    placeholder="Choose a program"
                    options={[
                        { value: "technical-vocational", label: "Technical vocational qualification" },
                        { value: "advanced-vocational", label: "Advanced vocational training" },
                        { value: "entrepreneurship", label: "Entrepreneurship" },
                        { value: "internship", label: "Internship" },
                    ]}
                />
            </Field>
        </>
    );

    if (item.collection === "team") return (
        <>
            {bilingualTitle("Name (English)", "الاسم بالعربية")}
            {bilingualSubtitle("Position (English)", "المنصب بالعربية")}
            <MediaField label="Team member photo" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
        </>
    );

    if (item.collection === "podcasts") return (
        <>
            {bilingualTitle("Episode name (English)", "اسم الحلقة بالعربية")}
            {bilingualSubtitle("Guest name (English)", "اسم الضيف بالعربية")}
            <Field label="YouTube episode link" wide><input type="url" value={item.external_url} onChange={(event) => update("external_url", event.target.value)} required /></Field>
            <div className="admin-field-wide admin-repeat-section">
                <div className="admin-repeat-heading">
                    <div><strong>Episode shorts</strong><span>Add the YouTube Shorts connected to this episode.</span></div>
                    <button type="button" onClick={() => update("shorts", [...item.shorts, { id: crypto.randomUUID(), title_en: "", title_ar: "", youtube_url: "" }])}><FaPlus /> Add short</button>
                </div>
                {item.shorts.length === 0 && <div className="admin-repeat-empty">No shorts added yet.</div>}
                {item.shorts.map((short, index) => (
                    <div className="admin-short-row" key={short.id}>
                        <Field label={`Short ${index + 1} title (English)`}><input value={short.title_en} onChange={(event) => update("shorts", item.shorts.map((entry) => entry.id === short.id ? { ...entry, title_en: event.target.value } : entry))} /></Field>
                        <Field label="عنوان المقطع بالعربية" arabic><input value={short.title_ar} onChange={(event) => update("shorts", item.shorts.map((entry) => entry.id === short.id ? { ...entry, title_ar: event.target.value } : entry))} /></Field>
                        <Field label="YouTube Short link" wide><input type="url" value={short.youtube_url} onChange={(event) => update("shorts", item.shorts.map((entry) => entry.id === short.id ? { ...entry, youtube_url: event.target.value } : entry))} /></Field>
                        <button className="admin-remove-short" type="button" onClick={() => update("shorts", item.shorts.filter((entry) => entry.id !== short.id))}><FaTrash /> Remove short</button>
                    </div>
                ))}
            </div>
        </>
    );

    if (item.collection === "reports") return (
        <>
            {bilingualTitle("Report title (English)", "عنوان التقرير بالعربية")}
            {bilingualBody("Report description (English)", "وصف التقرير بالعربية")}
            {filterSelect}
            <ReportPdfField
                mediaPath={item.media_path}
                imagePath={item.image_path}
                token={token}
                onMediaChange={(value) => update("media_path", value)}
                onCoverChange={(value) => update("image_path", value)}
            />
        </>
    );

    if (item.collection === "stories") return (
        <>
            {bilingualTitle("Person name (English)", "اسم الشخص بالعربية")}
            {bilingualSubtitle("Small code / program (English)", "الرمز الصغير أو البرنامج بالعربية")}
            {bilingualBody("Story text (English)", "نص القصة بالعربية")}
            {filterSelect}
            <MediaField label="Cover photo" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
            <Field label="Google Drive video file link (not a folder)" wide>
                <input
                    type="url"
                    value={item.external_url}
                    onChange={(event) => update("external_url", event.target.value)}
                    placeholder="https://drive.google.com/file/d/VIDEO_ID/view"
                    required
                />
                <small className="admin-field-help">Open the actual video file in Drive, click Share, and copy that file's link. Folder links cannot play as videos.</small>
            </Field>
        </>
    );

    if (item.collection === "certificates") return (
        <>
            <Field label="Certificate name shown to learners" wide>
                <input
                    value={item.certificate_type}
                    onChange={(event) => update("certificate_type", event.target.value)}
                    placeholder="Interior Design, Advanced Soft Skills and Design..."
                    required
                />
            </Field>
            <Field label="Full certificate name" wide>
                <input value={item.title_en} onChange={(event) => { update("title_en", event.target.value); update("title_ar", event.target.value); }} required />
            </Field>
            <Field label="Birthdate">
                <input type="date" value={item.birthdate} onChange={(event) => update("birthdate", event.target.value)} required />
            </Field>
            <Field label="Lookup group / folder name" wide>
                <input value={item.program} onChange={(event) => update("program", event.target.value)} placeholder="Use the certificate name for new batches" required />
                <small className="admin-field-help">This is the hidden lookup value. For new certificates, use the same full certificate name here.</small>
            </Field>
            <Field label="Issue date">
                <input type="date" value={item.published_at} onChange={(event) => update("published_at", event.target.value)} required />
            </Field>
            <MediaField label="Certificate PDF or file" value={item.media_path} kind="document" accept="application/pdf" token={token} onChange={(value) => update("media_path", value)} />
            <Field label="External certificate link (optional)" wide>
                <input type="url" value={item.external_url} onChange={(event) => update("external_url", event.target.value)} placeholder="Google Drive certificate link" />
                <small className="admin-field-help">Use this if the certificate already lives in Drive. The verified visitor receives this link when no uploaded PDF is set.</small>
            </Field>
        </>
    );

    if (item.collection === "gallery") return (
        <>
            <Field label="Photo name / caption" wide><input value={item.title_en} onChange={(event) => { update("title_en", event.target.value); update("title_ar", event.target.value); }} required /></Field>
            <MediaField label="Library photo" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
        </>
    );

    if (item.collection === "workspace_images") return (
        <>
            <Field label="Workspace area" wide>
                <SelectMenu
                    dark
                    value={item.program}
                    onChange={(value) => {
                        update("program", value);
                        const label = {
                            shared: "Shared Workspace",
                            meeting: "Meeting Rooms",
                            training: "Training Rooms",
                            offices: "Private Offices",
                            cafe: "Business Cafe",
                        }[value] || "";
                        update("title_en", label);
                        update("title_ar", label);
                    }}
                    placeholder="Choose an area"
                    options={[
                        { value: "shared", label: "Shared Workspace" },
                        { value: "meeting", label: "Meeting Rooms" },
                        { value: "training", label: "Training Rooms" },
                        { value: "offices", label: "Private Offices" },
                        { value: "cafe", label: "Business Cafe" },
                    ]}
                />
            </Field>
            <Field label="Display name" wide><input value={item.title_en} onChange={(event) => { update("title_en", event.target.value); update("title_ar", event.target.value); }} required /></Field>
            <MediaField label="Workspace photo" value={item.image_path} kind="image" accept="image/jpeg,image/png,image/webp" token={token} onChange={(value) => update("image_path", value)} />
        </>
    );

    return bilingualTitle("Filter name (English)", "اسم الفلتر بالعربية");
}

function itemSummary(item: CmsItem) {
    if (item.collection === "podcasts") return item.subtitle_en || `${item.shorts.length} shorts`;
    if (item.collection === "reports") return item.media_path ? "PDF uploaded" : "No PDF uploaded";
    if (item.collection === "certificates") return `${item.program || "No program"} · ${item.birthdate || "No birthdate"}`;
    if (item.collection === "workspace_images") return item.program ? `Workspace area: ${item.program}` : "Choose a workspace area";
    if (item.collection === "gallery") return "Photo library";
    return item.subtitle_en || item.body_en || "No description";
}

function FilterManager({
    scope,
    filters,
    onAdd,
    onEdit,
    onDelete,
}: {
    scope: "reports" | "stories";
    filters: CmsItem[];
    onAdd: () => void;
    onEdit: (item: CmsItem) => void;
    onDelete: (item: CmsItem) => void;
}) {
    return (
        <section className="admin-filter-manager">
            <div>
                <span className="admin-filter-kicker">{scope === "reports" ? "Report filters" : "Inspiring story filters"}</span>
                <h3>Manage filter categories</h3>
                <p>Create categories here, then select one when adding content.</p>
            </div>
            <div className="admin-filter-actions">
                <button type="button" className="admin-add-filter" onClick={onAdd}><FaPlus /> Add filter</button>
                <div className="admin-filter-chips">
                    {filters.length === 0 && <span className="admin-filter-none">No filters yet</span>}
                    {filters.map((filter) => (
                        <span className="admin-filter-chip" key={filter.id}>
                            <button type="button" onClick={() => onEdit(filter)}>{filter.title_en}</button>
                            <button type="button" className="danger" aria-label={`Delete ${filter.title_en}`} onClick={() => onDelete(filter)}><FaXmark /></button>
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

type BulkCertificateRow = {
    fullName: string;
    birthdate: string;
    program: string;
    filePath: string;
};

const cleanSpreadsheetValue = (value: unknown) => String(value ?? "").trim();
const findColumnValue = (row: Record<string, unknown>, names: string[]) => {
    const entries = Object.entries(row);
    const found = entries.find(([key]) => {
        const normalized = key.toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/gi, "");
        return names.some((name) => normalized.includes(name));
    });
    return cleanSpreadsheetValue(found?.[1]);
};
const normalizeSpreadsheetDate = (value: unknown) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
    if (typeof value === "number") {
        const excelEpoch = Date.UTC(1899, 11, 30);
        const date = new Date(excelEpoch + value * 24 * 60 * 60 * 1000);
        if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);
    }
    const raw = cleanSpreadsheetValue(value);
    const match = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);
    if (match) {
        const first = Number(match[1]);
        const second = Number(match[2]);
        const year = Number(match[3].length === 2 ? `19${match[3]}` : match[3]);
        const month = first > 12 ? second : first;
        const day = first > 12 ? first : second;
        return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    return raw;
};
const resolveCertificateProgram = (value: string, fallback: string, programs: string[]) => {
    if (!value) return fallback;
    const normalized = normalizeCertificateLookup(value);
    return programs.find((program) => (
        normalizeCertificateLookup(program) === normalized
        || normalizeCertificateLookup(certificateProgramLabel(program)) === normalized
    )) || value;
};
const parseCsvLine = (line: string) => {
    const cells: string[] = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
        const char = line[index];
        const next = line[index + 1];
        if (char === '"' && quoted && next === '"') {
            value += '"';
            index += 1;
        } else if (char === '"') {
            quoted = !quoted;
        } else if (char === "," && !quoted) {
            cells.push(value);
            value = "";
        } else {
            value += char;
        }
    }
    cells.push(value);
    return cells;
};
const spreadsheetRowsToObjects = (rows: unknown[][]) => {
    const [headerRow, ...bodyRows] = rows;
    const headers = (headerRow || []).map((header, index) => cleanSpreadsheetValue(header) || `Column ${index + 1}`);
    return bodyRows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));
};
const readSpreadsheetRows = async (file: File) => {
    if (/\.csv$/i.test(file.name)) {
        const lines = (await file.text()).split(/\r?\n/).filter((line) => line.trim());
        return spreadsheetRowsToObjects(lines.map(parseCsvLine));
    }
    return spreadsheetRowsToObjects(await readXlsxFile(file) as unknown as unknown[][]);
};
const parseCertificateRows = (rows: Record<string, unknown>[], fallbackProgram: string, programs: string[]): BulkCertificateRow[] => {
    return rows.map((row) => {
        const fullName = findColumnValue(row, ["fullname", "name", "studentname", "الاسمالكامل", "الاسم"]);
        const birthdateKey = Object.keys(row).find((key) => {
            const normalized = key.toLocaleLowerCase().replace(/[^a-z0-9\u0600-\u06ff]+/gi, "");
            return ["dateofbirth", "birthdate", "dob", "تاريخالميلاد"].some((name) => normalized.includes(name));
        });
        const program = resolveCertificateProgram(findColumnValue(row, ["program", "certificatetype", "certificate", "course", "برنامج"]), fallbackProgram, programs);
        const filePath = findColumnValue(row, ["certificatepath", "filepath", "fileurl", "url", "link", "pdf"]);
        return {
            fullName,
            birthdate: normalizeSpreadsheetDate(birthdateKey ? row[birthdateKey] : ""),
            program,
            filePath,
        };
    }).filter((row) => row.fullName);
};

function BulkCertificateImport({
    token,
    programs,
    onImported,
}: {
    token: string;
    programs: string[];
    onImported: (items: CmsItem[]) => void;
}) {
    const [program, setProgram] = useState("");
    const [newCertificateName, setNewCertificateName] = useState("");
    const [sheetFile, setSheetFile] = useState<File | null>(null);
    const [pdfFiles, setPdfFiles] = useState<File[]>([]);
    const [status, setStatus] = useState("");
    const [importing, setImporting] = useState(false);

    const importRows = async () => {
        const certificateName = newCertificateName.trim() || program;
        if (!sheetFile || !certificateName) {
            setStatus("Enter a certificate name and upload an Excel or CSV file first.");
            return;
        }
        try {
            setImporting(true);
            setStatus("Reading spreadsheet...");
            const rows = parseCertificateRows(await readSpreadsheetRows(sheetFile), certificateName, programs);
            if (rows.length === 0) throw new Error("No student names were found in the spreadsheet.");

            const uploadedByName = new Map<string, string>();
            for (const file of pdfFiles) {
                setStatus(`Uploading ${file.name}...`);
                const key = normalizeCertificateLookup(file.name.replace(/\.[^.]+$/, ""));
                uploadedByName.set(key, await uploadMedia(file, "document", token));
            }

            const savedItems: CmsItem[] = [];
            for (const [index, row] of rows.entries()) {
                const matchedFile = uploadedByName.get(normalizeCertificateLookup(row.fullName));
                const filePath = matchedFile || row.filePath;
                const saved = await saveItem({
                    ...emptyCmsItem("certificates"),
                    title_en: row.fullName,
                    title_ar: row.fullName,
                    birthdate: row.birthdate,
                    program: row.program,
                    certificate_type: certificateProgramLabel(row.program),
                    media_path: filePath && !/^https?:\/\//i.test(filePath) ? filePath : "",
                    external_url: /^https?:\/\//i.test(filePath) ? filePath : "",
                    published: Boolean(row.birthdate && filePath),
                    sort_order: index,
                }, token);
                savedItems.push(saved);
            }
            onImported(savedItems);
            const ready = savedItems.filter((item) => item.published).length;
            setStatus(`Imported ${savedItems.length} students. ${ready} are ready for verification.`);
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Bulk import failed.");
        } finally {
            setImporting(false);
        }
    };

    return (
        <section className="admin-bulk-import">
            <div>
                <span className="admin-filter-kicker">Bulk certificates</span>
                <h3>Upload student names, birthdates, and PDFs</h3>
                <p>Use Excel or CSV columns like Full Name, Birthdate, Program, and Certificate Path. PDFs are matched by student name.</p>
            </div>
            <div className="admin-bulk-grid">
                <label>
                    <span>Existing certificate type (optional)</span>
                    <SelectMenu
                        dark
                        value={program}
                        onChange={setProgram}
                        placeholder="No existing type selected"
                        options={[
                            { value: "", label: "No existing type selected" },
                            ...certificateProgramOptions(programs),
                        ]}
                    />
                </label>
                <label>
                    <span>New certificate name</span>
                    <input
                        value={newCertificateName}
                        onChange={(event) => setNewCertificateName(event.target.value)}
                        placeholder="Interior Design"
                    />
                </label>
                <label className="admin-file-picker">
                    <span>Excel / CSV file</span>
                    <strong><FaFileExcel /> {sheetFile?.name || "Choose spreadsheet"}</strong>
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => setSheetFile(event.target.files?.[0] || null)} />
                </label>
                <label className="admin-file-picker">
                    <span>Certificate PDFs</span>
                    <strong><FaCloudArrowUp /> {pdfFiles.length ? `${pdfFiles.length} PDFs selected` : "Choose PDFs"}</strong>
                    <input type="file" accept="application/pdf" multiple onChange={(event) => setPdfFiles(Array.from(event.target.files || []))} />
                </label>
                <button type="button" className="admin-primary" disabled={importing} onClick={importRows}>
                    <FaCloudArrowUp /> {importing ? "Importing..." : "Import bulk"}
                </button>
            </div>
            {status && <div className="admin-bulk-status">{status}</div>}
        </section>
    );
}

function CertificateTable({
    items,
    loading,
    onEdit,
    onDelete,
}: {
    items: CmsItem[];
    loading: boolean;
    onEdit: (item: CmsItem) => void;
    onDelete: (item: CmsItem) => void;
}) {
    const programs = useMemo(() => {
        const unique = new Set(items.map((item) => item.program || "No program"));
        return [...unique].sort((a, b) => a.localeCompare(b));
    }, [items]);
    const [activeProgram, setActiveProgram] = useState("all");
    const [previewId, setPreviewId] = useState("");
    const visiblePrograms = activeProgram === "all" ? programs : programs.filter((program) => program === activeProgram);
    const countFor = (program: string) => items.filter((item) => (item.program || "No program") === program).length;
    const labelFor = (program: string) => items.find((item) => (item.program || "No program") === program && item.certificate_type)?.certificate_type || certificateProgramLabel(program);

    return (
        <div className="admin-certificate-groups">
            <div className="admin-certificate-tabs" aria-label="Filter certificate type">
                <button type="button" className={activeProgram === "all" ? "active" : ""} onClick={() => setActiveProgram("all")}>
                    All <span>{items.length}</span>
                </button>
                {programs.map((program) => (
                    <button type="button" className={activeProgram === program ? "active" : ""} key={program} onClick={() => setActiveProgram(program)}>
                        {labelFor(program)} <span>{countFor(program)}</span>
                    </button>
                ))}
            </div>

            {visiblePrograms.map((program) => {
                const programItems = items.filter((item) => (item.program || "No program") === program);
                const published = programItems.filter((item) => item.published).length;
                const missingBirthdates = programItems.length - published;
                const groupLabel = labelFor(program);
                return (
                    <section className="admin-certificate-section" key={program}>
                        <div className="admin-certificate-heading">
                            <div>
                                <h3>{groupLabel}</h3>
                                <p>{programItems.length} certificates · {published} published · {missingBirthdates} need birthdate</p>
                            </div>
                        </div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Birthdate</th>
                                        <th>File</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {programItems.map((item) => {
                                        const fileUrl = item.media_path || item.external_url;
                                        return (
                                            <Fragment key={item.id}>
                                                <tr>
                                                    <td>
                                                        <strong>{item.title_en || item.title_ar || "Untitled certificate"}</strong>
                                                    </td>
                                                    <td>{item.birthdate || <span className="admin-muted">No birthdate</span>}</td>
                                                    <td>
                                                        {fileUrl
                                                            ? <a href={fileUrl} target="_blank" rel="noreferrer">PDF</a>
                                                            : <span className="admin-muted">No file</span>}
                                                    </td>
                                                    <td>
                                                        <span className={`admin-table-status ${item.published ? "published" : "draft"}`}>
                                                            {item.published ? "Published" : "Needs birthdate"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="admin-table-actions">
                                                            {fileUrl && (
                                                                <button type="button" onClick={() => setPreviewId((current) => current === item.id ? "" : item.id)}><FaEye /> Preview</button>
                                                            )}
                                                            <button type="button" onClick={() => onEdit({ ...item, shorts: item.shorts || [] })}><FaPen /> Edit</button>
                                                            <button
                                                                type="button"
                                                                className="danger"
                                                                disabled={loading}
                                                                onClick={() => onDelete(item)}
                                                            >
                                                                <FaTrash /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {fileUrl && previewId === item.id && (
                                                    <tr className="admin-preview-row">
                                                        <td colSpan={5}>
                                                            <iframe title={`Certificate preview for ${item.title_en}`} src={`${fileUrl}#toolbar=0&navpanes=0`} />
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}

export default function AdminPage() {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [collection, setCollection] = useState<CmsCollection>("news");
    const [items, setItems] = useState<CmsItem[]>([]);
    const [editing, setEditing] = useState<CmsItem | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [filters, setFilters] = useState<CmsItem[]>([]);
    const currentCollection = useMemo(() => CMS_COLLECTIONS.find((entry) => entry.id === collection) || CMS_COLLECTIONS[0], [collection]);
    const certificatePrograms = useMemo(() => {
        const unique = new Set(items.filter((item) => item.collection === "certificates" && item.program).map((item) => item.program));
        const programs = unique.size ? [...unique] : defaultCertificatePrograms();
        return programs.sort((a, b) => certificateProgramLabel(a).localeCompare(certificateProgramLabel(b)));
    }, [items]);

    useEffect(() => {
        if (!token) return;
        setLoading(true);
        setMessage("");
        listItems(collection, token).then((result) => setItems(sortItems(result))).catch((error: Error) => setMessage(error.message)).finally(() => setLoading(false));
    }, [collection, token]);

    useEffect(() => {
        if (!token) return;
        listItems("filters", token).then(setFilters).catch(() => setFilters([]));
    }, [token, collection]);

    if (!token) return <Login onSuccess={setToken} />;
    const scopedFilters = filters.filter((filter) => filter.program === collection);
    const update = <K extends keyof CmsItem>(key: K, value: CmsItem[K]) => setEditing((current) => current ? { ...current, [key]: value } : current);

    const moveItem = async (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= items.length) return;

        const reordered = [...items];
        [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
        const normalized = reordered.map((item, position) => ({ ...item, sort_order: position }));
        setItems(normalized);
        setLoading(true);
        setMessage("");
        try {
            await saveOrder(collection, normalized.map((item) => item.id), token);
            setMessage("Order updated.");
        } catch (error) {
            setItems(items);
            setMessage(error instanceof Error ? error.message : "Unable to update the order.");
        } finally {
            setLoading(false);
        }
    };

    const persist = async (event: FormEvent) => {
        event.preventDefault();
        if (!editing) return;
        if ((editing.collection === "reports" || editing.collection === "stories") && !editing.filter_id) {
            setMessage("Create and choose a filter category before saving.");
            return;
        }
        if (
            editing.collection === "certificates"
            && (!editing.certificate_type || !editing.title_en || !editing.program || !editing.birthdate || (!editing.media_path && !editing.external_url))
        ) {
            setMessage("Certificate name, learner name, lookup group, birthdate, and a certificate file or link are required.");
            return;
        }
        try {
            setLoading(true);
            const saved = await saveItem({ ...editing, published: true }, token);
            if (saved.collection !== "filters") {
                setItems((current) => sortItems([saved, ...current.filter((item) => item.id !== saved.id)]));
            }
            setEditing(null);
            setMessage("Saved successfully.");
            if (saved.collection === "filters") setFilters((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Save failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-shell">
            <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
                <div className="admin-brand"><img src={logo} alt="Core Istanbul" /><button onClick={() => setMenuOpen(false)}><FaXmark /></button></div>
                <nav>{CMS_COLLECTIONS.map((entry) => (
                    <button key={entry.id} className={entry.id === collection ? "active" : ""} onClick={() => { setCollection(entry.id); setEditing(null); setMenuOpen(false); }}>
                        <span>{entry.label}</span><small>{entry.description}</small>
                    </button>
                ))}</nav>
                <button className="admin-logout" onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(""); }}><FaArrowRightFromBracket /> Sign out</button>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <button className="admin-menu" onClick={() => setMenuOpen(true)}><FaBars /></button>
                    <div><p>Core Istanbul CMS</p><h1>{currentCollection.label}</h1></div>
                    <button className="admin-primary" onClick={() => setEditing({ ...emptyCmsItem(collection), sort_order: items.length })}><FaPlus /> Add new</button>
                </header>
                {message && <div className="admin-status">{message}</div>}
                <section className="admin-content">
                    <div className="admin-section-heading"><div><h2>Manage {currentCollection.label.toLowerCase()}</h2><p>{currentCollection.description}</p></div><span>{items.length} items</span></div>
                    {(collection === "reports" || collection === "stories") && (
                        <FilterManager
                            scope={collection}
                            filters={scopedFilters}
                            onAdd={() => setEditing({ ...emptyCmsItem("filters"), program: collection })}
                            onEdit={(filter) => setEditing(filter)}
                            onDelete={async (filter) => {
                                if (!window.confirm(`Delete the "${filter.title_en}" filter?`)) return;
                                await deleteItem(filter.id, "filters", token);
                                setFilters((current) => current.filter((entry) => entry.id !== filter.id));
                            }}
                        />
                    )}
                    {collection === "certificates" && (
                        <BulkCertificateImport
                            token={token}
                            programs={certificatePrograms}
                            onImported={(savedItems) => {
                                setItems((current) => sortItems([
                                    ...savedItems,
                                    ...current.filter((item) => !savedItems.some((saved) => saved.id === item.id)),
                                ]));
                            }}
                        />
                    )}
                    {loading && !editing && <div className="admin-empty">Loading content...</div>}
                    {!loading && items.length === 0 && <div className="admin-empty">No content yet. Add the first item.</div>}
                    {items.length > 0 && collection === "certificates" ? (
                        <CertificateTable
                            items={items}
                            loading={loading}
                            onEdit={setEditing}
                            onDelete={async (item) => {
                                if (!window.confirm("Delete this certificate permanently?")) return;
                                await deleteItem(item.id, collection, token);
                                setItems((current) => current.filter((entry) => entry.id !== item.id));
                            }}
                        />
                    ) : items.length > 0 ? (
                        <div className="admin-grid">{items.map((item, index) => (
                            <article className="admin-card" key={item.id}>
                                <div className="admin-card-image">
                                    {item.image_path ? <img src={item.image_path} alt="" /> : <span>CORE</span>}
                                    <span className="admin-position">Position {index + 1}</span>
                                </div>
                                <div className="admin-card-body"><h3>{item.title_en || item.title_ar || "Untitled item"}</h3><p>{itemSummary(item)}</p>
                                    <div className="admin-order-actions" aria-label={`Change position of ${item.title_en || "item"}`}>
                                        <button type="button" disabled={index === 0 || loading} onClick={() => moveItem(index, -1)}><FaArrowUp /> Move up</button>
                                        <button type="button" disabled={index === items.length - 1 || loading} onClick={() => moveItem(index, 1)}><FaArrowDown /> Move down</button>
                                    </div>
                                    <div className="admin-card-actions">
                                        <button onClick={() => setEditing({ ...item, shorts: item.shorts || [] })}><FaPen /> Edit</button>
                                        <button className="danger" onClick={async () => { if (!window.confirm("Delete this item permanently?")) return; await deleteItem(item.id, collection, token); setItems((current) => current.filter((entry) => entry.id !== item.id)); }}><FaTrash /> Delete</button>
                                    </div>
                                </div>
                            </article>
                        ))}</div>
                    ) : null}
                </section>
            </main>
            {editing && (
                <div className="admin-modal-backdrop">
                    <form className="admin-modal" onSubmit={persist}>
                        <div className="admin-modal-header"><div><p>{editing.id ? "Edit content" : "New content"}</p><h2>{editing.collection === "filters" ? "Filter category" : currentCollection.label}</h2></div><button type="button" onClick={() => setEditing(null)}><FaXmark /></button></div>
                        <div className="admin-form-grid"><ContentFields item={editing} token={token} filters={scopedFilters} update={update} /></div>
                        <div className="admin-modal-actions"><button type="button" onClick={() => setEditing(null)}>Cancel</button><button className="admin-primary" disabled={loading}><FaFloppyDisk /> {loading ? "Saving..." : "Save"}</button></div>
                    </form>
                </div>
            )}
        </div>
    );
}
