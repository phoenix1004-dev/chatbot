"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiCpuChip, HiPencil, HiTrash, HiEye } from "react-icons/hi2";
import { Assistant } from "@/types/assistant";

interface AssistantCardProps {
  assistant: Assistant;
  onDelete: (id: string) => Promise<void>;
  isDeleting?: boolean;
}

export function AssistantCard({ assistant, onDelete, isDeleting = false }: AssistantCardProps) {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleView = () => {
    router.push(`/assistants/${assistant.id}`);
  };

  const handleEdit = () => {
    router.push(`/assistants/${assistant.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await onDelete(assistant.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting assistant:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 hover:bg-gray-750 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <HiCpuChip size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {assistant.name}
            </h3>
            <span className="text-xs text-gray-400">
              Created {formatDate(assistant.created_at)}
            </span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleView}
            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="View Details"
          >
            <HiEye size={18} />
          </button>
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit Assistant"
          >
            <HiPencil size={18} />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Assistant"
          >
            <HiTrash size={18} />
          </button>
        </div>
      </div>

      {/* Instructions Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-200 mb-2">Instructions:</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {truncateText(assistant.instructions, 150)}
        </p>
      </div>

      {/* Persona Preview */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-200 mb-2">Persona:</h4>
        <p className="text-gray-300 text-sm leading-relaxed">
          {truncateText(assistant.persona, 100)}
        </p>
      </div>

      {/* Updated Date */}
      {assistant.updated_at !== assistant.created_at && (
        <div className="text-xs text-gray-500">
          Updated {formatDate(assistant.updated_at)}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Delete Assistant
            </h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete "{assistant.name}"? This action cannot be undone.
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
