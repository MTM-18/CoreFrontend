// src/components/layout/Footer.tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LogoWhite from "../../assets/logo/fullWhiteLogo.svg";

export default function Footer() {
    const { t, i18n } = useTranslation();

    const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const onSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg(null);

        const clean = email.trim().toLowerCase();
        if (!clean) {
            setMsg({ type: "err", text: t("footer.newsletterErrorEmpty") });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/newsletter_subscribe.php", {
                method: "POST",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email: clean, lang }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok || !data?.ok) {
                setMsg({
                    type: "err",
                    text: data?.message || t("footer.newsletterErrorGeneric"),
                });
                return;
            }

            setMsg({ type: "ok", text: data?.message || t("footer.newsletterSuccess") });
            setEmail("");
        } catch {
            setMsg({ type: "err", text: t("footer.newsletterErrorNetwork") });
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="mt-16">
            <div className="footer-surface">
                <div className="footer-inner">
                    {/* Column 1 – Logo + description */}
                    <div>
                        <img src={LogoWhite} alt={t("footer.logoAlt")} className="h-16 mb-0" />
                        <p className="footer-text mt-3">{t("footer.officeEmail")}</p>
                        <p className="footer-text mt-1">{t("footer.officePhone")}</p>
                    </div>

                    {/* Column 2 – Office info */}
                    <div>
                        <h3 className="footer-heading">{t("footer.locationTitle")}</h3>
                        <p className="footer-text">
                            {t("footer.location.line1")}
                            <br />
                            {t("footer.location.line2")}
                            <br />
                            {t("footer.location.line3")}
                            <br />
                        </p>
                    </div>

                    {/* Column 4 – Newsletter */}
                    <div>
                        <h3 className="footer-heading">{t("footer.newsletterTitle")}</h3>
                        {/* <p className="footer-text">{t("footer.newsletterDescription")}</p> */}

                        <form className="footer-newsletter-row" onSubmit={onSubscribe}>
                            <input
                                type="email"
                                className="footer-email-input"
                                placeholder={t("footer.newsletterPlaceholder")}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                                required
                            />
                            <button className="btn-primary" type="submit" disabled={loading}>
                                {loading ? t("footer.newsletterLoading") : t("footer.newsletterButton")}
                            </button>
                        </form>

                        {msg && (
                            <div
                                className={`mt-2 text-xs ${msg.type === "ok" ? "text-green-400" : "text-red-400"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
