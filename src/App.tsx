import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts";
import { ErrorView, HomeView } from "@/views";

export const App = () => {
  return (
    <Routes>
      <Route element={<HomeView />} path="/" />
      <Route element={<MainLayout />}></Route>
      <Route element={<ErrorView />} path="*" />
    </Routes>
  );
};
