import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/Home";
import FullVideoPage from "../pages/FullVideo";
import ProfilePage from "../pages/Profile";
import AddVideoPage from "../pages/AddVideo";
import RegistrationPage from "../pages/Registration";
import LoginPage from "../pages/Login";
import NotFoundPage from "../pages/NotFound";
import UserVideos from "../components/UserVideos";
import { userVideosLoader } from "../loaders/userVideosLoader";
import Playlists from "../components/Playlists/Playlists";
import ErrorPage from "../pages/ErrorPage";
import EditVideoPage from "../pages/EditVideo";
import EditProfilePage from "../pages/EditProfile";
import AdminPanelPage from "../pages/AdminPanel";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Layout from "../pages/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />, // Используем Layout как корневой элемент
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/:videoId",
        element: <FullVideoPage />,
      },
      {
        path: "/edit/:videoId",
        element: <ProtectedRoute requireCreator={true} />,
        children: [
          {
            path: "",
            element: <EditVideoPage />,
          },
        ],
      },
      {
        path: "/login",
        element: <PublicRoute />,
        children: [
          {
            path: "",
            element: <LoginPage />,
          },
        ],
      },
      {
        path: "/registration",
        element: <PublicRoute />,
        children: [
          {
            path: "",
            element: <RegistrationPage />,
          },
        ],
      },
      {
        path: "/profile",
        element: <ProtectedRoute />,
        children: [
          {
            path: ":userId",
            element: <ProfilePage />,
            children: [
              {
                path: "user-videos",
                element: <UserVideos />,
                loader: userVideosLoader,
              },
              {
                path: "user-playlists",
                element: <Playlists />,
              },
              {
                path: "public-playlists",
                element: <Playlists isPublicView={true} />,
              },
            ],
          },
          {
            path: ":userId/edit-profile",
            element: <EditProfilePage />,
          },
          {
            path: "add-video",
            element: <AddVideoPage />,
          },
        ],
      },
      {
        path: "/admin",
        element: <ProtectedRoute requireAdmin={true} />,
        children: [
          {
            path: "",
            element: <AdminPanelPage />,
          },
        ],
      },
      {
        path: "/error",
        element: <ErrorPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export { router };
