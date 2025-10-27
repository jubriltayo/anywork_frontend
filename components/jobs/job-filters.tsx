"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface JobFiltersProps {
  filters: {
    job_type?: string;
    salary_min?: string;
    salary_max?: string;
  };
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export function JobFilters({
  filters,
  onFilterChange,
  onClearFilters,
}: JobFiltersProps) {
  const hasActiveFilters =
    filters.job_type || filters.salary_min || filters.salary_max;

  return (
    <div className="mb-8 p-6 bg-card border border-border rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <select
            value={filters.job_type || ""}
            onChange={(e) => onFilterChange("job_type", e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Min Salary</label>
          <Input
            type="number"
            placeholder="e.g., 50000"
            value={filters.salary_min || ""}
            onChange={(e) => onFilterChange("salary_min", e.target.value)}
            className="text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Max Salary</label>
          <Input
            type="number"
            placeholder="e.g., 150000"
            value={filters.salary_max || ""}
            onChange={(e) => onFilterChange("salary_max", e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            className="w-full bg-transparent"
            onClick={onClearFilters}
            disabled={!hasActiveFilters}
          >
            <X className="w-4 h-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
