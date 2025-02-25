import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function CommentItem({
  comment,
  videoAuthorId,
  canDeleteComment,
  onDelete,
}) {
  return (
    <div className="flex items-start gap-2 w-full max-w-full">
      <Link to={`/profile/${comment.user._id}`} className="flex-shrink-0">
        <img
          className="h-7 w-7 rounded-full object-cover"
          src={comment.user.avatarUrl || "https://via.placeholder.com/28"}
          alt={comment.user.fullname}
        />
      </Link>
      <div className="flex flex-col flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${comment.user._id}`}>
            {comment.user.fullname}
          </Link>
          <span className="text-xs font-light text-light-second-text">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
              locale: ru,
            })}
          </span>
        </div>
        <span className="break-words">{comment.text}</span>
      </div>
      {canDeleteComment(comment) && (
        <button
          className="flex-shrink-0 px-2 py-1 bg-red-700 hover:bg-red-500 rounded-md"
          onClick={() => onDelete(comment._id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            className="w-5 h-5 stroke-red-200"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
