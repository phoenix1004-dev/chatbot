"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AssistantForm } from "@/components/assistants/AssistantForm";
import { Assistant, UpdateAssistantRequest } from "@/types/assistant";

interface EditAssistantPageProps {
  params: Promise<{ id: string }>;
}

export default function EditAssistantPage({ params }: EditAssistantPageProps) {
  const router = useRouter();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assistantId, setAssistantId] = useState<string>("");

  useEffect(() => {
    const initializeAndFetch = async () => {
      const { id } = await params;
      setAssistantId(id);
      fetchAssistant(id);
    };
    initializeAndFetch();
  }, [params]);

  const fetchAssistant = async (id: string) => {
    try {
      const response = await fetch(`/api/assistants/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Assistant not found");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch assistant");
        }
        return;
      }

      const assistantData = await response.json();
      setAssistant(assistantData);
    } catch (error) {
      console.error("Error fetching assistant:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UpdateAssistantRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/assistants/${assistantId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update assistant");
      }

      const updatedAssistant = await response.json();

      // Redirect to the assistant's detail page
      router.push(`/assistants/${updatedAssistant.id}`);
    } catch (error) {
      console.error("Error updating assistant:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
              <div className="h-10 bg-gray-700 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
              <div className="h-32 bg-gray-700 rounded"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
              <div className="h-24 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <div className="bg-red-900 border border-red-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-200 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={() => router.push("/assistants")}
            className="mt-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Assistants
          </button>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return null;
  }

  return (
    <div>
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200">{error}</p>
        </div>
      )}
      <AssistantForm
        assistant={assistant}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
