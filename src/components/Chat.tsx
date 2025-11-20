import { useState, useRef, useEffect } from "react";
import { User, CopyIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useStatelessChat } from "@/hooks/useStatelessChat";
import { agents, type Agent } from "@/lib/agents";
import { Sidebar } from "./Sidebar";
import { Feedback } from "./Feedback";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputSubmit,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

export function Chat() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const { messages, status, sendMessage } = useStatelessChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    if (!hasText) return;

    sendMessage({ text: message.text || "", agent: selectedAgent });
  };

  const handleFeedback = (
    messageId: string,
    type: "thumbs-up" | "thumbs-down" | "message",
    comment?: string
  ) => {
    console.log("Feedback:", { messageId, type, comment });
    // In a real app, send this to your backend
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
    if (window.confirm("Are you sure you want to clear the conversation?")) {
      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onClearConversation={handleClearConversation}
        onDownloadConversation={handleDownloadConversation}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Conversation - Scrollable area */}
        <div className="flex-1 overflow-hidden">
          <Conversation className="h-full">
            <ConversationContent className="mx-auto w-full max-w-3xl pb-4">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 px-4 text-center">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback
                      className={cn("text-3xl", selectedAgent.color)}
                    >
                      {selectedAgent.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                      {selectedAgent.name}
                    </h1>
                    <p className="text-muted-foreground max-w-md">
                      {selectedAgent.description}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => {
                    // Get text content from message parts
                    const textContent = message.parts
                      .filter((part) => part.type === "text")
                      .map((part) => part.text)
                      .join("");

                    // Get agent for this message
                    const messageAgent = message.agentId
                      ? agents.find((a) => a.id === message.agentId) ||
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
                            <div className="flex items-center gap-2">
                              <Feedback
                                messageId={message.id}
                                onFeedback={handleFeedback}
                              />
                              <MessageActions>
                                <MessageAction
                                  onClick={() =>
                                    navigator.clipboard.writeText(textContent)
                                  }
                                  label="Copy"
                                >
                                  <CopyIcon className="size-3" />
                                </MessageAction>
                              </MessageActions>
                            </div>
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
                </>
              )}
            </ConversationContent>
          </Conversation>
        </div>

        {/* Input Island - Fixed at bottom */}
        <div className="flex-shrink-0 bg-background p-4">
          <div className="mx-auto w-full max-w-3xl space-y-2">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  placeholder={`Message ${selectedAgent.name}...`}
                />
                <PromptInputSubmit status={status} />
              </PromptInputBody>
            </PromptInput>
            <p className="text-center text-xs text-muted-foreground">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
