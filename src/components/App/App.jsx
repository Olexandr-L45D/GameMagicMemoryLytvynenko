import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "../Loader/Loader";

const HomePage = lazy(() => import("../../pages/HomePage/HomePage"));
const MainPageGame = lazy(() =>
  import("../../pages/MainPageGame/MainPageGame")
);

const NotFoundPage = lazy(() => import("../../pages/NotFoundPage"));

export default function App() {
  return (
    <>
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
