import { JobDetailPageContent } from "@/components/jobs/job-detail-page-content";

interface JobDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  return <JobDetailPageContent jobId={id} />;
}
