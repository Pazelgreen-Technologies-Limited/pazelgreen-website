"use client";

// BACKEND: wire this form to → POST /api/posts/:slug/comments
// Expected request body: { fullName: string, email: string, body: string, saveDetails: boolean }
// On success: append new comment to the comments list and reset the form

import Image from "next/image";
import { useState } from "react";
import type { Comment } from "@/lib/blog-data";

interface CommentSectionProps {
  comments: Comment[];
  slug: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommentSection({
  comments,
  slug,
}: CommentSectionProps) {
  // Local state for form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [saveDetails, setSaveDetails] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // BACKEND: replace this console.log with a POST /api/posts/${slug}/comments call
    console.log("Comment submitted:", { fullName, email, body, saveDetails });
    // Reset form after submission
    setFullName("");
    setEmail("");
    setBody("");
  }

  return (
    <div className="mt-10">
      {/* Comment form */}
      <h3 className="mb-1 text-lg font-bold text-gray-900">
        Join the Conversation
      </h3>
      <p className="mb-6 text-xs text-gray-400">
        Be thoughtful, be kind and truthful
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-400"
          />
        </div>

        {/* Message textarea */}
        <textarea
          rows={4}
          placeholder="Write Comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-green-400 resize-none"
        />

        {/* Save details checkbox + submit button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveDetails}
              onChange={(e) => setSaveDetails(e.target.checked)}
              className="accent-green-500"
            />
            Save my details for next time
          </label>
          <button
            type="submit"
            className="rounded-full bg-green-500 px-6 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
          >
            Post Comment
          </button>
        </div>
      </form>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="mt-10 space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {/* Avatar */}
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-200">
                <Image
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Comment body */}
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  By {comment.author.name}
                </p>
                <p className="mt-1 text-sm text-gray-600">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
