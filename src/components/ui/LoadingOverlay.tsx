"use client";

import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Loading...",
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 bg-[#0a0a0a] bg-opacity-80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" color="white" />
        <p className="text-white text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};
