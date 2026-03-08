import { useTranslation } from "react-i18next";
import ComingSoonLogo from "../assets/logo/lwhiteLogoPurpleOutline.png"

type ComingSoonPageProps = {
    titleKey: string;
};

export default function ComingSoonPage({ titleKey }: ComingSoonPageProps) {
    const { t } = useTranslation();

    return (
        <div className="layout-shell flex min-h-[70vh] items-center justify-center px-4 py-12">
            <section className="max-w-2xl rounded-[32px] border border-black/8 bg-white/80 p-8 text-center shadow-sm dark:border-white/10 dark:bg-white/5 md:p-10">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-core-brand/10 text-2xl text-core-brand dark:bg-core-textAccent/12 dark:text-core-textAccent">
                    <img
                        src={ComingSoonLogo}
                        alt="Coming Soon"
                        className="mb-6  w-[180px] max-w-full md:w-[240px] lg:w-[280px]"
                    />
                </div>
                <h1 className="text-2xl font-semibold text-core-textDark dark:text-core-textLight md:text-3xl">
                    {t(titleKey)}
                </h1>
                <p className="mt-4 text-sm leading-7 text-core-textMuted dark:text-core-textMutedDark md:text-base">
                    {t("comingSoon.description")}
                </p>
            </section>
        </div>
    );
}

