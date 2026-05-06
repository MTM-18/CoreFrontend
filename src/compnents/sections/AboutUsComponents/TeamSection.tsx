import { useTranslation } from "react-i18next";

import abdulrahmanImg from "../../../assets/team/abdulrahman.jpg";
import mertImg from "../../../assets/team/Fahd.png";
import albaraaImg from "../../../assets/team/albaraa.jpg";
import dumanImg from "../../../assets/team/modhar.png";
import hussainImg from "../../../assets/team/Hussain.png";
import laraImg from "../../../assets/team/lara.jpg";
import habibaImg from "../../../assets/team/habiba.jpg";
import ahmedImg from "../../../assets/team/Ahmed.png";
import karamImg from "../../../assets/team/karam.jpg";
import osamaImg from "../../../assets/team/Usama.png";
import ayaImg from "../../../assets/team/Aya.png";
import ammarImg from "../../../assets/team/Ammar.png";
import nazireImg from "../../../assets/team/nazire.jpg";

type LocalizedText = {
    en: string;
    ar: string;
};

type TeamMember = {
    id: string;
    image: string;
    name: LocalizedText;
    role: LocalizedText;
};

const TEAM: TeamMember[] = [
    {
        id: "abdulrahman-al-esawy",
        image: abdulrahmanImg,
        name: { en: "Abdulrahman Al-esawy", ar: "عبد الرحمن العيساوي" },
        role: { en: "Executive Director", ar: "المدير التنفيذي" },
    },
    {
        id: "mert-galyon",
        image: mertImg,
        name: { en: "Mert Galyon", ar: "مضر غليون" },
        role: { en: "Investment Associate", ar: "مدير الاستثمار" },
    },
    {
        id: "albaraa-al-sudani",
        image: albaraaImg,
        name: { en: "Albaraa Al-sudani", ar: "البراء السوداني" },
        role: { en: "Head of Marketing", ar: "مدير التسويق" },
    },
    {
        id: "abdurrahman-duman",
        image: dumanImg,
        name: { en: "Abdurrahman Duman", ar: "عبدالرحمن دومان" },
        role: { en: "Office Manager", ar: "مدير المكتب" },
    },
    {
        id: "hussain-abdullatif",
        image: hussainImg,
        name: { en: "Hussain Abdullatif", ar: "حسين عبد اللطيف" },
        role: { en: "Program Manager", ar: "مدير البرامج" },
    },
    {
        id: "lara-saad",
        image: laraImg,
        name: { en: "Lara Saad", ar: "لارا سعد" },
        role: { en: "Partnership and Grants Lead", ar: "مسؤولة الشراكات والمنح" },
    },
    {
        id: "habiba-hisham",
        image: habibaImg,
        name: { en: "Habiba Hisham", ar: "حبيبة هشام" },
        role: { en: "Graphic Designer", ar: "مصممة جرافيك" },
    },
    {
        id: "ahmed-essam",
        image: ahmedImg,
        name: { en: "Ahmed Essam", ar: "أحمد عصام" },
        role: { en: "Video Editor", ar: "مونتير" },
    },
    {
        id: "karam-almoula",
        image: karamImg,
        name: { en: "Karam Almoula", ar: "كرم المولى" },
        role: { en: "Photographer", ar: "مصور" },
    },
    {
        id: "osama-alqadi",
        image: osamaImg,
        name: { en: "Osama Alqadi", ar: "أسامة القاضي" },
        role: { en: "Program Coordinator", ar: "منسق برامج" },
    },
    {
        id: "aya-rafid",
        image: ayaImg,
        name: { en: "Aya Rafid", ar: "آية رافد" },
        role: { en: "Program Coordinator", ar: "منسقة برامج" },
    },
    {
        id: "ammar-yahya",
        image: ammarImg,
        name: { en: "Ammar Yahya", ar: "عمار يحيى" },
        role: { en: "Receptionist", ar: "الاستقبال" },
    },
    {
        id: "nazire",
        image: nazireImg,
        name: { en: "Nazire", ar: "نظيرة" },
        role: { en: "Service Employee", ar: "موظفة خدمات" },
    },
];

export default function TeamSection() {
    const { t, i18n } = useTranslation();
    const lang: "ar" | "en" = i18n.language?.startsWith("ar") ? "ar" : "en";

    return (
        <section className="py-8 md:py-16" dir={lang === "ar" ? "rtl" : "ltr"}>
            <div className="layout-shell mx-auto space-y-5 md:space-y-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-semibold text-core-textAccent">
                            {t("aboutPage.team.title")}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm md:text-base text-white/72">
                            {t("aboutPage.team.subtitle")}
                        </p>
                    </div>
                    <div className="hidden h-px flex-1 bg-gradient-to-r from-core-accent/70 via-white/15 to-transparent md:block" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {TEAM.map((member) => (
                        <article
                            key={member.id}
                            className="group overflow-hidden rounded-[8px] border border-white/10 bg-white/[0.04] shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-core-accent/50 hover:bg-white/[0.07]"
                        >
                            <div className="relative aspect-[1/1.08] overflow-hidden bg-black/30 sm:aspect-[4/5]">
                                <img
                                    src={member.image}
                                    alt={member.name[lang]}
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            </div>

                            <div className="p-3 sm:p-4">
                                <h3 className="text-[13px] font-semibold leading-tight text-white sm:text-base">
                                    {member.name[lang]}
                                </h3>
                                <p className="mt-1 text-[11px] leading-4 text-core-textAccent sm:text-sm sm:leading-6">
                                    {member.role[lang]}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
