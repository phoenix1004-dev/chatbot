"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiPencil, HiTrash, HiCpuChip } from "react-icons/hi2";
import { Assistant } from "@/types/assistant";

interface AssistantDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AssistantDetailPage({
  params,
}: AssistantDetailPageProps) {
  const router = useRouter();
  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [assistantId, setAssistantId] = useState<string>("");

  useEffect(() => {
    const initializeAndFetch = async () => {
      const { id } = await params;
      setAssistantId(id);

      const fetchAssistant = async () => {
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

      fetchAssistant();
    };

    initializeAndFetch();
  }, [params]);

  const handleEdit = () => {
    router.push(`/assistants/${assistantId}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/assistants/${assistantId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete assistant");
      }

      // Redirect to assistants list
      router.push("/assistants");
    } catch (error) {
      console.error("Error deleting assistant:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete assistant"
      );
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <div className="mb-6">
          <button
            onClick={() => router.push("/assistants")}
            className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <HiArrowLeft size={20} />
            <span>Back to Assistants</span>
          </button>
        </div>
        <div className="bg-red-900 border border-red-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-200 mb-2">Error</h2>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return null;
  }

  return (
    <div className="p-6 text-white">
      {/* Navigation Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/assistants")}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
          <span>Back to Assistants</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <HiCpuChip size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{assistant.name}</h1>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Created: {formatDate(assistant.created_at)}</p>
              {assistant.updated_at !== assistant.created_at && (
                <p>Updated: {formatDate(assistant.updated_at)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <HiPencil size={18} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiTrash size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl space-y-8">
        {/* Instructions */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Instructions
          </h2>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {assistant.instructions}
          </div>
        </div>

        {/* Persona */}
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Persona</h2>
          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {assistant.persona}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Assistant
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{assistant.name}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
