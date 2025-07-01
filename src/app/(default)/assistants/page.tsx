"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  HiCpuChip,
  HiCheck,
  HiMagnifyingGlass,
  HiArrowLeft,
} from "react-icons/hi2";

interface AssistantType {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
}

const assistantTypes: AssistantType[] = [
  {
    id: "general",
    name: "General Assistant",
    description: "All-purpose AI assistant for various tasks",
    category: "General",
    features: [
      "Question answering",
      "General conversation",
      "Task assistance",
      "Information lookup",
    ],
  },
  {
    id: "code",
    name: "Code Assistant",
    description: "Specialized for programming and development",
    category: "Development",
    features: ["Code generation", "Debugging", "Code review", "Documentation"],
  },
  {
    id: "creative",
    name: "Creative Assistant",
    description: "Focused on creative writing and content",
    category: "Creative",
    features: [
      "Creative writing",
      "Content creation",
      "Storytelling",
      "Brainstorming",
    ],
  },
  {
    id: "research",
    name: "Research Assistant",
    description: "Optimized for research and analysis",
    category: "Research",
    features: [
      "Data analysis",
      "Research synthesis",
      "Citation help",
      "Academic writing",
    ],
  },
  {
    id: "data",
    name: "Data Analyst",
    description: "Expert in data analysis and visualization",
    category: "Analytics",
    features: [
      "Data visualization",
      "Statistical analysis",
      "Report generation",
      "Trend analysis",
    ],
  },
  {
    id: "marketing",
    name: "Marketing Assistant",
    description: "Specialized in marketing strategies and campaigns",
    category: "Business",
    features: [
      "Campaign planning",
      "Content marketing",
      "SEO optimization",
      "Social media strategy",
    ],
  },
  {
    id: "legal",
    name: "Legal Assistant",
    description: "Knowledgeable in legal research and documentation",
    category: "Legal",
    features: [
      "Legal research",
      "Document drafting",
      "Case analysis",
      "Compliance guidance",
    ],
  },
  {
    id: "medical",
    name: "Medical Assistant",
    description: "Focused on medical information and healthcare",
    category: "Healthcare",
    features: [
      "Medical research",
      "Symptom analysis",
      "Drug information",
      "Health education",
    ],
  },
  {
    id: "education",
    name: "Education Assistant",
    description: "Designed for teaching and learning support",
    category: "Education",
    features: [
      "Lesson planning",
      "Student assessment",
      "Curriculum design",
      "Learning resources",
    ],
  },
  {
    id: "finance",
    name: "Finance Assistant",
    description: "Expert in financial analysis and planning",
    category: "Finance",
    features: [
      "Financial planning",
      "Investment analysis",
      "Budget management",
      "Risk assessment",
    ],
  },
];

const categories = [
  "All",
  ...Array.from(new Set(assistantTypes.map((a) => a.category))),
];

export default function AssistantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(
    null
  );

  // Filter assistants based on search term and category
  const filteredAssistants = useMemo(() => {
    let filtered = assistantTypes;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (assistant) => assistant.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (assistant) =>
          assistant.name.toLowerCase().includes(term) ||
          assistant.description.toLowerCase().includes(term) ||
          assistant.features.some((feature) =>
            feature.toLowerCase().includes(term)
          )
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  const handleSelectAssistant = (assistantId: string) => {
    setSelectedAssistant(assistantId);
    // TODO: Implement assistant selection logic
    console.log("Selected assistant:", assistantId);
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
          <span>Back to Chat</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">AI Assistants</h1>
        <p className="text-gray-400">
          Choose from our collection of specialized AI assistants to help with
          your specific needs.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <HiMagnifyingGlass
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search assistants by name, description, or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing {filteredAssistants.length} of {assistantTypes.length}{" "}
          assistants
        </p>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssistants.map((assistant) => (
          <div
            key={assistant.id}
            className={`bg-gray-800 border rounded-lg p-6 cursor-pointer transition-all hover:bg-gray-700 ${
              selectedAssistant === assistant.id
                ? "border-blue-500 bg-gray-700"
                : "border-gray-600"
            }`}
            onClick={() => handleSelectAssistant(assistant.id)}
          >
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
                  <span className="text-xs text-blue-400 bg-blue-900 px-2 py-1 rounded">
                    {assistant.category}
                  </span>
                </div>
              </div>
              {selectedAssistant === assistant.id && (
                <HiCheck size={20} className="text-green-400" />
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm mb-4">
              {assistant.description}
            </p>

            {/* Features */}
            <div>
              <h4 className="text-sm font-medium text-gray-200 mb-2">
                Key Features:
              </h4>
              <ul className="space-y-1">
                {assistant.features.slice(0, 3).map((feature, index) => (
                  <li
                    key={index}
                    className="text-xs text-gray-400 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    {feature}
                  </li>
                ))}
                {assistant.features.length > 3 && (
                  <li className="text-xs text-gray-500">
                    +{assistant.features.length - 3} more features
                  </li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredAssistants.length === 0 && (
        <div className="text-center py-12">
          <HiCpuChip size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-400 mb-2">
            No assistants found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}
    </div>
  );
}
