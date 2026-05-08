import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hi from "./locales/hi.json";
import kn from "./locales/kn.json";
import ur from "./locales/ur.json";

const RTL_LANGUAGES = ["ur", "ar"];

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "language",
      caches: ["localStorage"],
    },
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      kn: { translation: kn },
      ur: { translation: ur },
    },
  });

// Handle RTL and lang attribute on language change
i18next.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = RTL_LANGUAGES.includes(lng) ? "rtl" : "ltr";
});

export default i18next;
