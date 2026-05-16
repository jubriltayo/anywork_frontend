"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { EmployerService } from "@/lib/services/employer";
import type { Job, Category, JobLocation, JobFormData } from "@/lib/types/api";
import { Save, Check } from "lucide-react";

interface JobFormProps {
  job?: Job;
  onSuccess?: () => void;
}

function getLocationId(job?: Job): string {
  if (!job?.location) return "";
  if (typeof job.location === "string") return job.location;
  return (job.location as JobLocation).location_id ?? "";
}

function getCategoryId(job?: Job): string {
  if (!job?.category) return "";
  if (typeof job.category === "string") return job.category;
  return (job.category as Category).category_id ?? "";
}

const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/25 transition-all";
const selectClass = "w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-white/25 transition-all";
const labelClass = "block text-white/40 text-xs font-semibold uppercase tracking-widest mb-2";

export function JobForm({ job, onSuccess }: JobFormProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: job?.title ?? "",
    description: job?.description ?? "",
    location: getLocationId(job),
    category: getCategoryId(job),
    salary_range: job?.salary_range ?? "",
    job_type: job?.job_type ?? "full-time",
    expires_at: job?.expires_at?.split("T")[0] ?? "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<JobLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [cats, locs] = await Promise.all([
          EmployerService.getCategories(),
          EmployerService.getLocations(),
        ]);
        setCategories(cats.results);
        setLocations(locs.results);
      } catch (err) {
        console.error("Failed to load form data:", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title ?? "",
        description: job.description ?? "",
        location: getLocationId(job),
        category: getCategoryId(job),
        salary_range: job.salary_range ?? "",
        job_type: job.job_type ?? "full-time",
        expires_at: job.expires_at?.split("T")[0] ?? "",
      });
    }
  }, [job]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (job) {
        await EmployerService.updateJob(job.job_id, formData);
      } else {
        await EmployerService.createJob(formData);
      }
      setSaved(true);
      onSuccess?.();
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      <div>
        <label className={labelClass}>Job Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Senior React Developer"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the role, responsibilities, and requirements…"
          required
          rows={7}
          className={`${inputClass} resize-none leading-relaxed`}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={selectClass}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={selectClass}
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

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Salary Range</label>
          <input
            type="text"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            placeholder="e.g. $80,000 – $120,000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Job Type</label>
          <select
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
            className={selectClass}
          >
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="remote">Remote</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Application Deadline</label>
        <input
          type="date"
          name="expires_at"
          value={formData.expires_at}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-7 py-3.5 bg-[#e8ff47] text-[#0a0a0f] font-black text-sm rounded-xl hover:bg-[#d4eb3a] disabled:opacity-50 transition-all"
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-[#0a0a0f]/30 border-t-[#0a0a0f] animate-spin" />
        ) : saved ? (
          <><Check className="w-4 h-4" /> {job ? "Updated!" : "Posted!"}</>
        ) : (
          <><Save className="w-4 h-4" /> {job ? "Update Job" : "Post Job"}</>
        )}
      </button>
    </form>
  );
}