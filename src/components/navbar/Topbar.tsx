"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import {
  HiPlus,
  HiChevronDown,
  HiLockClosed,
  HiCheck,
  HiCpuChip,
} from "react-icons/hi2";
import { BsWindowSidebar } from "react-icons/bs";
import { useSidebar } from "../../contexts/SidebarContext";

interface DropdownItemProps {
  id: string;
  name: string;
  description: string;
}

// Assistant Type Dropdown Component with Search
interface AssistantTypeDropdownProps {
  selectedAssistant: DropdownItemProps;
  onAssistantChange: (assistant: DropdownItemProps) => void;
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

const assistantTypes: DropdownItemProps[] = [
  {
    id: "general",
    name: "General Assistant",
    description: "All-purpose AI assistant for various tasks",
  },
  {
    id: "code",
    name: "Code Assistant",
    description: "Specialized for programming and development",
  },
  {
    id: "creative",
    name: "Creative Assistant",
    description: "Focused on creative writing and content",
  },
  {
    id: "research",
    name: "Research Assistant",
    description: "Optimized for research and analysis",
  },
  {
    id: "data",
    name: "Data Analyst",
    description: "Expert in data analysis and visualization",
  },
  {
    id: "marketing",
    name: "Marketing Assistant",
    description: "Specialized in marketing strategies and campaigns",
  },
  {
    id: "legal",
    name: "Legal Assistant",
    description: "Knowledgeable in legal research and documentation",
  },
  {
    id: "medical",
    name: "Medical Assistant",
    description: "Focused on medical information and healthcare",
  },
  {
    id: "education",
    name: "Education Assistant",
    description: "Designed for teaching and learning support",
  },
  {
    id: "finance",
    name: "Finance Assistant",
    description: "Expert in financial analysis and planning",
  },
];

const AssistantTypeDropdown: React.FC<AssistantTypeDropdownProps> = ({
  selectedAssistant,
  onAssistantChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filter assistant types based on search term
  const filteredAssistantTypes = useMemo(() => {
    if (!searchTerm.trim()) return assistantTypes;

    const term = searchTerm.toLowerCase();
    return assistantTypes.filter(
      (assistant) =>
        assistant.name.toLowerCase().includes(term) ||
        assistant.description.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  return (
    <Dropdown
      align="right"
      showSearch={false}
      maxHeight="none"
      trigger={
        <button className="flex items-center gap-2 px-3 py-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer">
          <HiCpuChip size={16} />
          <span className="text-sm">{selectedAssistant.name}</span>
          <HiChevronDown size={16} />
        </button>
      }
    >
      {/* Fixed header: View All button and Search input */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        {/* View All button */}
        <div className="p-3 pb-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push("/assistants");
            }}
            className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors border border-gray-300 dark:border-gray-600"
          >
            View All Assistants ({assistantTypes.length})
          </button>
        </div>

        {/* Search input */}
        <div className="px-3 pb-3">
          <input
            type="text"
            placeholder="Search assistants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Scrollable assistant list section only */}
      <div className="overflow-y-auto max-h-80 dropdown-scroll">
        {filteredAssistantTypes.length > 0 ? (
          filteredAssistantTypes.map((assistant) => (
            <DropdownItem
              key={assistant.id}
              onClick={() => onAssistantChange(assistant)}
              className="px-4 py-3"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{assistant.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {assistant.description}
                  </span>
                </div>
                {selectedAssistant.id === assistant.id && (
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
            No assistants found
          </div>
        )}
      </div>
    </Dropdown>
  );
};

export const Topbar: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    chatModels[0].id
  );
  const [selectedPrivacyId, setSelectedPrivacyId] = useState<string>(
    chatTypeModels[0].id
  );
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>(
    assistantTypes[0].id
  );
  const { toggle, isOpen } = useSidebar();

  // Helper functions to get selected objects
  const selectedModel =
    chatModels.find((model) => model.id === selectedModelId) || chatModels[0];
  const selectedPrivacy =
    chatTypeModels.find((privacy) => privacy.id === selectedPrivacyId) ||
    chatTypeModels[0];
  const selectedAssistant =
    assistantTypes.find((assistant) => assistant.id === selectedAssistantId) ||
    assistantTypes[0];

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

  const handleAssistantTypeChange = (assistant: DropdownItemProps) => {
    setSelectedAssistantId(assistant.id);
    console.log("Assistant type changed to:", assistant.name);
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
          <button className="flex items-center gap-2 px-3 py-2 text-white hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors cursor-pointer">
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
        onAssistantChange={handleAssistantTypeChange}
      />
    </div>
  );
};
