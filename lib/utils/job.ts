export function formatJobType(jobType: string): string {
  return jobType
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getRelativeTime(dateString: string): string {
  const h = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 3600000
  );
  if (h < 24) return "Today";
  if (h < 48) return "Yesterday";
  if (h < 168) return `${Math.floor(h / 24)}d ago`;
  return `${Math.floor(h / 168)}w ago`;
}