import { useLanguageStore } from "@/store/language";
import { dictionaries } from "@/lib/i18n/dictionaries";

export function useTranslation() {
  const { language, setLanguage } = useLanguageStore();
  
  const t = (path: string) => {
    const keys = path.split(".");
    let result: any = dictionaries[language];
    
    for (const key of keys) {
      if (result[key] === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
      result = result[key];
    }
    
    return result;
  };

  return { t, language, setLanguage };
}
