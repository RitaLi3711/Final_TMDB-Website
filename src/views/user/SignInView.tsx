import type { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { AvatarSelector } from "@/components";
import { AVATARS, ICON_SIZE, movieGenres, tvGenres } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const SignInView = () => {
  const navigate = useNavigate();
  const { auth, setUser, firestore } = useFirebaseContext();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [error, setError] = useState("");

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update Firebase Auth profile
        await updateProfile(user, { displayName: username, photoURL: avatar });

        // Create Firestore document with avatar and default preferences
        await setDoc(doc(firestore, "users", user.uid), {
          avatar: avatar,
          movieGenrePref: movieGenres.map((g) => g.slug),
          purchases: [],
          tvGenrePref: tvGenres.map((g) => g.slug),
        });

        await user.reload();
        setUser(user);
      } else {
        setUser((await signInWithEmailAndPassword(auth, email, password)).user);
      }

      navigate("/movies/category/now_playing");
    } catch (error) {
      console.error("Firebase auth submit failed:", error);
      setError((error as FirebaseError).message);
    }
  };

  const handleGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = userCredential.user;

      // Check if user has a Firestore document, if not create one
      const { getDoc } = await import("firebase/firestore");
      const userDoc = await getDoc(doc(firestore, "users", user.uid));

      if (!userDoc.exists()) {
        await setDoc(doc(firestore, "users", user.uid), {
          avatar: user.photoURL || "",
          movieGenrePref: movieGenres.map((g) => g.slug),
          purchases: [],
          tvGenrePref: tvGenres.map((g) => g.slug),
        });
      }

      setUser(user);
      navigate("/movies/category/now_playing");
    } catch (error) {
      console.error("Firebase OAuth sign-in failed:", error);
      setError((error as FirebaseError).message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <main className="flex flex-1 flex-col items-center justify-center space-y-5 p-5">
        <form className="max-w-md space-y-4 rounded-xl bg-gray-800 p-5" onSubmit={handleSubmit}>
          <h1 className="font-bold text-2xl">{isRegister ? "Create Account" : "Sign In"}</h1>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <input
            className="w-full rounded bg-gray-700 p-2"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            type="email"
            value={email}
          />
          <input
            className="w-full rounded bg-gray-700 p-2"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          {isRegister && (
            <>
              <input
                className="w-full rounded bg-gray-700 p-2"
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm password"
                type="password"
                value={confirmPassword}
              />
              <input
                className="w-full rounded bg-gray-700 p-2"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                value={username}
              />
              <AvatarSelector avatars={AVATARS} onChange={setAvatar} value={avatar} />
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
