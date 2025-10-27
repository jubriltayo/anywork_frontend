"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Employer } from "@/lib/types/api";
import { EmployerService } from "@/lib/services/employer";

interface EmployerProfileFormProps {
  profile: Employer;
  onSuccess?: () => void;
}

export function EmployerProfileForm({
  profile,
  onSuccess,
}: EmployerProfileFormProps) {
  const [formData, setFormData] = useState({
    ...profile,
    company_description: profile.company_description || "",
    website: profile.website || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const submitData = {
        ...formData,
        company_description: formData.company_description || null,
        website: formData.website || null,
      };

      await EmployerService.updateProfile(profile.user, submitData);
      setSuccess("Profile updated successfully!");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Company Name</label>
        <Input
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="Your Company"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Company Description
        </label>
        <textarea
          name="company_description"
          value={formData.company_description}
          onChange={handleChange}
          placeholder="Tell us about your company..."
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Website</label>
        <Input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://example.com"
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
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
