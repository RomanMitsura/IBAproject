import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { fetchAuthMe } from "./redux/slices/auth";
import { useSelector } from "react-redux";
import { router } from "./routes/routes";

export default function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    dispatch(fetchAuthMe());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
