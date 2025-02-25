// import { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Link,
//   NavLink,
//   Outlet,
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import ConfirmModal from "../components/ConfirmModal";
// import { logout } from "../redux/slices/auth";
// import axios from "../axios";

// export default function Profile() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { userId } = useParams();
//   const user = useSelector((state) => state.auth.user);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isOpen, setIsOpen] = useState(false);
//   const [profileUser, setProfileUser] = useState(null);
//   const dropdownRef = useRef(null);

//   const fetchUserProfile = async (id) => {
//     try {
//       const response = await axios.get(`/users/${id}`);
//       setProfileUser(response.data.user);
//     } catch (error) {
//       console.error("Ошибка при загрузке профиля:", error);
//       if (error.response?.status === 404) {
//         navigate("/not-found");
//       } else {
//         navigate("/error");
//       }
//     }
//   };

//   const handleLogout = async () => {
//     await dispatch(logout());
//     navigate("/");
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchUserProfile(userId);
//     }
//   }, [userId]);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   if (!profileUser) {
//     return <div className="text-center py-10">Загрузка...</div>;
//   }

//   const isOwnProfile = user && user.id === profileUser.id;
//   const isAdmin = user && user.role === "admin";

//   return (
//     <div className="mx-auto">
//       <ConfirmModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={() => {
//           handleLogout();
//           setIsModalOpen(false);
//         }}
//         title="Выход"
//         message="Вы уверены, что хотите выйти?"
//         actionText="Выйти"
//       />
//       <div className="relative pt-15">
//         <Link to="/" className="absolute sm:top-0 sm:left-0 left-0 top-0">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="size-8"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={1.5}
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
//             />
//           </svg>
//         </Link>

//         {isOwnProfile && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="absolute top-0 right-0 px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
//           >
//             Выйти
//           </button>
//         )}

//         <div className="flex items-center justify-center gap-4">
//           <img
//             className="h-40 w-40 rounded-full object-cover"
//             src={profileUser.avatarUrl}
//             alt={`${profileUser.fullname}'s avatar`}
//             onError={(e) => {
//               e.target.src =
//                 "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";
//             }}
//           />
//           <div className="flex flex-col gap-2">
//             <p className="font-bold text-2xl">{profileUser.fullname}</p>
//             {isOwnProfile && (
//               <Link
//                 to="edit-profile"
//                 className="px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
//               >
//                 Редактировать профиль
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//       <nav className="flex gap-2 pb-0.3 my-5">
//         <NavLink
//           to="user-videos"
//           className={({ isActive }) =>
//             `p-2 ${
//               isActive
//                 ? "text-black border-b-2 border-black dark:text-white dark:border-white"
//                 : "text-light-second-text hover:border-b-2 hover:border-light-second-text dark:hover:border-light-second-text"
//             }`
//           }
//         >
//           Видео
//         </NavLink>
//         <NavLink
//           to={isOwnProfile ? "user-playlists" : "public-playlists"}
//           className={({ isActive }) =>
//             `p-2 ${
//               isActive
//                 ? "text-black border-b-2 border-black dark:text-white dark:border-white"
//                 : "text-light-second-text hover:border-b-2 hover:border-light-second-text dark:hover:border-light-second-text"
//             }`
//           }
//         >
//           Плейлисты
//         </NavLink>

//         {isOwnProfile && (
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="mt-2 px-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover focus:outline-none"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="size-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 strokeWidth={1.5}
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
//                 />
//               </svg>
//             </button>

//             {isOpen && (
//               <div className="absolute z-10 right-0 w-48 mt-1 rounded-md shadow-lg bg-white dark:bg-main-dark ring-1 ring-black ring-opacity-5">
//                 <div className="py-1" role="menu">
//                   <Link
//                     to="/profile/add-video"
//                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-hover"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     Добавить видео
//                   </Link>
//                   {isAdmin && (
//                     <Link
//                       to="/admin"
//                       className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-hover"
//                       onClick={() => setIsOpen(false)}
//                     >
//                       Админ-панель
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </nav>
//       <Outlet context={{ profileUser, isOwnProfile }} />
//     </div>
//   );
// }
import Profile from "../components/Profile/Profile";

export default function ProfilePage() {
  return <Profile />;
}
