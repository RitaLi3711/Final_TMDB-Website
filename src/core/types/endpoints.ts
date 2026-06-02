export type CreditsResponse = {
  cast: Array<{
    id: number;
    name: string;
    profile_path: string | null;
    character: string;
  }>;
};

type CreditBase = {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
};

export type Episode = {
  id: number;
  still_path: string | null;
  episode_number: number;
  name: string;
  air_date: string;
  overview: string;
};

export type GenreResponse = {
  results: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    release_date?: string;
  }>;
  total_pages: number;
  page: number;
};
export type MovieResponse = {
  id: number;
  title: string;
  tagline: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;

  genres: Array<{
    id: number;
    name: string;
  }>;

  runtime: number;

  videos?: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
};

export type MoviesResponse = {
  results: Array<{
    id: number;
    original_title: string;
    poster_path: string;
    release_date: string;
  }>;
  total_pages: number;
};

export type PersonCareerResponse = {
  cast: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string | null;
    character: string;
  }>;
};

export type PersonImagesResponse = {
  profiles: Array<{ file_path: string }>;
};

export type PersonResponse = {
  id: number;
  name: string;
  profile_path: string | null;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  also_known_as: string[];
  combined_credits: {
    cast: Array<
      CreditBase & {
        character: string;
      }
    >;
    crew: Array<
      CreditBase & {
        job: string;
      }
    >;
  };
};

export type ReviewsResponse = {
  results: Array<{
    id: string;
    author: string;
    content: string;
  }>;
};

export type SearchResponse = {
  results: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path?: string | null;
    profile_path?: string | null;
    media_type: string;
  }>;
  total_pages: number;
  total_results: number;
};

export type SeasonData = {
  air_date: string;
  episodes: Episode[];
  overview: string;
};

export type TelevisionResponse = {
  results: Array<{
    id: number;
    name: string;
    original_name: string;
    poster_path: string;
  }>;
  total_pages: number;
};

export type TrailerResponse = {
  videos?: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
};

export type TrendingResponse = {
  results: Array<{
    id: number;
    title?: string;
    name?: string;
    poster_path: string;
    media_type: "movie" | "tv";
    release_date?: string;
  }>;
  total_pages: number;
  page: number;
};

export type TvDetailsResponse = {
  id: number;
  name: string;
  tagline: string;
  status: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  number_of_episodes: number;
  number_of_seasons: number;

  genres: Array<{
    id: number;
    name: string;
  }>;

  seasons: Array<{
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string | null;
  }>;

  videos?: {
    results: Array<{
      key: string;
      name: string;
      site: string;
      type: string;
    }>;
  };
};
