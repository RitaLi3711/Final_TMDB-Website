import { updatePassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AvatarSelector, Button, ButtonGroup } from "@/components";
import { AVATARS, formatPrice, type Message, movieGenres, tvGenres } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const SettingsView = () => {
  const {
    purchases,
    auth,
    userName,
    setUserName,
    moviePreferences,
    setMoviePreferences,
    tvPreferences,
    setTvPreferences,
    avatar,
    setAvatar,
  } = useFirebaseContext();
  const [usernameInput, setUsernameInput] = useState(userName);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const menu = (searchParams.get("menu") as "account" | "purchases") || "account";
  const [genreMessage, setGenreMessage] = useState<Message | null>(null);
  const [nameMessage, setNameMessage] = useState<Message | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<Message | null>(null);

  const saveUsername = async () => {
    if (!usernameInput) {
      setNameMessage({
        category: "username",
        message: "Username cannot be empty",
        type: "error",
      });
      return;
    }

    setUserName(usernameInput.trim());
    setAvatar(selectedAvatar);

    setNameMessage({
      category: "username",
      message: "Profile updated successfully",
      type: "success",
    });
  };

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordMessage({
        category: "password",
        message: "Please fill in both password fields",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        category: "password",
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      if (!auth.currentUser) {
        throw new Error("No user is signed in");
      }

      await updatePassword(auth.currentUser, newPassword);

      setPasswordMessage({
        category: "password",
        message: "Password updated successfully",
        type: "success",
      });

      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setPasswordMessage({
        category: "password",
        message: (error as Error).message,
        type: "error",
      });
    }
  };

  const saveGenrePrefs = async () => {
    const movieCheckboxes = document.querySelectorAll('input[data-type="movie"]');
    const selectedMovies: string[] = [];

    movieCheckboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      if (input.checked) {
        const genre = input.getAttribute("data-genre");
        if (genre) selectedMovies.push(genre);
      }
    });

    const tvCheckboxes = document.querySelectorAll('input[data-type="tv"]');
    const selectedTv: string[] = [];

    tvCheckboxes.forEach((checkbox) => {
      const input = checkbox as HTMLInputElement;
      if (input.checked) {
        const genre = input.getAttribute("data-genre");
        if (genre) selectedTv.push(genre);
      }
    });

    await setMoviePreferences(selectedMovies);
    await setTvPreferences(selectedTv);

    setGenreMessage({
      category: "genre",
      message: "Genre preferences saved successfully",
      type: "success",
    });

    setTimeout(() => setGenreMessage(null), 3000);
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
              <div className="my-4">
                <AvatarSelector
                  avatars={AVATARS}
                  onChange={(avatar) => {
                    setSelectedAvatar(avatar);
                    setNameMessage(null);
                  }}
                  value={selectedAvatar}
                />
              </div>
              <input
                autoComplete="username"
                className="mb-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="username"
                name="username"
                onChange={(event) => {
                  setUsernameInput(event.target.value);
                  setNameMessage(null);
                }}
                type="text"
                value={usernameInput}
              />
              <div className="flex items-center justify-end gap-2">
                {nameMessage && (
                  <p className={nameMessage.type === "error" ? "text-red-400 text-xs" : "text-green-400 text-xs"}>{nameMessage.message}</p>
                )}
                <div className="scale-90">
                  <Button
                    onClick={() => {
                      setUsernameInput(userName);
                      setSelectedAvatar(avatar);
                      setNameMessage(null);
                    }}
                    variant="grey"
                  >
                    Reset
                  </Button>
                </div>
                <div className="scale-90">
                  <Button onClick={saveUsername}>Save</Button>
                </div>
              </div>
            </div>

            {auth.currentUser?.providerData[0]?.providerId === "password" && (
              <div className="rounded-2xl border border-gray-700 bg-gray-900 p-4">
                <h2 className="font-semibold text-lg">Security</h2>
                <p className="mb-4 text-gray-400 text-sm">Change your account password</p>

                <input
                  className="mb-3 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setPasswordMessage(null);
                  }}
                  placeholder="New password"
                  type="password"
                  value={newPassword}
                />

                <input
                  className="mb-4 w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setPasswordMessage(null);
                  }}
                  placeholder="Confirm password"
                  type="password"
                  value={confirmPassword}
                />

                <Button onClick={handlePasswordChange}>Update Password</Button>
                <div className="mt-2">
                  {passwordMessage && (
                    <p className={passwordMessage.type === "error" ? "text-red-400 text-xs" : "text-green-400 text-xs"}>
                      {passwordMessage.message}
                    </p>
                  )}
                </div>
              </div>
            )}
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
                      className="accent-[#BFCC94]"
                      data-genre={slug}
                      data-type="movie"
                      defaultChecked={moviePreferences.includes(slug)}
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
                      className="accent-[#BFCC94]"
                      data-genre={slug}
                      data-type="tv"
                      defaultChecked={tvPreferences.includes(slug)}
                      type="checkbox"
                    />
                    {genreName}
                  </label>
                ))}
              </div>
            </div>

            {genreMessage && (
              <p className={`mt-4 text-center ${genreMessage.type === "error" ? "text-red-400" : "text-green-400"} text-sm`}>
                {genreMessage.message}
              </p>
            )}

            <div className="mt-6 flex justify-center">
              <Button onClick={saveGenrePrefs}>Save Preferences</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-700 p-8">
          <h2 className="mb-6 font-bold text-white text-xl">Orders</h2>

          {purchases.length === 0 ? (
            <div className="py-8 text-center text-gray-400">No purchases yet.</div>
          ) : (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div className="rounded-xl border border-slate-600 bg-[#1b2940] p-4" key={purchase.date}>
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-gray-300 text-sm">{new Date(purchase.date).toLocaleString()}</p>

                    <p className="font-bold text-[#e6aace] text-lg">{formatPrice(purchase.total)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {purchase.items.map((item) => (
                      <img alt={item.primaryText} className="h-20 w-14 rounded object-cover" key={item.id} src={item.imageUrl} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
