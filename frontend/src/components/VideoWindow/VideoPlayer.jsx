export default function VideoPlayer({ data }) {
  return (
    <div className="mb-4">
      <video
        controls
        width="100%"
        height="auto"
        poster={data.videoImageUrl}
        className="rounded-lg max-h-[calc(100vh-150px)]"
      >
        <source src={data.videoUrl} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  );
}
