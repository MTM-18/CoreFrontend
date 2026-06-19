import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { FaCertificate, FaCircleCheck, FaDownload } from "react-icons/fa6";

import { listCertificatePrograms, verifyCertificate, type CertificateVerificationResult } from "../cms/api";
import { certificateProgramLabel, type CertificateProgramOption } from "../cms/certificates";
import PageShell from "../components/layout/PageShell";
import SelectMenu from "../components/ui/SelectMenu";

export default function CertificatesPage() {
    const { i18n } = useTranslation();
    const isAr = i18n.language.startsWith("ar");
    const [programs, setPrograms] = useState<CertificateProgramOption[]>([]);
    const [program, setProgram] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [loading, setLoading] = useState(false);
    const [programsLoading, setProgramsLoading] = useState(true);
    const [error, setError] = useState("");
    const [certificate, setCertificate] = useState<CertificateVerificationResult | null>(null);

    useEffect(() => {
        let active = true;
        listCertificatePrograms()
            .then((items) => {
                if (!active) return;
                setPrograms(items);
                setProgram((current) => current || items[0]?.value || "");
            })
            .catch(() => {
                if (active) setPrograms([]);
            })
            .finally(() => {
                if (active) setProgramsLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            setLoading(true);
            setError("");
            setCertificate(null);
            setCertificate(await verifyCertificate({ program, fullName, birthdate }));
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Unable to verify this certificate.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell>
            <section
                dir={isAr ? "rtl" : "ltr"}
                className="min-h-screen bg-core-bg px-4 py-10 text-white sm:px-6 md:py-16 lg:px-10"
            >
                <div className="mx-auto grid w-full max-w-5xl gap-8">
                    <header className={`w-full ${isAr ? "text-right" : "text-left"}`}>
                        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
                            {isAr ? "التحقق من الشهادات" : "Certificates Verification"}
                        </h1>
                        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/72 md:text-base">
                            {isAr
                                ? "اختر اسم الشهادة، ثم أدخل الاسم الكامل وتاريخ الميلاد للوصول إلى الشهادة الرسمية."
                                : "Choose the certificate name, then enter your full name and birthdate to access the official certificate."}
                        </p>
                    </header>

                    <div className="w-full rounded-[1.4rem] border border-white/12 bg-[#24102c]/72 p-5 shadow-[0_28px_80px_rgba(31,10,45,0.26)] ring-1 ring-white/5 backdrop-blur-2xl sm:p-7">
                        <form className="grid gap-4 lg:grid-cols-[1.15fr_1fr_.8fr_auto] lg:items-end" onSubmit={submit}>
                            <label className="grid gap-2 text-sm font-semibold text-white/82">
                                <span>{isAr ? "اسم الشهادة" : "Certificate name"}</span>
                                <SelectMenu
                                    value={program}
                                    onChange={setProgram}
                                    placeholder={programsLoading ? (isAr ? "جاري تحميل الشهادات..." : "Loading certificates...") : (isAr ? "اختر الشهادة" : "Choose a certificate")}
                                    options={programs}
                                    dark
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-white/82">
                                <span>{isAr ? "الاسم الكامل" : "Full name"}</span>
                                <input
                                    value={fullName}
                                    onChange={(event) => setFullName(event.target.value)}
                                    placeholder={isAr ? "الاسم الأول واسم العائلة" : "First and last name"}
                                    className="min-h-12 rounded-full border border-white/12 bg-white/[0.055] px-5 py-3 text-sm text-white outline-none transition placeholder:text-white/35 hover:border-core-accent/50 focus:border-core-accent focus:ring-4 focus:ring-core-accent/15"
                                    required
                                />
                            </label>

                            <label className="grid gap-2 text-sm font-semibold text-white/82">
                                <span>{isAr ? "تاريخ الميلاد" : "Birthdate"}</span>
                                <input
                                    type="date"
                                    value={birthdate}
                                    onChange={(event) => setBirthdate(event.target.value)}
                                    className="min-h-12 rounded-full border border-white/12 bg-white/[0.055] px-5 py-3 text-sm text-white outline-none transition hover:border-core-accent/50 focus:border-core-accent focus:ring-4 focus:ring-core-accent/15"
                                    required
                                />
                            </label>

                            <button
                                type="submit"
                                disabled={loading || programsLoading || programs.length === 0}
                                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-core-brand to-core-accent px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_38px_rgba(106,27,154,0.28)] transition hover:shadow-[0_18px_44px_rgba(243,123,39,0.25)] disabled:cursor-wait disabled:opacity-60"
                            >
                                <FaCertificate />
                                {loading ? (isAr ? "جاري التحقق..." : "Verifying...") : (isAr ? "تحقق" : "Verify")}
                            </button>
                        </form>

                        {!programsLoading && programs.length === 0 && (
                            <div className="mt-4 rounded-2xl border border-core-accent/20 bg-core-accent/10 p-4 text-sm text-white/70">
                                {isAr ? "ستظهر الشهادات بعد إضافتها في لوحة التحكم." : "Certificates will appear after they are added in the CMS."}
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-100">
                                {isAr ? "لم يتم العثور على شهادة بهذه البيانات." : error}
                            </div>
                        )}
                    </div>

                    {certificate && (
                        <div className="w-full overflow-hidden rounded-[1.4rem] border border-white/12 bg-[#24102c]/72 text-white shadow-[0_28px_80px_rgba(31,10,45,0.28)] ring-1 ring-white/5 backdrop-blur-2xl">
                            <div className="flex flex-col gap-4 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <FaCircleCheck className="mt-1 shrink-0 text-xl text-emerald-400" />
                                    <div>
                                        <h2 className="text-lg font-semibold">
                                            {isAr ? "تم التحقق من الشهادة" : "Certificate verified"}
                                        </h2>
                                        <dl className="mt-3 grid gap-2 text-sm text-white/78 sm:grid-cols-3">
                                            <div>
                                                <dt className="text-white/45">{isAr ? "الاسم" : "Name"}</dt>
                                                <dd className="font-semibold text-white">{certificate.full_name}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-white/45">{isAr ? "الشهادة" : "Certificate"}</dt>
                                                <dd className="font-semibold text-white">{certificate.certificate_type || certificateProgramLabel(certificate.program)}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-white/45">{isAr ? "تاريخ الإصدار" : "Issue date"}</dt>
                                                <dd className="font-semibold text-white">{certificate.issued_at}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                                {certificate.file_url && (
                                    <a
                                        href={certificate.file_url}
                                        download
                                        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-core-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-core-brand"
                                    >
                                        <FaDownload className="text-xs" />
                                        {isAr ? "تحميل الشهادة" : "Download"}
                                    </a>
                                )}
                            </div>
                            {certificate.file_url && (
                                <div className="bg-black/18 p-3">
                                    <iframe
                                        title={isAr ? "عرض الشهادة" : "Certificate preview"}
                                        src={`${certificate.file_url}#toolbar=0&navpanes=0`}
                                        className="h-[44rem] w-full rounded-xl border border-white/10 bg-white"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </PageShell>
    );
}
