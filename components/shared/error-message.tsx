import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="card bg-error/10 border-error">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-error font-medium mb-1">Error</p>
          <p className="text-sm text-error/80">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-error hover:underline font-medium"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
