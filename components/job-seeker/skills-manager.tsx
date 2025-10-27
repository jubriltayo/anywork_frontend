"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Skill } from "@/lib/types/api";
import { JobSeekerService } from "@/lib/services/job-seeker";
import { Plus, X } from "lucide-react";

interface SkillsManagerProps {
  skills: Skill[];
  onSuccess?: () => void;
}

export function SkillsManager({ skills, onSuccess }: SkillsManagerProps) {
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;

    setLoading(true);
    setError("");

    try {
      await JobSeekerService.addSkill(newSkill);
      setNewSkill("");
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId: string) => {
    try {
      await JobSeekerService.deleteSkill(skillId);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete skill");
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddSkill} className="flex gap-2">
        <Input
          type="text"
          placeholder="Add a skill (e.g., React, Python)"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <Button type="submit" disabled={loading}>
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      {error && (
        <div className="p-3 bg-error/10 border border-error text-error rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <div
            key={skill.skill_id}
            className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full"
          >
            <span className="text-sm">{skill.name}</span>
            <button
              type="button"
              onClick={() => handleDeleteSkill(skill.skill_id)}
              className="hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
