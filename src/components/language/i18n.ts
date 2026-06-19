import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import ar from "./ar.json";



const getInitialLanguage = (): "en" | "ar" => {
    // If we're not in the browser (SSR / build), just fall back to 'en'
    if (typeof window === "undefined") return "en";

    const saved = localStorage.getItem("lang") as "en" | "ar" | null;
    if (saved === "en" || saved === "ar") return saved;

    const navLang = window.navigator.language.toLowerCase();
    return navLang.startsWith("ar") ? "ar" : "en";
};

const initialLanguage = getInitialLanguage();

const resources = {
    en: { translation: en },
    ar: { translation: ar },
};

i18n.use(initReactI18next).init({
    resources,
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});


// handle direction (LTR / RTL)
const applyDir = (lng: string) => {
    if (typeof document === "undefined") return;
    const dir = lng === "ar" ? "rtl" : "ltr";
    document.documentElement.dir = dir;
    document.documentElement.lang = lng;
};

applyDir(initialLanguage);

i18n.on("languageChanged", (lng) => {
    applyDir(lng);
    if (typeof window !== "undefined") {
        localStorage.setItem("lang", lng);
    }
});

export default i18n;