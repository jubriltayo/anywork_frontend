"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployerService } from "@/lib/services/employer";
import type { Job, Category, Location, JobFormData } from "@/lib/types/api";

interface JobFormProps {
  job?: Job;
  onSuccess?: () => void;
}

export function JobForm({ job, onSuccess }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: job?.title || "",
    description: job?.description || "",
    location: job?.location || "",
    category: job?.category || "",
    salary_range: job?.salary_range || "",
    job_type: job?.job_type || "full-time",
    expires_at: job?.expires_at?.split("T")[0] || "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catsRes, locsRes] = await Promise.all([
        EmployerService.getCategories(),
        EmployerService.getLocations(),
      ]);
      setCategories(catsRes.results);
      setLocations(locsRes.results);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (job) {
        await EmployerService.updateJob(job.job_id, formData);
      } else {
        await EmployerService.createJob(formData);
      }
      setSuccess(
        job ? "Job updated successfully!" : "Job posted successfully!"
      );
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Job Title</label>
        <Input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g., Senior React Developer"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the job role and responsibilities..."
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={6}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.location_id} value={loc.location_id}>
                {loc.city}, {loc.state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Salary Range</label>
          <Input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            placeholder="e.g., $80,000 - $120,000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Expires At</label>
        <Input
          type="date"
          name="expires_at"
          value={formData.expires_at}
          onChange={handleChange}
          required
        />
      </div>

      {error && (
        <div className="p-3 bg-error/10 border border-error text-error rounded-lg text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
          {success}
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : job ? "Update Job" : "Post Job"}
      </Button>
    </form>
  );
}
