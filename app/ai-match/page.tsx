"use client";

import { useEffect, useState } from "react";

type JobMatch = {
  title: string;
  reason: string;
  matchScore: number;
};

export default function AIMatchPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile skills on load
    async function fetchProfile() {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user?.profile?.skills) {
        setSkills(data.user.profile.skills);
      }
    }
    fetchProfile();
  }, []);

  const handleAddSkill = () => {
    if (skillInput && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const findMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("AI match error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">AI Smart Job Match</h1>
      <p className="text-gray-600 mb-6">Confirm your skills below and let OpenAI GPT-4o rank your best job opportunities.</p>

      {/* Skill Input Section */}
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-3">Your Skills Profile</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
              {skill}
              <button onClick={() => handleRemoveSkill(skill)} className="text-blue-600 font-bold">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill (e.g. React, Node.js)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button onClick={handleAddSkill} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
            Add Skill
          </button>
        </div>
        <button
          onClick={findMatches}
          disabled={loading || skills.length === 0}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 disabled:bg-gray-300"
        >
          {loading ? "Analyzing & Matching Jobs..." : "Find My Best Jobs with AI"}
        </button>
      </div>

      {/* Results Section */}
      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Ranked Matches</h2>
          {matches.map((match, idx) => (
            <div key={idx} className="bg-white border p-5 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-semibold text-blue-600">{match.title}</h3>
                <p className="text-gray-600 mt-1">{match.reason}</p>
              </div>
              <div className="bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full border border-green-300 text-center">
                Score: {match.matchScore}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}