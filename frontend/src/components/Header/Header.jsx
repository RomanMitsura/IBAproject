import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../redux/slices/theme.js";
import { fetchVideos, resetVideos } from "../../redux/slices/videos";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import UserProfile from "./UserProfile";

export default function Header({ onLogoClick }) {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleLogoClick = () => {
    dispatch(resetVideos());
    dispatch(fetchVideos({ sortBy: "new" }));
    onLogoClick();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      dispatch(fetchVideos({ search: searchQuery }));
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <Logo onClick={handleLogoClick} />
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />
      <div className="flex gap-6 w-1/4 justify-end">
        <ThemeToggle
          isDarkMode={isDarkMode}
          onToggle={() => dispatch(toggleTheme())}
        />
        <UserProfile user={user} token={token} />
      </div>
    </div>
  );
}
