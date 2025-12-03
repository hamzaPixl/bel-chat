import { useTranslation } from "react-i18next";
import { Wrench } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage, type Language } from "@/hooks/useLanguage";

export function MaintenancePage() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Belfius" className="h-10 w-auto" />
            <span className="text-xl font-semibold text-foreground">
              {t("home.title")}
            </span>
          </div>
          <LanguageSelector value={language} onChange={(val) => changeLanguage(val as Language)} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 mb-6">
              <Wrench className="w-10 h-10 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              {t("maintenance.title")}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              {t("maintenance.description")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("maintenance.hint")}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-muted-foreground">
          {t("home.footer")}
        </div>
      </footer>
    </div>
  );
}
