import Link from "next/link";
import BookmarkButton from "./BookmarkButton";
import { getBookmarkStatus } from "./bookmarkActions";

/**
 * QuizCard component for displaying quiz information
 * @param {Object} props
 * @param {Object} props.quiz - Quiz data
 * @param {boolean} props.showBookmark - Whether to show bookmark button
 * @param {Object} props.additionalInfo - Additional info to display (answerCount, date, rank, etc.)
 * @param {string} props.href - Link href (defaults to /quizzes/[quiz.id])
 * @param {React.ReactNode} props.actions - Custom action buttons
 */
export default async function QuizCard({
  quiz,
  showBookmark = true,
  additionalInfo = {},
  href,
  actions,
}) {
  // Get bookmark status if needed
  const isBookmarked = showBookmark ? await getBookmarkStatus(quiz.id) : false;

  const linkHref = href || `/quizzes/${quiz.id}`;

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      <div className="card-body">
        <div className="flex items-start gap-4">
          {/* Rank badge (if provided) */}
          {additionalInfo.rank && (
            <div className="badge badge-accent badge-lg">
              #{additionalInfo.rank}
            </div>
          )}

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <Link href={linkHref} className="flex-1">
                <h2 className="card-title text-xl hover:text-accent transition-colors">
                  {quiz.title}
                </h2>
              </Link>
              {/* Bookmark button */}
              {showBookmark && (
                <BookmarkButton
                  quizId={quiz.id}
                  initialBookmarked={isBookmarked}
                  variant="icon"
                  size="md"
                />
              )}
            </div>

            <Link href={linkHref}>
              <p className="text-base-content/70 mb-3">{quiz.description}</p>
            </Link>

            {/* Additional info */}
            <div className="flex gap-3 text-sm text-base-content/60 flex-wrap">
              {/* Answer count */}
              {additionalInfo.answerCount !== undefined && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>{additionalInfo.answerCount}人が回答</span>
                </div>
              )}

              {/* Created/Bookmarked date */}
              {additionalInfo.date && (
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    {additionalInfo.dateLabel || ""}
                    {new Date(additionalInfo.date).toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>

            {/* Custom actions */}
            {actions && <div className="mt-4 flex gap-2">{actions}</div>}
          </div>

          {/* Arrow icon for navigation (when no custom actions) */}
          {!actions && (
            <Link href={linkHref} className="flex items-center">
              <svg
                className="w-6 h-6 text-base-content/30"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
