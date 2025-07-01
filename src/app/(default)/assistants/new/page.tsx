"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AssistantForm } from "@/components/assistants/AssistantForm";
import {
  CreateAssistantRequest,
  UpdateAssistantRequest,
} from "@/types/assistant";

export default function NewAssistantPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    data: CreateAssistantRequest | UpdateAssistantRequest
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/assistants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create assistant");
      }

      const assistant = await response.json();

      // Redirect to the new assistant's detail page
      router.push(`/assistants/${assistant.id}`);
    } catch (error) {
      console.error("Error creating assistant:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}
      <AssistantForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
