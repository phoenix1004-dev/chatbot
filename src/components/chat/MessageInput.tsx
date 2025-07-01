"use client";

import React, { useState, useRef } from "react";
import { HiPaperClip, HiArrowUp } from "react-icons/hi2";

interface MessageInputProps {
  onSendMessage?: (message: string, attachments?: File[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  placeholder = "Send a message...",
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the textarea when component mounts
  React.useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage?.(message.trim(), attachments);
      setMessage("");
      setAttachments([]);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className="border-t border-gray-800 bg-[#0a0a0a] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
              >
                <span className="truncate max-w-32">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full w-5 h-5 flex items-center justify-center transition-all duration-200 cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Message input container */}
        <div className="relative flex items-end gap-3 p-3 bg-gray-900 border border-gray-700 rounded-2xl focus-within:border-gray-600 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200">
          {/* Attachment button */}
          <button
            onClick={handleAttachmentClick}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <HiPaperClip size={20} />
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Text input */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none min-h-[24px] max-h-[120px] py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ lineHeight: "1.5" }}
            autoFocus
          />

          {/* Send button */}
          <button
            onClick={handleSendMessage}
            disabled={!canSend}
            className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${
              canSend
                ? "bg-white text-black hover:bg-gray-200 hover:scale-105 cursor-pointer"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
            title="Send message"
          >
            <HiArrowUp size={16} />
          </button>
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};
