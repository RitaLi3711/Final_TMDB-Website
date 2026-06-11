import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "@/layouts/MainLayout";
import { RouteGuard } from "@/components";
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
      <Route element={<MainLayout />}>
        <Route element={<HomeView />} path="/" />
        <Route element={<SignInView />} path="/sign-in" />

        <Route element={<Navigate replace to="/movies/category/now_playing" />} path="movies" />
        <Route element={
          <RouteGuard>
            <MoviesView />
          </RouteGuard>
        } path="movies/category/:interval" />

        <Route element={<Navigate replace to="/tv/category/airing_today" />} path="tv" />
        <Route element={
          <RouteGuard>
            <TelevisionView />
          </RouteGuard>
        } path="tv/category/:interval" />

        <Route element={<Navigate replace to="/trending/movie" />} path="trending" />
        <Route element={
          <RouteGuard>
            <TrendingView />
          </RouteGuard>
        } path="trending/:mediaType" />

        <Route element={
          <RouteGuard>
            <GenreView />
          </RouteGuard>
        } path="genre" />
        <Route element={
          <RouteGuard>
            <GenreView />
          </RouteGuard>
        } path="genre/:type/:genreSlug" />

        <Route element={
          <RouteGuard>
            <SearchView />
          </RouteGuard>
        } path="search" />

        <Route element={
          <RouteGuard>
            <PersonView />
          </RouteGuard>
        } path="person/:id">
          <Route element={<Navigate replace to="career" />} index />
          <Route element={<CareerView />} path="career" />
          <Route element={<ImagesView />} path="images" />
        </Route>

        <Route element={
          <RouteGuard>
            <MovieView />
          </RouteGuard>
        } path="movie/:id">
          <Route element={<Navigate replace to="summary" />} index />
          <Route element={<SummaryView />} path="summary" />
          <Route element={<CreditsView />} path="credits" />
          <Route element={<TrailersView />} path="trailers" />
          <Route element={<ReviewsView />} path="reviews" />
        </Route>

        <Route element={
          <RouteGuard>
            <MovieView />
          </RouteGuard>
        } path="tv/:id">
          <Route element={<Navigate replace to="summary" />} index />
          <Route element={<SummaryView />} path="summary" />
          <Route element={<CreditsView />} path="credits" />
          <Route element={<TrailersView />} path="trailers" />
          <Route element={<ReviewsView />} path="reviews" />
          <Route element={<SeasonsView />} path="seasons" />
          <Route element={<EpisodeView />} path="season/:seasonNumber" />
        </Route>

        <Route element={
          <RouteGuard>
            <FavoritesView />
          </RouteGuard>
        } path="favorites" />
        
        <Route element={
          <RouteGuard>
            <CartView />
          </RouteGuard>
        } path="cart" />
        
        <Route element={
          <RouteGuard>
            <SuccessView />
          </RouteGuard>
        } path="success" />

        <Route element={
          <RouteGuard>
            <SettingsView />
          </RouteGuard>
        } path="settings" />

        <Route element={<ErrorView />} path="*" />
      </Route>
    </Routes>
  );
};