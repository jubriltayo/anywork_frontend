interface LoadingStateProps {
  isLoading: boolean;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingState({
  isLoading,
  children,
  fallback,
}: LoadingStateProps) {
  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
