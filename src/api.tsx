export interface Ressource {
  title: string;
  link: string;
  page_number?: number;
}
export interface Message {
  content: string;
  long_content?: string;
  resources?: Ressource[];
  sender: string;
}
export interface ChatRequest {
  history: Message[];
  user_input: Message;
  session_id: string;
  agent: string;
  language: string;
}
export interface ChatResponse {
  success: boolean;
  history: Message[];
}
export interface EmailRequest {
  history: Message[];
  session_id: string;
  email: string;
  language: string;
  agent: string;
}
export interface EmailResponse {
  message: string;
  session_id: string;
  email: string;
  language: string;
  agent: string;
}
export interface Feedback {
  session_id: string;
  feedback: string;
  message: string;
}
export interface FeedbackResponse {
  session_id: string;
  feedback: string;
  message: string;
}
export interface HealthResponse {
  status: string;
  name: string;
  version: string;
  available: boolean;
}
export interface AgentInfoResponse {
  agents: Agent[];
}
export interface Agent {
  id: string;
  name: string;
  description: string;
  available: boolean;
}
// Base URL of your FastAPI backend
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8882/api";

// Set to true to use mock API responses
const USE_MOCK = true;

// Import mock API
import { mockApi } from "./api-mock";

// API client class
class ApiClient {
  async getHealth(): Promise<HealthResponse> {
    if (USE_MOCK) return mockApi.getHealth();
    const response = await fetch(`${BASE_URL}/health`);
    return await this.handleResponse<HealthResponse>(response);
  }

  async sendChatMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    if (USE_MOCK) return mockApi.sendChatMessage(chatRequest);

    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chatRequest),
    });
    return await this.handleResponse<ChatResponse>(response);
  }

  async getAgentInfo(): Promise<AgentInfoResponse> {
    if (USE_MOCK) return mockApi.getAgentInfo();

    const response = await fetch(`${BASE_URL}/agent/info`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await this.handleResponse<AgentInfoResponse>(response);
  }

  async sendEmail(emailRequest: EmailRequest): Promise<EmailResponse> {
    if (USE_MOCK) return mockApi.sendEmail(emailRequest);

    const response = await fetch(`${BASE_URL}/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailRequest),
    });
    return await this.handleResponse<EmailResponse>(response);
  }

  async provideFeedback(feedback: Feedback): Promise<FeedbackResponse> {
    if (USE_MOCK) return mockApi.provideFeedback(feedback);

    const response = await fetch(`${BASE_URL}/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedback),
    });
    return await this.handleResponse<FeedbackResponse>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      // Handle validation errors or other errors
      const errorResponse = await response.json();
      throw new Error(`Error: ${JSON.stringify(errorResponse)}`);
    }
    return await response.json();
  }
}

// Export the API client instance
const apiClient = new ApiClient();
export default apiClient;
