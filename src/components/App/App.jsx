import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "../Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const MainPageGame = lazy(() =>
  import("../../pages/MainPageGame/MainPageGame")
);

const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

export default function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.info(
        "Hello! For convenience, rotate the screen horizontally and click"
      );
    }, 2000);

    return () => clearTimeout(timer); // на всяк випадок чистимо
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={4000} // 4 seconds timer
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/mainpagegame" element={<MainPageGame />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
