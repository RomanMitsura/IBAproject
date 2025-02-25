import CommentItem from "./CommentItem";

export default function CommentList({
  comments,
  videoAuthorId,
  canDeleteComment,
  onDelete,
}) {
  return (
    <div className="hidden xl:block">
      <span className="font-bold text-xl mb-2 block">
        Комментариев {comments.length}
      </span>
      {comments.length > 0 ? (
        <div className="flex flex-col gap-4 mx-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              videoAuthorId={videoAuthorId}
              canDeleteComment={canDeleteComment}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <p className="mt-2 italic">Нет комментариев</p>
      )}
    </div>
  );
}
