"use client";

import { useJobs } from "@/lib/hooks/use-jobs";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { JobCard } from "@/components/jobs/job-card";
import { Search, SlidersHorizontal, Briefcase, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function JobsPageContent() {
  const {
    jobs, loading, error, filters, page, pagination,
    searchJobs, updateFilters, clearFilters, nextPage, previousPage,
  } = useJobs();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const hasActiveFilters = filters.job_type || filters.search;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0a0a0f] pt-24 pb-20">

        {/* Header */}
        <section className="border-b border-white/10 px-6 pb-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <p className="text-[#e8ff47] text-xs font-bold tracking-widest uppercase mb-2">Open Roles</p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-display">
                Find your next opportunity
              </h1>
              <p className="text-white/40 mt-2 text-lg">
                {pagination.count ? `${pagination.count.toLocaleString()} jobs available` : "Browse open roles"}
              </p>
            </div>

            {/* Search + filter row */}
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={filters.search ?? ""}
                  onChange={(e) => searchJobs(e.target.value)}
                  placeholder="Search by title, skill, or keyword…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all"
                />
              </div>

              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`flex items-center gap-2 px-5 py-3.5 rounded-xl border text-sm font-semibold transition-all ${
                  filtersOpen || hasActiveFilters
                    ? "border-[#e8ff47]/40 bg-[#e8ff47]/5 text-[#e8ff47]"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:text-white hover:border-white/20"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-5 h-5 rounded-full bg-[#e8ff47] text-[#0a0a0f] text-xs font-black flex items-center justify-center">
                    !
                  </span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-3.5 rounded-xl border border-white/10 text-white/40 hover:text-white text-sm transition-all"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>

            {/* Filter panel */}
            {filtersOpen && (
              <div className="mt-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02] grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white/30 text-xs font-semibold uppercase tracking-widest mb-2">Job Type</label>
                  <select
                    value={filters.job_type ?? ""}
                    onChange={(e) => updateFilters({ ...filters, job_type: e.target.value || undefined })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-white/20 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Listings */}
        <section className="px-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-40 rounded-2xl border border-white/5 bg-white/[0.02] animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                  <Briefcase className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-white font-semibold mb-2">No jobs found</p>
                <p className="text-white/30 text-sm mb-6">Try adjusting your search or filters</p>
                <button onClick={clearFilters} className="px-5 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/15 transition-all">
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Count */}
                <div className="flex items-center justify-between mb-5">
                  <p className="text-white/30 text-sm">
                    Showing <span className="text-white font-semibold">{jobs.length}</span> of{" "}
                    <span className="text-white font-semibold">{pagination.count}</span> jobs
                  </p>
                  <p className="text-white/20 text-sm">Page {page}</p>
                </div>

                <div className="space-y-3 mb-10">
                  {jobs.map((job) => (
                    <JobCard key={job.job_id} job={job} />
                  ))}
                </div>

                {/* Pagination */}
                {(pagination.next || pagination.previous) && (
                  <div className="flex items-center justify-center gap-3 pt-8 border-t border-white/10">
                    <button
                      onClick={previousPage}
                      disabled={!pagination.previous}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="text-white/20 text-sm px-4">Page {page}</span>
                    <button
                      onClick={nextPage}
                      disabled={!pagination.next}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e8ff47] text-[#0a0a0f] font-bold hover:bg-[#d4eb3a] disabled:opacity-30 disabled:cursor-not-allowed text-sm transition-all"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}