import { Link } from "react-router-dom";
import { formatNumber } from "../../utils/formatNumber";

export default function VideoInfo({ data }) {
  const views = formatNumber(data?.views || 0);

  return (
    <div>
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <ul className="flex gap-2">
        {data.categories.map((category, index) => (
          <li className="text-light-second-text font-light" key={index}>
            #{category.name}
          </li>
        ))}
      </ul>
      <Link
        to={`/profile/${data.user._id}`}
        className="flex items-center gap-2 my-4"
      >
        <img
          src={data.user.avatarUrl}
          alt={`${data.user.fullname}'s avatar`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="font-bold">{data.user.fullname}</div>
      </Link>
      <div className="text-sm text-light-second-text">{views} просмотров</div>
      <p className="text-light-second-text mb-4">{data.description}</p>
    </div>
  );
}
