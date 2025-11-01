"use client";

import { useState, useTransition } from "react";
import { toggleBookmark } from "./bookmarkActions";

/**
 * BookmarkButton component for toggling quiz bookmarks
 * @param {Object} props
 * @param {number} props.quizId - The quiz ID
 * @param {boolean} props.initialBookmarked - Initial bookmark state
 * @param {string} props.variant - "icon" or "button" (default: "icon")
 * @param {string} props.size - "sm", "md", or "lg" (default: "md")
 */
export default function BookmarkButton({
  quizId,
  initialBookmarked = false,
  variant = "icon",
  size = "md",
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (e) => {
    // Prevent navigation if button is inside a link
    e.preventDefault();
    e.stopPropagation();

    // Optimistic update
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      const result = await toggleBookmark(quizId);

      if (!result.success) {
        // Revert on error
        setIsBookmarked(previousState);
        alert(result.error || "ブックマークの更新に失敗しました");
      } else {
        // Update to server state
        setIsBookmarked(result.bookmarked);
      }
    });
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonSizeClasses = {
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  if (variant === "button") {
    return (
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`btn ${isBookmarked ? "btn-accent" : "btn-outline"} ${
          buttonSizeClasses[size]
        }`}
        title={isBookmarked ? "お気に入りから削除" : "お気に入りに追加"}
      >
        {isPending ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          <>
            <svg
              className={sizeClasses[size]}
              fill={isBookmarked ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {isBookmarked ? "お気に入り済み" : "お気に入り"}
          </>
        )}
      </button>
    );
  }

  // Icon variant (default)
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`btn btn-circle btn-ghost ${buttonSizeClasses[size]}`}
      title={isBookmarked ? "お気に入りから削除" : "お気に入りに追加"}
    >
      {isPending ? (
        <span className="loading loading-spinner loading-sm"></span>
      ) : (
        <svg
          className={sizeClasses[size]}
          fill={isBookmarked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={isBookmarked ? { color: "#f87171" } : {}}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}
