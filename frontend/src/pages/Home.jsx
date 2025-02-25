import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import AllVideos from "../components/AllVideos";
import { fetchVideos } from "../redux/slices/videos";
import CategoryFilter from "../components/categoryFilter";
import SortFilter from "../components/SortFilter";

export default function HomePage() {
  const dispatch = useDispatch();
  const { videos } = useSelector((state) => state.videos);
  const [sortBy, setSortBy] = useState("new");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    dispatch(fetchVideos({ sortBy, category: selectedCategory }));
  }, [dispatch, sortBy, selectedCategory]);

  const handleSort = (type) => {
    setSortBy(type);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <Header />
      <CategoryFilter
        onCategoryChange={handleCategoryChange}
        selectedCategory={selectedCategory}
      />
      <SortFilter sortBy={sortBy} onSort={handleSort} />
      <AllVideos videosData={videos.items} status={videos.status} />
    </>
  );
}
