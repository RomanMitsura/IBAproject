import { Link } from "react-router-dom";

export default function CommentForm({
  user,
  token,
  commentText,
  setCommentText,
  onAddComment,
}) {
  return (
    <div className="mt-4 flex gap-2 mb-6">
      {token && user ? (
        <>
          <textarea
            placeholder="Введите ваш комментарий..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:bg-main-dark dark:border-gray-600"
            rows="2"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
            onClick={onAddComment}
          >
            Отправить
          </button>
        </>
      ) : (
        <p className="text-light-second-text w-full text-lg">
          <Link to="/login" className="underline">
            Авторизуйтесь
          </Link>
          , чтобы оставлять комментарии.
        </p>
      )}
    </div>
  );
}
