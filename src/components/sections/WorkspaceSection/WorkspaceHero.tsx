import { useTranslation } from "react-i18next";

export default function WorkspaceHero() {
    const { t } = useTranslation();

    return (
        <section className="layout-shell py-12 md:py-16">
            <div className="max-w-5xl mx-auto">
                <h1 className="mb-4 text-2xl md:text-3xl font-semibold">
                    {t("workspacePage.hero.title")}
                </h1>

                <div className="relative w-full pt-[56.25%] card-surface rounded-2xl overflow-hidden">
                    <iframe
                        className="absolute inset-0 h-full w-full rounded-2xl"
                        src={t("workspacePage.hero.videoUrl")}
                        title={t("workspacePage.hero.videoTitle")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            </div>
        </section>
    );
}
