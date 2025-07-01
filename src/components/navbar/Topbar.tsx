"use client";

import React, { useState } from "react";
import { Dropdown, DropdownItem } from "../ui/Dropdown";
import { HiPlus, HiChevronDown, HiLockClosed, HiCheck } from "react-icons/hi2";
import { BsWindowSidebar } from "react-icons/bs";
import { useSidebar } from "../../contexts/SidebarContext";

interface DropdownItemProps {
  id: string;
  name: string;
  description: string;
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

export const Topbar: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>(
    chatModels[0].id
  );
  const [selectedPrivacyId, setSelectedPrivacyId] = useState<string>(
    chatTypeModels[0].id
  );
  const { toggle, isOpen } = useSidebar();

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
    </div>
  );
};
