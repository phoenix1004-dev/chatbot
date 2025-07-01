"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { LoadingSpinner, LoadingSpinnerWithText } from "../ui/LoadingSpinner";
import {
  HiPlus,
  HiChevronDown,
  HiLockClosed,
  HiCheck,
  HiCpuChip,
} from "react-icons/hi2";
import { BsWindowSidebar } from "react-icons/bs";
import { useSidebar } from "../../contexts/SidebarContext";
import { Assistant } from "@/types/assistant";

interface DropdownItemProps {
  id: string;
  name: string;
  description: string;
}

// Assistant Type Dropdown Component with Search
interface AssistantTypeDropdownProps {
  selectedAssistant: Assistant | null;
  onAssistantChange: (assistant: Assistant) => void;
  assistants: Assistant[];
  isLoading: boolean;
  error: string | null;
}

const chatModels: DropdownItemProps[] = [
  {
    id: "chat-model",
    name: "Chat model",
    description: "Primary model for all-purpose chat",
  },
  {
    id: "reasoning-model",
    name: "Reasoning model",
    description: "Uses advanced reasoning",
  },
];

const chatTypeModels: DropdownItemProps[] = [
  {
    id: "private",
    name: "Private",
    description: "Only you can access this chat",
  },
  {
    id: "public",
    name: "Public",
    description: "Anyone with the link can access this chat",
  },
];

