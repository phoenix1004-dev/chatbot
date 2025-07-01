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
