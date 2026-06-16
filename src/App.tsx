import { Navigate, Route, Routes } from "react-router-dom";
import { RouteGuard } from "@/components";
import { MainLayout } from "@/layouts/MainLayout";
import {
  CareerView,
  CartView,
  CreditsView,
  EpisodeView,
  ErrorView,
  FavoritesView,
  GenreView,
  HomeView,
  ImagesView,
  MoviesView,
  MovieView,
  PersonView,
  ReviewsView,
  SearchView,
  SeasonsView,
  SettingsView,
  SignInView,
  SuccessView,
  SummaryView,
  TelevisionView,
  TrailersView,
  TrendingView,
} from "@/views";

export const App = () => {
  return (
    <Routes>
      <Route element={<HomeView />} path="/" />

      <Route element={<SignInView />} path="/sign-in" />

      <Route
        element={
          <RouteGuard>
            <MainLayout />
          </RouteGuard>
        }
      >
        <Route element={<Navigate replace to="/movies/category/now_playing" />} path="movies" />
        <Route element={<MoviesView />} path="movies/category/:interval" />
        <Route element={<Navigate replace to="/tv/category/airing_today" />} path="tv" />
        <Route element={<TelevisionView />} path="tv/category/:interval" />
        <Route element={<Navigate replace to="/trending/movie" />} path="trending" />
        <Route element={<TrendingView />} path="trending/:mediaType" />
        <Route element={<GenreView />} path="genre" />
        <Route element={<GenreView />} path="genre/:type/:genreSlug" />
        <Route element={<SearchView />} path="search" />
        <Route element={<PersonView />} path="person/:id">
          <Route element={<Navigate replace to="career" />} index />
          <Route element={<CareerView />} path="career" />
          <Route element={<ImagesView />} path="images" />
        </Route>
        <Route element={<MovieView />} path="movie/:id">
          <Route element={<Navigate replace to="summary" />} index />
          <Route element={<SummaryView />} path="summary" />
          <Route element={<CreditsView />} path="credits" />
          <Route element={<TrailersView />} path="trailers" />
          <Route element={<ReviewsView />} path="reviews" />
        </Route>
        <Route element={<MovieView />} path="tv/:id">
          <Route element={<Navigate replace to="summary" />} index />
          <Route element={<SummaryView />} path="summary" />
          <Route element={<CreditsView />} path="credits" />
          <Route element={<TrailersView />} path="trailers" />
          <Route element={<ReviewsView />} path="reviews" />
          <Route element={<SeasonsView />} path="seasons" />
          <Route element={<EpisodeView />} path="season/:seasonNumber" />
        </Route>
        <Route element={<FavoritesView />} path="favorites" />
        <Route element={<CartView />} path="cart" />
        <Route element={<SuccessView />} path="success" />
        <Route element={<SettingsView />} path="settings" />
        <Route element={<ErrorView />} path="*" />
      </Route>
    </Routes>
  );
};
