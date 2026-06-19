export type CmsCollection =
    | "news"
    | "home_testimonials"
    | "program_testimonials"
    | "team"
    | "podcasts"
    | "reports"
    | "stories"
    | "certificates"
    | "workspace_images"
    | "gallery"
    | "filters";

export type PodcastShort = {
    id: string;
    title_en: string;
    title_ar: string;
    youtube_url: string;
};

export type CmsItem = {
    id: string;
    collection: CmsCollection;
    title_en: string;
    title_ar: string;
    body_en: string;
    body_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    image_path: string;
    media_path: string;
    external_url: string;
    program: string;
    certificate_code: string;
    certificate_type: string;
    first_name: string;
    birthdate: string;
    published_at: string;
    published: boolean;
    featured: boolean;
    sort_order: number;
    filter_id: string;
    shorts: PodcastShort[];
    created_at?: string;
    updated_at?: string;
};

export const CMS_COLLECTIONS: Array<{
    id: CmsCollection;
    label: string;
    description: string;
}> = [
    { id: "news", label: "News", description: "Title, description, and picture" },
    { id: "home_testimonials", label: "Core testimonials", description: "Testimonials shown on the homepage" },
    { id: "program_testimonials", label: "Program testimonials", description: "Testimonials assigned to a specific program" },
    { id: "team", label: "Team members", description: "Photo, name, and position" },
    { id: "podcasts", label: "Podcast episodes", description: "Episode, guest, YouTube link, and shorts" },
    { id: "reports", label: "Reports", description: "Report details, cover, and PDF file" },
    { id: "stories", label: "Inspiring stories", description: "Cover, graduate details, and Drive/video link" },
    { id: "certificates", label: "Certificates", description: "Private certificate verification records" },
    { id: "workspace_images", label: "Workspace images", description: "Photos for workspace rooms and cafe" },
    { id: "gallery", label: "Photo library", description: "Photo and one caption" },
];

export const emptyCmsItem = (collection: CmsCollection): CmsItem => ({
    id: "",
    collection,
    title_en: "",
    title_ar: "",
    body_en: "",
    body_ar: "",
    subtitle_en: "",
    subtitle_ar: "",
    image_path: "",
    media_path: "",
    external_url: "",
    program: collection === "program_testimonials" ? "technical-vocational" : "",
    certificate_code: "",
    certificate_type: "",
    first_name: "",
    birthdate: "",
    published_at: new Date().toISOString().slice(0, 10),
    published: true,
    featured: false,
    sort_order: 0,
    filter_id: "",
    shorts: [],
});
