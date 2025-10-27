"use client";

import { useJobs } from "@/lib/hooks/use-jobs";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobCard } from "@/components/jobs/job-card";
import { JobFilters } from "@/components/jobs/job-filters";
import { Briefcase, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function JobsPageContent() {
  const {
    jobs,
    loading,
    error,
    filters,
    page,
    pagination,
    searchJobs,
    updateFilters,
    clearFilters,
    nextPage,
    previousPage,
  } = useJobs();

  const handleSearch = (query: string) => {
    searchJobs(query);
  };

  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header Section */}
        <section className="py-12 bg-linear-to-r from-primary/10 via-accent/10 to-secondary/10 border-b border-border">
          <div className="container-main">
            <h1 className="text-5xl font-bold mb-4">
              Discover Your Next Opportunity
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Browse thousands of job listings from top companies. Find the
              perfect role that matches your skills and aspirations.
            </p>

            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search jobs by title, company, or skills..."
                value={filters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 py-3 text-base"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container-main">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Job Listings */}
            <div>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="card h-48 bg-muted/50 animate-pulse"
                    />
                  ))}
                </div>
              ) : error ? (
                <div className="card text-center py-16">
                  <p className="text-error">{error}</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="card text-center py-16">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-2xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters to find more
                    opportunities
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Showing{" "}
                      <span className="text-foreground font-semibold">
                        {jobs.length}
                      </span>{" "}
                      of{" "}
                      <span className="text-foreground font-semibold">
                        {pagination.count}
                      </span>{" "}
                      jobs
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {jobs.map((job) => (
                      <JobCard key={job.job_id} job={job} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Page{" "}
                      <span className="font-semibold text-foreground">
                        {page}
                      </span>{" "}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={previousPage}
                        disabled={!pagination.previous}
                        className="px-6 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        Previous
                      </button>
                      <button
                        onClick={nextPage}
                        disabled={!pagination.next}
                        className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
