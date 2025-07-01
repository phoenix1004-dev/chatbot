export interface Assistant {
  id: string;
  name: string;
  instructions: string;
  persona: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAssistantRequest {
  name: string;
  instructions: string;
  persona: string;
}

export interface UpdateAssistantRequest {
  name?: string;
  instructions?: string;
  persona?: string;
}

// Chat types
export interface Chat {
  id: string;
  assistant_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Extended Chat type with assistant details (used when fetching with joins)
export interface ChatWithAssistant extends Chat {
  assistants: {
    id: string;
    name: string;
    instructions: string;
    persona: string;
  };
}

export interface CreateChatRequest {
  assistant_id: string;
  first_message: string;
}

export interface UpdateChatRequest {
  title?: string;
}

// Message types
export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface CreateMessageRequest {
  content: string;
}

export interface SendMessageRequest {
  message: string;
}
