"use client";

import { LoadingSpinner } from "./loading-spinner";

interface GlobalLoadingProps {
  message?: string;
}

export const GlobalLoading = ({
  message = "Đang tải...",
}: GlobalLoadingProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="xl" variant="primary" />
        {/* <div className="flex flex-col items-center gap-2">
          <div className="flex gap-1">
            <span
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default GlobalLoading;
