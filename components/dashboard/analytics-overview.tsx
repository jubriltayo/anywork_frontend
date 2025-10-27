import type { Analytics } from "@/lib/types/api";
import { Eye, FileText } from "lucide-react";

interface AnalyticsOverviewProps {
  analytics: Analytics[];
  loading: boolean;
}

export function AnalyticsOverview({
  analytics,
  loading,
}: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  const totalViews = analytics.reduce((sum, a) => sum + a.views, 0);
  const totalApplications = analytics.reduce(
    (sum, a) => sum + a.applications,
    0
  );

  return (
    <>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Total Views</p>
              <p className="text-4xl font-bold">{totalViews}</p>
            </div>
            <Eye className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-muted text-sm mb-2">Total Applications</p>
              <p className="text-4xl font-bold">{totalApplications}</p>
            </div>
            <FileText className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Job Performance</h2>

        {analytics.length === 0 ? (
          <p className="text-muted text-center py-8">
            No analytics data available yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Views</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Applications
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Conversion Rate
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item) => (
                  <tr
                    key={item.analytics_id}
                    className="border-b border-border hover:bg-muted/50"
                  >
                    <td className="py-3 px-4">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{item.views}</td>
                    <td className="py-3 px-4">{item.applications}</td>
                    <td className="py-3 px-4">
                      {item.views > 0
                        ? ((item.applications / item.views) * 100).toFixed(1)
                        : 0}
                      %
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
