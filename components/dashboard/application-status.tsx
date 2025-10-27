interface ApplicationStatusProps {
  status: string;
}

export function ApplicationStatus({ status }: ApplicationStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-success/10 text-success border-success";
      case "rejected":
        return "bg-error/10 text-error border-error";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div
      className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
}
