import type {
  Agent,
  Message,
  AgentInfoResponse,
  ChatRequest,
  ChatResponse,
  EmailRequest,
  EmailResponse,
  Feedback,
  FeedbackResponse,
  HealthResponse,
} from "./api";

// Mock agents - set available to false to test unavailable state
export const mockAgents: Agent[] = [
  {
    id: "pension",
    name: "Pension Assistant",
    description: "Expert in pension planning and retirement savings",
    available: true,
  },
  {
    id: "investment",
    name: "Investment Advisor",
    description: "Helps with investment strategies and portfolio management",
    available: false, // Example: this agent is unavailable
  },
  {
    id: "tax",
    name: "Tax Advisor",
    description: "Helps with tax planning and optimization",
    available: true,
  },
];

// Mock health - set available to false to test maintenance page
const mockHealth: HealthResponse = {
  status: "ok",
  name: "Mock API",
  version: "1.0.0",
  available: true, // Set to false to show maintenance page
};

// Mock responses
const mockResponses: Record<string, Message> = {
  default: {
    content:
      "I can help you with your pension questions. What would you like to know?",
    sender: "assistant",
  },
  pension: {
    content:
      "The Belgian pension system has three pillars: the statutory pension, supplementary pensions, and individual pension savings.",
    long_content: `The Belgian pension system has three pillars:

**First Pillar - Statutory Pension**
This is the basic pension provided by the government. It's calculated based on your career and earnings. The full statutory pension requires 45 years of work.

**Second Pillar - Supplementary Pensions**
These are employer-sponsored pension plans, including:
- Group insurance
- Pension funds
- Individual Pension Commitment (IPT)

**Third Pillar - Individual Pension Savings**
Personal savings plans with tax advantages:
- Pension savings (max €1,020 or €1,310 per year)
- Long-term savings (max €2,450 per year)

Each pillar has different tax implications and benefits. Would you like me to explain any of these in more detail?`,
    resources: [
      {
        title: "Sample PDF Document",
        link: "https://www.africau.edu/images/default/sample.pdf",
        page_number: 1,
      },
      {
        title: "PDF.js Example",
        link: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        page_number: 3,
      },
      {
        title: "React Documentation",
        link: "https://raw.githubusercontent.com/facebook/react/main/README.md",
      },
    ],
    sender: "assistant",
  },
  retirement: {
    content:
      "The legal retirement age in Belgium is currently 65, but will increase to 66 in 2025 and 67 in 2030.",
    long_content: `The legal retirement age in Belgium is currently 65, but will increase to 66 in 2025 and 67 in 2030.

**Early Retirement Options**

You may be able to retire early if you meet certain conditions:
- At 63 with a 42-year career
- At 61 with a 43-year career
- At 60 with a 44-year career

**Pension Calculation**

Your pension is calculated using the formula:
- Total career earnings × 60% (single) or 75% (family rate)
- Divided by 45 (full career years)

**Important Considerations**

1. Each year worked contributes to your pension
2. Part-time work is calculated proportionally
3. Certain periods count as "assimilated" (unemployment, illness, etc.)
4. You can combine pension with limited work income

Would you like to know more about any specific aspect?`,
    resources: [
      {
        title: "W3C PDF Techniques",
        link: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
        page_number: 1,
      },
      {
        title: "TypeScript Handbook",
        link: "https://raw.githubusercontent.com/microsoft/TypeScript/main/README.md",
      },
    ],
    sender: "assistant",
  },
  savings: {
    content:
      "Pension savings in Belgium offer significant tax advantages. You can save up to €1,020 (30% tax reduction) or €1,310 (25% tax reduction) per year.",
    long_content: `Pension savings in Belgium offer significant tax advantages.

**Two Saving Limits**

1. **Standard limit: €1,020/year**
   - 30% tax reduction
   - Maximum tax benefit: €306

2. **Higher limit: €1,310/year**
   - 25% tax reduction
   - Maximum tax benefit: €327.50

**Types of Pension Savings**

- **Pension savings fund**: Investment fund with varying risk profiles
- **Pension savings insurance**: More stable returns with guaranteed interest

**Tax on Withdrawal**

- At 60: 8% final tax (anticipated tax at age 60)
- After 60: No additional tax
- Before 60: 33% tax + municipal surcharge (penalty)

**Tips for Maximizing Benefits**

1. Start early to benefit from compound interest
2. Choose the limit that matches your situation
3. Consider your risk tolerance when selecting products
4. Review your strategy annually`,
    resources: [
      {
        title: "Mozilla PDF Sample",
        link: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
        page_number: 5,
      },
      {
        title: "Vite Documentation",
        link: "https://raw.githubusercontent.com/vitejs/vite/main/README.md",
      },
      {
        title: "Node.js Guide",
        link: "https://raw.githubusercontent.com/nodejs/node/main/README.md",
      },
    ],
    sender: "assistant",
  },
};

function getMockResponse(userMessage: string): Message {
  const lowerMessage = userMessage.toLowerCase();

  if (
    lowerMessage.includes("pillar") ||
    lowerMessage.includes("system") ||
    lowerMessage.includes("how does")
  ) {
    return mockResponses.pension;
  }
  if (
    lowerMessage.includes("retire") ||
    lowerMessage.includes("age") ||
    lowerMessage.includes("when")
  ) {
    return mockResponses.retirement;
  }
  if (
    lowerMessage.includes("saving") ||
    lowerMessage.includes("tax") ||
    lowerMessage.includes("benefit")
  ) {
    return mockResponses.savings;
  }

  return mockResponses.default;
}

// Mock API client
export const mockApi = {
  async getHealth(): Promise<HealthResponse> {
    return mockHealth;
  },

  async sendChatMessage(chatRequest: ChatRequest): Promise<ChatResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const userMessage = chatRequest.user_input.content;
    const mockResponse = getMockResponse(userMessage);

    return {
      success: true,
      history: [...chatRequest.history, mockResponse],
    };
  },

  async getAgentInfo(): Promise<AgentInfoResponse> {
    return { agents: mockAgents };
  },

  async sendEmail(emailRequest: EmailRequest): Promise<EmailResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      message: "Email sent successfully (mock)",
      session_id: emailRequest.session_id,
      email: emailRequest.email,
      language: emailRequest.language,
      agent: emailRequest.agent,
    };
  },

  async provideFeedback(feedback: Feedback): Promise<FeedbackResponse> {
    return {
      session_id: feedback.session_id,
      feedback: feedback.feedback,
      message: feedback.message,
    };
  },
};
