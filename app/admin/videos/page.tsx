"use client";

import { useState } from "react";

export default function AdminVideosPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [video, setVideo] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title || !topic || !video) {
      alert("Please enter a title, select a topic and choose a video.");
      return;
    }

    alert(
      "Video details captured! Cloud storage connection is the next step."
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Upload Lesson Video</h1>
        <p className="mb-6 text-gray-600">
          Add a video lesson for your WASSCE Maths students.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block font-semibold">Video Title</label>
            <input
              className="w-full rounded-lg border p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Algebra"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Topic</label>
            <select
              className="w-full rounded-lg border p-3"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="">Select a topic</option>
              <option value="Algebra">Algebra</option>
              <option value="Geometry">Geometry</option>
              <option value="Trigonometry">Trigonometry</option>
              <option value="Statistics">Statistics</option>
              <option value="Probability">Probability</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-semibold">Description</label>
            <textarea
              className="w-full rounded-lg border p-3"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What will students learn in this lesson?"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">Choose Video</label>
            <input
              type="file"
              accept="video/*"
              className="w-full rounded-lg border p-3"
              onChange={(e) => setVideo(e.target.files?.[0] ?? null)}
            />
            {video && (
              <p className="mt-2 text-sm text-green-700">
                Selected: {video.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Save Video Details
          </button>
        </form>
      </div>
    </main>
  );
}