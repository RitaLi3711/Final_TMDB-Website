import type { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "@/components";
import { AVATARS, ICON_SIZE, type Message, movieGenres, tvGenres } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const SignInView = () => {
  const navigate = useNavigate();
  const { auth, setUser, firestore } = useFirebaseContext();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, _setAvatar] = useState(AVATARS[0]);
  const [errorMessage, setErrorMessage] = useState<Message | null>(null);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (isRegister && password !== confirmPassword) {
      setErrorMessage({
        category: "auth",
        message: "Passwords do not match",
        type: "error",
      });
      return;
    }

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: username, photoURL: avatar });

        await setDoc(doc(firestore, "users", user.uid), {
          moviePreferences: movieGenres.map((g) => g.slug),
          purchases: [],
          tvPreferences: tvGenres.map((g) => g.slug),
        });

        await user.reload();
        setUser(user);
      } else {
        setUser((await signInWithEmailAndPassword(auth, email, password)).user);
      }

      navigate("/movies/category/now_playing");
    } catch (error) {
      console.error("Firebase auth submit failed:", error);
      setErrorMessage({
        category: "auth",
        message: (error as FirebaseError).message,
        type: "error",
      });
    }
  };

  const handleGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (!user) {
        throw new Error("No user returned from Google sign-in");
      }

      await user.reload();
      const refreshedUser = auth.currentUser;

      if (!refreshedUser) {
        throw new Error("Failed to reload user");
      }

      const { getDoc } = await import("firebase/firestore");
      const userDoc = await getDoc(doc(firestore, "users", refreshedUser.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(firestore, "users", refreshedUser.uid), {
          moviePreferences: movieGenres.map((g) => g.slug),
          purchases: [],
          tvPreferences: tvGenres.map((g) => g.slug),
        });
      }

      setUser(refreshedUser);
      navigate("/movies/category/now_playing");
    } catch (error) {
      console.error("Firebase OAuth sign-in failed:", error);
      setErrorMessage({
        category: "auth",
        message: (error as FirebaseError).message,
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <main className="flex flex-1 flex-col items-center justify-center space-y-5 p-5">
        <form className="max-w-md space-y-4 rounded-xl bg-gray-800 p-5" onSubmit={handleSubmit}>
          <h1 className="font-bold text-2xl">{isRegister ? "Create Account" : "Sign In"}</h1>
          {errorMessage && (
            <p className={errorMessage.type === "error" ? "text-red-400 text-sm" : "text-green-400 text-sm"}>{errorMessage.message}</p>
          )}{" "}
          <input
            autoComplete="email"
            className="w-full rounded bg-gray-700 p-2"
            id="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
          <input
            autoComplete={isRegister ? "new-password" : "current-password"}
            className="w-full rounded bg-gray-700 p-2"
            id="password"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          {isRegister && (
            <>
              <input
                autoComplete="new-password"
                className="w-full rounded bg-gray-700 p-2"
                id="confirm-password"
                name="confirm-password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />
              <input
                autoComplete="username"
                className="w-full rounded bg-gray-700 p-2"
                id="username"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                value={username}
              />
            </>
          )}
          <button className="w-full rounded bg-blue-600 p-2">{isRegister ? "Register" : "Sign In"}</button>
          <button
            className="flex w-full items-center justify-center gap-2 rounded bg-white p-2 text-black"
            onClick={handleGoogle}
            type="button"
          >
            <FcGoogle size={ICON_SIZE} />
            Continue with Google
          </button>
          <p className="text-center text-gray-400 text-sm">
            {isRegister ? (
              <>
                Already have an account?{" "}
                <span
                  className="cursor-pointer text-blue-400 underline hover:text-white hover:underline"
                  onClick={() => setIsRegister(false)}
                >
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <span
                  className="cursor-pointer text-blue-400 underline hover:text-white hover:underline"
                  onClick={() => setIsRegister(true)}
                >
                  Register
                </span>
              </>
            )}
          </p>
        </form>
      </main>
    </div>
  );
};
