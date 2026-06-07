import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "@/context";
import type { ImageCell } from "@/core";
import { movieGenres, tvGenres } from "@/core";

const firebaseConfig = {
  apiKey: "AIzaSyCeOsh0QCApUiQfwcPeOf8mhsZTxmEgivg",
  appId: "1:875852523536:web:d06ab57ebf086886fe4295",
  authDomain: "summative-4f2ac.firebaseapp.com",
  measurementId: "G-JS87V3JGSP",
  messagingSenderId: "875852523536",
  projectId: "summative-4f2ac",
  storageBucket: "summative-4f2ac.firebasestorage.app",
};

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<Map<number, ImageCell>>(new Map());
  const [cart, setCart] = useState<Map<number, ImageCell>>(new Map());
  const [movieGenrePref, setMovieGenrePref] = useState<string[]>([]);
  const [tvGenrePref, setTvGenrePref] = useState<string[]>([]);

  const { auth, firestore } = useMemo(() => {
    const app = initializeApp(firebaseConfig);
    return { auth: getAuth(app), firestore: getFirestore(app) };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(firestore, "users", user.uid));
          const userData = snapshot.data();
          const favoritesData = userData?.favorites || {};
          const cartData = userData?.cart || {};
          const moviePrefs = userData?.movieGenrePref || movieGenres.map((genre) => genre.slug);
          const tvPrefs = userData?.tvGenrePref || tvGenres.map((genre) => genre.slug);

          setUser(user);
          setFavorites(new Map(Object.entries(favoritesData).map(([k, v]) => [Number(k), v as unknown as ImageCell])));
          setCart(new Map(Object.entries(cartData).map(([k, v]) => [Number(k), v as unknown as ImageCell])));
          setMovieGenrePref(moviePrefs);
          setTvGenrePref(tvPrefs);
        } else {
          setUser(null);
          setFavorites(new Map());
          setCart(new Map());
          setMovieGenrePref(movieGenres.map((genre) => genre.slug));
          setTvGenrePref(tvGenres.map((genre) => genre.slug));
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

  const setUserName = async (name: string) => {
    await refreshUser({ displayName: name });
  };

  const toggleFavorite = async (image: ImageCell) => {
    const next = new Map(favorites);
    next.has(image.id) ? next.delete(image.id) : next.set(image.id, image);
    setFavorites(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), {
        cart: Object.fromEntries(cart),
        favorites: Object.fromEntries(next),
        movieGenrePref,
        tvGenrePref,
      });
    }
  };

  const addToCart = async (image: ImageCell) => {
    const next = new Map(cart);
    next.set(image.id, image);
    setCart(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), {
        cart: Object.fromEntries(next),
        favorites: Object.fromEntries(favorites),
        movieGenrePref,
        tvGenrePref,
      });
    }
  };

  const removeFromCart = async (id: number) => {
    const next = new Map(cart);
    next.delete(id);
    setCart(next);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), {
        cart: Object.fromEntries(next),
        favorites: Object.fromEntries(favorites),
        movieGenrePref,
        tvGenrePref,
      });
    }
  };

  const clearCart = async () => {
    setCart(new Map());
    if (user) {
      await setDoc(doc(firestore, "users", user.uid), {
        cart: {},
        favorites: Object.fromEntries(favorites),
        movieGenrePref,
        tvGenrePref,
      });
    }
  };

  const clearFavoritesByType = async (mediaType: "movie" | "tv") => {
    const newFavorites = new Map(favorites);
    for (const [id, item] of favorites) {
      if (item.media === mediaType) {
        newFavorites.delete(id);
      }
    }
    setFavorites(newFavorites);

    if (user) {
      await setDoc(doc(firestore, "users", user.uid), {
        cart: Object.fromEntries(cart),
        favorites: Object.fromEntries(newFavorites),
        movieGenrePref,
        tvGenrePref,
      });
    }
  };

  const userName = user?.displayName || user?.email?.split("@")[0] || "Guest";

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <FirebaseContext.Provider
      value={{
        addToCart,
        auth,
        cart,
        clearCart,
        clearFavoritesByType,
        favorites,
        firestore,
        movieGenrePref,
        refreshUser,
        removeFromCart,
        setMovieGenrePref,
        setTvGenrePref,
        setUser,
        setUserName,
        toggleFavorite,
        tvGenrePref,
        user,
        userName,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
