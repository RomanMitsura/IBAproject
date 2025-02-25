import { useState } from "react";
import CommentItem from "./CommentItem";

export default function CommentAccordion({
  comments,
  videoAuthorId,
  canDeleteComment,
  onDelete,
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const toggleComments = () => {
    setIsCommentsOpen((prev) => !prev);
  };

  return (
    <div className="xl:hidden">
      <button
        onClick={toggleComments}
        className="w-full px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover flex justify-between items-center"
      >
        <span className="font-bold text-xl p-1">
          Комментариев {comments.length}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`size-6 transition-transform duration-200 ${isCommentsOpen ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isCommentsOpen && (
        <div className="mt-2 flex flex-col gap-4 mx-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                videoAuthorId={videoAuthorId}
                canDeleteComment={canDeleteComment}
                onDelete={onDelete}
              />
            ))
          ) : (
            <p className="mt-2 italic">Нет комментариев</p>
          )}
        </div>
      )}
    </div>
  );
}
