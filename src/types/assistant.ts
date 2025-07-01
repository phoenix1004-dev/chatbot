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

export interface CreateChatRequest {
  assistant_id: string;
  first_message: string;
}

export interface UpdateChatRequest {
  title?: string;
}
