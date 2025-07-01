"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HiCpuChip,
  HiMagnifyingGlass,
  HiArrowLeft,
  HiPlus,
} from "react-icons/hi2";
import { AssistantCard } from "@/components/assistants/AssistantCard";
import { Assistant } from "@/types/assistant";

export default function AssistantsPage() {
  const router = useRouter();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      const response = await fetch("/api/assistants");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch assistants");
      }

      const assistantsData = await response.json();
      setAssistants(assistantsData);
    } catch (error) {
      console.error("Error fetching assistants:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAssistant = async (id: string) => {
    setIsDeleting(id);

    try {
      const response = await fetch(`/api/assistants/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete assistant");
      }

      // Remove the assistant from the local state
      setAssistants((prev) => prev.filter((assistant) => assistant.id !== id));
    } catch (error) {
      console.error("Error deleting assistant:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete assistant"
      );
    } finally {
      setIsDeleting(null);
    }
  };

  // Filter assistants based on search term
  const filteredAssistants = assistants.filter((assistant) => {
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      assistant.name.toLowerCase().includes(term) ||
      assistant.instructions.toLowerCase().includes(term) ||
      assistant.persona.toLowerCase().includes(term)
    );
  });

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 border border-gray-600 rounded-lg p-6"
              >
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      {/* Navigation Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
          <span>Back to Chat</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-900 border border-red-600 rounded-lg">
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchAssistants();
            }}
            className="mt-2 px-3 py-1 bg-red-700 text-red-200 rounded text-sm hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Custom AI Assistants</h1>
          <p className="text-gray-400">
            Create and manage your personalized AI assistants with custom
            instructions and personas.
          </p>
        </div>
        <button
          onClick={() => router.push("/assistants/new")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <HiPlus size={20} />
          <span>Create Assistant</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search assistants by name, instructions, or persona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing {filteredAssistants.length} of {assistants.length} assistants
        </p>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            onDelete={handleDeleteAssistant}
            isDeleting={isDeleting === assistant.id}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredAssistants.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <HiCpuChip size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            {assistants.length === 0
              ? "No assistants created yet"
              : "No assistants found"}
          </h3>
          <p className="text-gray-500 mb-4">
            {assistants.length === 0
              ? "Create your first custom AI assistant to get started."
              : "Try adjusting your search terms."}
          </p>
          {assistants.length === 0 && (
            <button
              onClick={() => router.push("/assistants/new")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Create Your First Assistant
            </button>
          )}
        </div>
      )}
    </div>
  );
}
