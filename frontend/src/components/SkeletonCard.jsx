export default function SkeletonCard() {
  return (
    <div className="w-full">
      <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg bg-gray-200 dark:bg-light-second-text animate-pulse"></div>
      <div className="flex mt-2 w-full gap-2">
        <div className="w-full h-12 rounded-xl bg-gray-200 dark:bg-light-second-text animate-pulse"></div>
      </div>
    </div>
  );
}