// Default assistant for fallback when no custom assistants are available
const defaultAssistant: Assistant = {
  id: "default",
  name: "General Assistant",
  instructions: "You are a helpful AI assistant.",
  persona: "Friendly and knowledgeable",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const AssistantTypeDropdown: React.FC<AssistantTypeDropdownProps> = ({
  selectedAssistant,
  onAssistantChange,
  assistants,
  isLoading,
  error,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Auto-focus search input when dropdown opens
  React.useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isDropdownOpen]);

  // Filter assistants based on search term
  const filteredAssistants = useMemo(() => {
    if (!searchTerm.trim()) return assistants;

    const term = searchTerm.toLowerCase();
    return assistants.filter(
      (assistant) =>
        assistant.name.toLowerCase().includes(term) ||
        assistant.instructions.toLowerCase().includes(term) ||
        assistant.persona.toLowerCase().includes(term)
    );
  }, [searchTerm, assistants]);

  return (
    <div
      onMouseEnter={() => setIsDropdownOpen(true)}
      onMouseLeave={() => setIsDropdownOpen(false)}
    >
      {isLoading ? (
        // Show only loading spinner when loading - no dropdown styling
        <div className="flex items-center gap-2 px-3 py-2">
          <LoadingSpinnerWithText
            text="Loading assistants..."
            size="sm"
            color="white"
            className="text-white"
          />
        </div>
      ) : (
        // Show dropdown when not loading
        <Dropdown
          align="right"
          showSearch={false}
          maxHeight="none"
          trigger={
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer"
            >
              <HiCpuChip size={16} />
              <span className="text-sm">
                {selectedAssistant?.name || "No Assistant"}
              </span>
              <HiChevronDown size={16} />
            </button>
          }
        >
          {/* Fixed header: View All button and Search input */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            {/* View All button or Loading spinner */}
            {isLoading ? (
              <div className="p-3 pb-2 flex justify-center">
                <LoadingSpinnerWithText
                  text="Loading assistants..."
                  size="sm"
                  color="gray"
                  className="justify-center"
                />
              </div>
            ) : (
              <div className="p-3 pb-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/assistants");
                  }}
                  className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors border border-gray-300 dark:border-gray-600 cursor-pointer"
                >
                  View All Assistants ({assistants.length})
                </button>
              </div>
            )}

            {/* Search input - only show when not loading */}
            {!isLoading && (
              <div className="px-3 pb-3">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search assistants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Scrollable assistant list section only */}
          {!isLoading && (
            <div className="overflow-y-auto max-h-80 dropdown-scroll">
              {error ? (
                <div className="px-4 py-3 text-sm text-red-500 dark:text-red-400 text-center">
                  Error loading assistants
                </div>
              ) : filteredAssistants.length > 0 ? (
                filteredAssistants.map((assistant) => (
                  <DropdownItem
                    key={assistant.id}
                    onClick={() => onAssistantChange(assistant)}
                    className="px-4 py-3"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">
                          {assistant.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {assistant.instructions.length > 60
                            ? `${assistant.instructions.substring(0, 60)}...`
                            : assistant.instructions}
                        </span>
                      </div>
                      {selectedAssistant?.id === assistant.id && (
                        <HiCheck
                          size={16}
                          className="text-black bg-white flex-shrink-0 ml-2 rounded-full p-1"
                        />
                      )}
                    </div>
                  </DropdownItem>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {assistants.length === 0
                    ? "No assistants available"
                    : "No assistants found"}
                </div>
              )}
            </div>
          )}
        </Dropdown>
      )}
    </div>
  );
};

export const Topbar: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    chatModels[0].id
  );
  const [selectedPrivacyId, setSelectedPrivacyId] = useState<string>(
    chatTypeModels[0].id
  );
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoadingAssistants, setIsLoadingAssistants] = useState(true);
  const [assistantsError, setAssistantsError] = useState<string | null>(null);
  const { toggle, isOpen } = useSidebar();

  // Fetch assistants on component mount
  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        setIsLoadingAssistants(true);
        setAssistantsError(null);

        const response = await fetch("/api/assistants");

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch assistants");
        }

        const assistantsData = await response.json();
        setAssistants(assistantsData);

        // Set the first assistant as selected if available, otherwise use default
        if (assistantsData.length > 0) {
          setSelectedAssistant(assistantsData[0]);
        } else {
          setSelectedAssistant(defaultAssistant);
        }
      } catch (error) {
        console.error("Error fetching assistants:", error);
        setAssistantsError(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred"
        );
        // Use default assistant on error
        setSelectedAssistant(defaultAssistant);
      } finally {
        setIsLoadingAssistants(false);
      }
    };

    fetchAssistants();
  }, []);

  // Helper functions to get selected objects
  const selectedModel =
    chatModels.find((model) => model.id === selectedModelId) || chatModels[0];
  const selectedPrivacy =
    chatTypeModels.find((privacy) => privacy.id === selectedPrivacyId) ||
    chatTypeModels[0];

  const handleSidebarToggle = () => {
    toggle();
  };

  const handleNewChat = () => {
    // TODO: Implement new chat functionality
    console.log("New chat");
  };

  const handleChatModelChange = (model: DropdownItemProps) => {
    setSelectedModelId(model.id);
    console.log("Chat model changed to:", model.name);
  };

  const handlePrivacyChange = (privacy: DropdownItemProps) => {
    setSelectedPrivacyId(privacy.id);
    console.log("Privacy changed to:", privacy.name);
  };

  const handleAssistantChange = (assistant: Assistant) => {
    setSelectedAssistant(assistant);
    console.log("Assistant changed to:", assistant.name);
  };

  return (
    <div className="flex items-center gap-2 w-full px-4 py-3">
      {/* Sidebar toggle button */}
      <button
        onClick={handleSidebarToggle}
        className="p-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-300 dark:border-gray-600 cursor-pointer"
      >
        <BsWindowSidebar size={20} />
      </button>

      {/* New chat button - hidden when sidebar is open */}
      {!isOpen && (
        <button
          onClick={handleNewChat}
          className="p-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer"
        >
          <HiPlus size={20} />
        </button>
      )}

      {/* Chat model dropdown */}
      <Dropdown
        trigger={
          <button className="flex items-center gap-3 px-3 py-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer">
            <span className="text-sm font-medium">{selectedModel.name}</span>
            <HiChevronDown size={16} />
          </button>
        }
      >
        {chatModels.map((model) => (
          <DropdownItem
            key={model.id}
            onClick={() => handleChatModelChange(model)}
            className="px-4 py-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{model.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {model.description}
                </span>
              </div>
              {selectedModel.id === model.id && (
                <HiCheck
                  size={16}
                  className="text-black bg-white flex-shrink-0 ml-2 rounded-full p-1"
                />
              )}
            </div>
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Privacy dropdown */}
      <Dropdown
        trigger={
          <button className="flex items-center gap-2 px-3 py-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-500 dark:hover:border-gray-500 rounded-lg border border-gray-300 dark:border-gray-600 transition-all duration-200 cursor-pointer">
            <HiLockClosed size={16} />
            <span className="text-sm">{selectedPrivacy.name}</span>
            <HiChevronDown size={16} />
          </button>
        }
      >
        {chatTypeModels.map((privacy) => (
          <DropdownItem
            key={privacy.id}
            onClick={() => handlePrivacyChange(privacy)}
            className="px-4 py-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{privacy.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {privacy.description}
                </span>
              </div>
              {selectedPrivacy.id === privacy.id && (
                <HiCheck
                  size={16}
                  className="text-black bg-white flex-shrink-0 ml-2 rounded-full p-1"
                />
              )}
            </div>
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Spacer to push AI assistant dropdown to the right */}
      <div className="flex-1"></div>

      {/* AI Assistant Type dropdown */}
      <AssistantTypeDropdown
        selectedAssistant={selectedAssistant}
        onAssistantChange={handleAssistantChange}
        assistants={assistants}
        isLoading={isLoadingAssistants}
        error={assistantsError}
      />
    </div>
  );
};
