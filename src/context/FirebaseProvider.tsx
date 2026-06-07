import { FirebaseContext } from "@/context";
import type { ImageCell, UserDocument } from "@/core";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

const firebaseConfig = {
  // Your Firebase configuration goes here
};

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Map<number, ImageCell>>(new Map());

  const { auth, firestore } = useMemo(() => {
    const app = initializeApp(firebaseConfig);

    return { auth: getAuth(app), firestore: getFirestore(app) };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(firestore, "users", user.uid));
          const favoritesData: UserDocument = snapshot.exists() ? snapshot.data().favorites : {};
          setUser(user);
          setFavorites(new Map(Object.entries(favoritesData).map(([k, v]) => [Number(k), v as unknown as ImageCell])));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("User sync error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const refreshUser = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) {
      return;
    }

    try {
      await updateProfile(auth.currentUser, updates);
      await auth.currentUser.reload();
      setUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const toggleFavorite = async (image: ImageCell) => {
    const next = new Map(favorites);
    next.has(image.id) ? next.delete(image.id) : next.set(image.id, image);

    setFavorites(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), { favorites: Object.fromEntries(next) });
    }
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <FirebaseContext.Provider
      value={{
        auth,
        favorites,
        firestore,
        refreshUser,
        setUser,
        toggleFavorite,
        user,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};