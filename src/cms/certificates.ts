const CERTIFICATE_PROGRAM_LABELS: Record<string, string> = {
    "DM-01-Certificates": "Digital Marketing - Cohort 01",
    "DM-02-Certificates": "Digital Marketing - Cohort 02",
    "EC-Certificates": "E-Commerce",
    "FA-Certificates": "Financial Awareness",
    "GD-Certificates": "Graphic Design",
    "ID-Certificates": "Interior Design",
    "PP-Certificates": "Project Planning",
    "SSD-01-Certificates": "Soft Skills Development - Cohort 01",
    "SSD-02-Certificates": "Soft Skills Development - Cohort 02",
    "ادارة المشاريع": "Project Management",
    "المتطوعين": "Volunteer",
    "برنامج المبيعات": "Sales Program",
    "برنامج الموشن": "Motion Graphics",
    "برنانج التسويق الرقمي": "Digital Marketing",
};

export type CertificateProgramOption = {
    value: string;
    label: string;
};

export function certificateProgramLabel(value: string) {
    return CERTIFICATE_PROGRAM_LABELS[value] || stripCertificateWord(value) || "No certificate type";
}

export function defaultCertificatePrograms() {
    return Object.keys(CERTIFICATE_PROGRAM_LABELS);
}

export function certificateProgramOptions(programs: string[]): CertificateProgramOption[] {
    return programs.map((program) => ({
        value: program,
        label: certificateProgramLabel(program),
    }));
}

export function normalizeCertificateLookup(value: string) {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase()
        .replace(/[^a-z0-9\u0600-\u06ff]+/gi, "");
}

function stripCertificateWord(value: string) {
    return value.replace(/\s*Certificate(s)?\b/gi, "").replace(/\s+-\s+/g, " - ").trim();
}
