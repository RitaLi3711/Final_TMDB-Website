import { useEffect, useState } from "react";
import { Button } from "@/components";
import { movieGenres, tvGenres } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const SettingsView = () => {
  const { userName, setUserName, movieGenrePref, setMovieGenrePref, tvGenrePref, setTvGenrePref } = useFirebaseContext();
  const [usernameInput, setUsernameInput] = useState(userName);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setUsernameInput(userName);
  }, [userName]);

  const toggleGenre = (genreSlug: string, currentPreferences: string[], updatePreferences: (slugs: string[]) => void) => {
    updatePreferences(
      currentPreferences.includes(genreSlug) ? currentPreferences.filter((slug) => slug !== genreSlug) : [...currentPreferences, genreSlug],
    );
  };

  const saveUsername = () => {
    if (!usernameInput) {
      setErrorMessage("Username cannot be empty");
      setSuccessMessage("");
      return;
    }
    setUserName(usernameInput.trim());
    setSuccessMessage("Profile updated successfully");
    setErrorMessage("");
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl text-white">Settings</h1>
      </div>

      <div className="flex items-start gap-8">
        <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-4">
          <h2 className="font-semibold text-lg">Profile</h2>
          <p className="mb-2 text-gray-400 text-sm">Update your display profile</p>

          <label className="text-gray-300 text-sm" htmlFor="username">
            Username
          </label>
          <input
            autoComplete="username"
            className="mb-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="username"
            name="username"
            onChange={(event) => {
              setUsernameInput(event.target.value);
              setSuccessMessage("");
              setErrorMessage("");
            }}
            type="text"
            value={usernameInput}
          />

          <div className="flex items-center justify-end gap-2">
            {successMessage && <p className="text-green-400 text-xs">{successMessage}</p>}
            {errorMessage && <p className="text-red-400 text-xs">{errorMessage}</p>}
            <div className="scale-90">
              <Button onClick={() => setUsernameInput(userName)} variant="grey">
                Reset
              </Button>
            </div>
            <div className="scale-90">
              <Button onClick={saveUsername}>Save</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="font-semibold text-lg">Preferences</h2>
          <p className="text-gray-400 text-sm">Choose genres you like</p>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-sm text-white">Movies</h3>
            <div className="grid grid-cols-3 gap-y-2">
              {movieGenres.map(({ value: genreId, label: genreName, slug }) => (
                <label className="flex items-center gap-2 text-sm" key={genreId}>
                  <input
                    checked={movieGenrePref.includes(slug)}
                    className="accent-[#BFCC94]"
                    onChange={() => toggleGenre(slug, movieGenrePref, setMovieGenrePref)}
                    type="checkbox"
                  />
                  {genreName}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-sm text-white">TV</h3>
            <div className="grid grid-cols-3 gap-y-2">
              {tvGenres.map(({ value: genreId, label: genreName, slug }) => (
                <label className="flex items-center gap-2 text-sm" key={genreId}>
                  <input
                    checked={tvGenrePref.includes(slug)}
                    className="accent-[#BFCC94]"
                    onChange={() => toggleGenre(slug, tvGenrePref, setTvGenrePref)}
                    type="checkbox"
                  />
                  {genreName}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
