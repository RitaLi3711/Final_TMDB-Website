import { updatePassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, ButtonGroup } from "@/components";
import { movieGenres, tvGenres } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const SettingsView = () => {
  const { auth, userName, setUserName, movieGenrePref, setMovieGenrePref, tvGenrePref, setTvGenrePref } = useFirebaseContext();
  const [usernameInput, setUsernameInput] = useState(userName);
  const [nameSuccess, setNameSuccess] = useState("");
  const [nameError, setNameError] = useState("");

  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const menu = (searchParams.get("menu") as "account" | "purchases") || "account";

  useEffect(() => {
    setUsernameInput(userName);
  }, [userName]);

  useEffect(() => {
    navigate(`/settings?menu=${menu}`, { replace: true });
  }, [menu, navigate]);

  const toggleGenre = (genreSlug: string, currentPreferences: string[], updatePreferences: (slugs: string[]) => void) => {
    updatePreferences(
      currentPreferences.includes(genreSlug) ? currentPreferences.filter((slug) => slug !== genreSlug) : [...currentPreferences, genreSlug],
    );
  };

  const saveUsername = () => {
    if (!usernameInput) {
      setNameError("Username cannot be empty");
      setNameSuccess("");
      return;
    }

    setUserName(usernameInput.trim());
    setNameSuccess("Profile updated successfully");
    setNameError("");
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError("Please fill in both password fields");
      setPasswordSuccess("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setPasswordSuccess("");
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("No user is signed in");
      }

      await updatePassword(auth.currentUser, newPassword);

      setPasswordSuccess("Password updated successfully");
      setPasswordError("");

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordError((error as Error).message);
      setPasswordSuccess("");
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-5 p-5">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl text-white">Settings</h1>

        <ButtonGroup
          onClick={(value) => navigate(`/settings?menu=${value}`, { replace: true })}
          options={[
            { label: "Account", value: "account" },
            { label: "Purchases", value: "purchases" },
          ]}
          value={menu}
        />
      </div>

      {menu === "account" ? (
        <div className="flex items-start gap-8">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
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
                  setNameSuccess("");
                  setNameError("");
                }}
                type="text"
                value={usernameInput}
              />

              <div className="flex items-center justify-end gap-2">
                {nameSuccess && <p className="text-green-400 text-xs">{nameSuccess}</p>}

                {nameError && <p className="text-red-400 text-xs">{nameError}</p>}
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

            <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
              <h2 className="font-semibold text-lg">Security</h2>
              <p className="mb-4 text-gray-400 text-sm">Change your account password</p>

              <input
                className="mb-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setPasswordSuccess("");
                  setPasswordError("");
                }}
                placeholder="New password"
                type="password"
                value={newPassword}
              />

              <input
                className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setPasswordSuccess("");
                  setPasswordError("");
                }}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />

              <Button onClick={handlePasswordChange}>Update Password</Button>
              <div className="mt-2">
                {passwordSuccess && <p className="text-green-400 text-xs">{passwordSuccess}</p>}

                {passwordError && <p className="text-red-400 text-xs">{passwordError}</p>}
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
      ) : (
        <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6">
          <h2 className="font-semibold text-lg">Orders</h2>
          <p className="text-gray-400 text-sm">No purchases yet.</p>
        </div>
      )}
    </section>
  );
};
