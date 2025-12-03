import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { User, Trash2, Download, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/useChat";
import { useLanguage, type Language } from "@/hooks/useLanguage";
import { agents, type Agent, initializeAgents } from "@/lib/agents";
import { Sidebar } from "./Sidebar";
import { Feedback } from "./Feedback";
import { EmailDialog } from "./EmailDialog";
import { LanguageSelector } from "./LanguageSelector";
import apiClient, { type Message as ApiMessage, type EmailRequest } from "@/api";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

interface ChatProps {
  initialAgent?: Agent | null;
  onBackToHome?: () => void;
}

export function Chat({ initialAgent, onBackToHome }: ChatProps) {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(initialAgent || null);
  const [agentsList, setAgentsList] = useState<Agent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(!initialAgent);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const { messages, status, sessionId, sendMessage, clearMessages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize agents on mount (only if no initial agent provided)
  useEffect(() => {
    async function loadAgents() {
      setIsLoadingAgents(true);
      await initializeAgents();
      setAgentsList([...agents]);
      if (agents.length > 0 && !selectedAgent) {
        setSelectedAgent(agents[0]);
      }
      setIsLoadingAgents(false);
    }

    if (!initialAgent) {
      loadAgents();
    } else {
      // Still load agents list for sidebar
      initializeAgents().then(() => {
        setAgentsList([...agents]);
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText || !selectedAgent) return;

    sendMessage({ text: message.text || "", agent: selectedAgent });
  };

  const handleDownloadConversation = () => {
    const conversationText = messages
      .map((message) => {
        const textContent = message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("");
        const role = message.role === "user" ? "You" : "Assistant";
        return `${role}: ${textContent}`;
      })
      .join("\n\n");

    const blob = new Blob([conversationText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `conversation-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearConversation = () => {
    if (window.confirm(t('chat.clearConversation'))) {
      clearMessages();
    }
  };

  const handleSendByEmail = async (email: string) => {
    if (!selectedAgent) return;

    setIsSendingEmail(true);
    try {
      // Convert messages to API format
      const history: ApiMessage[] = messages.map((msg) => ({
        content: msg.parts.map(p => p.text).join(''),
        sender: msg.role,
      }));

      const emailRequest: EmailRequest = {
        history,
        session_id: sessionId,
        email,
        language,
        agent: selectedAgent.id,
      };

      await apiClient.sendEmail(emailRequest);
      setEmailDialogOpen(false);
      alert(t('email.success'));
    } catch (error) {
      console.error('Failed to send email:', error);
      alert(t('email.error'));
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleFeedback = (messageId: string, type: 'thumbs-up' | 'thumbs-down') => {
    console.log('Feedback:', { messageId, type });
  };

  if (isLoadingAgents) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">{t('chat.loadingAgents')}</div>
        </div>
      </div>
    );
  }

  if (!selectedAgent) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-destructive">{t('chat.noAgents')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onBackToHome={onBackToHome}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Bar - Only shown when there are messages */}
        {messages.length > 0 && (
          <div className="flex-shrink-0 border-b bg-background px-6 py-4">
            <div className="mx-auto w-full max-w-3xl flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="font-semibold text-lg">{t('chat.title')}</h2>
                <p className="text-muted-foreground text-sm">
                  {new Date().toLocaleDateString(language, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <LanguageSelector value={language} onChange={(val) => changeLanguage(val as Language)} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-[var(--belfius-hover)] hover:text-primary-foreground"
                  onClick={handleClearConversation}
                  title={t('buttons.clear')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-[var(--belfius-hover)] hover:text-primary-foreground"
                  onClick={handleDownloadConversation}
                  title={t('buttons.download')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-[var(--belfius-hover)] hover:text-primary-foreground"
                  onClick={() => setEmailDialogOpen(true)}
                  title={t('buttons.email')}
                >
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Conversation - Scrollable area */}
        <div className="flex-1 overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('chat.emptyTitle')}
              </h1>
              <p className="text-muted-foreground max-w-md">
                {t('chat.emptyDescription')}
              </p>
            </div>
          ) : (
            <Conversation className="h-full">
              <ConversationContent className="mx-auto w-full max-w-3xl pb-4">
                {messages.map((message) => {
                  // Get text content from message parts
                  const textContent = message.parts
                    .filter((part) => part.type === "text")
                    .map((part) => part.text)
                    .join("");

                  // Get agent for this message
                  const messageAgent = message.agentId
                    ? agentsList.find((a) => a.id === message.agentId) ||
                      selectedAgent
                    : selectedAgent;

                  return (
                    <div key={message.id} className="flex w-full gap-4">
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback
                            className={cn(
                              "flex items-center justify-center",
                              messageAgent.color
                            )}
                          >
                            <span className="text-lg">
                              {messageAgent.avatar}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div className="flex-1 flex flex-col gap-2">
                        <Message from={message.role}>
                          <MessageContent>
                            {message.role === "assistant" ? (
                              <MessageResponse>{textContent}</MessageResponse>
                            ) : (
                              <p className="whitespace-pre-wrap text-sm">
                                {textContent}
                              </p>
                            )}
                          </MessageContent>
                        </Message>

                        {message.role === "assistant" && (
                          <Feedback
                            messageId={message.id}
                            messageText={textContent}
                            sessionId={sessionId}
                            onFeedback={handleFeedback}
                          />
                        )}
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarFallback className="flex items-center justify-center bg-primary text-primary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </ConversationContent>
            </Conversation>
          )}
        </div>

        {/* Input Island - Fixed at bottom */}
        <div className="flex-shrink-0 bg-background p-4">
          <div className="mx-auto w-full max-w-3xl space-y-2">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder={t('chat.messagePlaceholder')}
                />
                <PromptInputSubmit status={status} />
              </PromptInputBody>
            </PromptInput>
            <p className="text-center text-xs text-muted-foreground">
              {t('chat.pressEnterHint')}
            </p>
          </div>
        </div>
      </div>

      {/* Email Dialog */}
      <EmailDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onSend={handleSendByEmail}
        isLoading={isSendingEmail}
      />
    </div>
  );
}
