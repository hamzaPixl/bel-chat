import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { agents, type Agent, initializeAgents } from "@/lib/agents";
import { LanguageSelector } from "./LanguageSelector";
import { useLanguage, type Language } from "@/hooks/useLanguage";

interface HomePageProps {
  onStartChat: (agent: Agent) => void;
}

export function HomePage({ onStartChat }: HomePageProps) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [defaultAgent, setDefaultAgent] = useState<Agent | null>(null);

  useEffect(() => {
    async function loadAgents() {
      setIsLoading(true);
      await initializeAgents();
      if (agents.length > 0) {
        setDefaultAgent(agents[0]);
      }
      setIsLoading(false);
    }
    loadAgents();
  }, []);

  const handleStartChat = () => {
    if (defaultAgent) {
      onStartChat(defaultAgent);
    }
  };

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

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <MessageCircle className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              {t("home.hero.title")}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("home.hero.description")}
            </p>

            {/* Start Button */}
            <Button
              size="lg"
              onClick={handleStartChat}
              disabled={!defaultAgent || isLoading}
              className="px-8 py-6 text-lg gap-2"
            >
              {t("home.startButton")}
              <ArrowRight className="w-5 h-5" />
            </Button>
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
