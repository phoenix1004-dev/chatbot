"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiArrowLeft, HiCheck, HiXMark } from "react-icons/hi2";
import { Assistant, CreateAssistantRequest, UpdateAssistantRequest } from "@/types/assistant";

interface AssistantFormProps {
  assistant?: Assistant;
  onSubmit: (data: CreateAssistantRequest | UpdateAssistantRequest) => Promise<void>;
  isLoading?: boolean;
}

export function AssistantForm({ assistant, onSubmit, isLoading = false }: AssistantFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: assistant?.name || "",
    instructions: assistant?.instructions || "",
    persona: assistant?.persona || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.instructions.trim()) {
      newErrors.instructions = "Instructions are required";
    } else if (formData.instructions.trim().length < 10) {
      newErrors.instructions = "Instructions must be at least 10 characters";
    }

    if (!formData.persona.trim()) {
      newErrors.persona = "Persona is required";
    } else if (formData.persona.trim().length < 10) {
      newErrors.persona = "Persona must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        name: formData.name.trim(),
        instructions: formData.instructions.trim(),
        persona: formData.persona.trim(),
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="p-6 text-white">
      {/* Navigation Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          <HiArrowLeft size={20} />
          <span>Back to Assistants</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {assistant ? "Edit Assistant" : "Create New Assistant"}
        </h1>
        <p className="text-gray-400">
          {assistant 
            ? "Update your assistant's configuration"
            : "Define a new AI assistant with custom instructions and persona"
          }
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
            Assistant Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="e.g., Code Review Assistant"
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 ${
              errors.name ? "border-red-500" : "border-gray-600"
            }`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        {/* Instructions Field */}
        <div>
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-200 mb-2">
            Instructions *
          </label>
          <textarea
            id="instructions"
            value={formData.instructions}
            onChange={(e) => handleInputChange("instructions", e.target.value)}
            placeholder="Provide detailed instructions for what this assistant should do..."
            rows={6}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-vertical ${
              errors.instructions ? "border-red-500" : "border-gray-600"
            }`}
            disabled={isLoading}
          />
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-400">{errors.instructions}</p>
          )}
        </div>

        {/* Persona Field */}
        <div>
          <label htmlFor="persona" className="block text-sm font-medium text-gray-200 mb-2">
            Persona *
          </label>
          <textarea
            id="persona"
            value={formData.persona}
            onChange={(e) => handleInputChange("persona", e.target.value)}
            placeholder="Describe the personality and communication style of this assistant..."
            rows={4}
            className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 resize-vertical ${
              errors.persona ? "border-red-500" : "border-gray-600"
            }`}
            disabled={isLoading}
          />
          {errors.persona && (
            <p className="mt-1 text-sm text-red-400">{errors.persona}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiCheck size={20} />
            <span>{isLoading ? "Saving..." : (assistant ? "Update Assistant" : "Create Assistant")}</span>
          </button>
          
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <HiXMark size={20} />
            <span>Cancel</span>
          </button>
        </div>
      </form>
    </div>
  );
}
