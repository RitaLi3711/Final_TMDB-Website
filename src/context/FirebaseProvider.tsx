import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, type User, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { FirebaseContext } from "@/context";
import type { ImageCell, Purchase } from "@/core";
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
  const [movieGenrePref, setMovieGenrePrefState] = useState<string[]>([]);
  const [tvGenrePref, setTvGenrePrefState] = useState<string[]>([]);
  const [userNameState, setUserNameState] = useState<string>("Guest");
  const [avatar, setAvatarState] = useState<string>("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { auth, firestore } = useMemo(() => {
    const app = initializeApp(firebaseConfig);
    return { auth: getAuth(app), firestore: getFirestore(app) };
  }, []);

  const saveToFirestore = async (updates: {
    favorites?: Map<number, ImageCell>;
    cart?: Map<number, ImageCell>;
    movieGenrePref?: string[];
    tvGenrePref?: string[];
    avatar?: string;
    purchases?: Purchase[];
  }) => {
    if (!user) return;

    const dataToSave = {
      avatar: updates.avatar ?? avatar,
      cart: Object.fromEntries(updates.cart ?? cart),
      favorites: Object.fromEntries(updates.favorites ?? favorites),
      movieGenrePref: updates.movieGenrePref ?? movieGenrePref,
      purchases: updates.purchases ?? purchases,
      tvGenrePref: updates.tvGenrePref ?? tvGenrePref,
    };

    await setDoc(doc(firestore, "users", user.uid), dataToSave, { merge: true });
  };

  useEffect(() => {
    const name = user?.displayName || user?.email?.split("@")[0] || "Guest";
    setUserNameState(name);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(firestore, "users", user.uid));
          const userData = snapshot.data();

          setUser(user);
          setFavorites(new Map(Object.entries(userData?.favorites || {}).map(([k, v]) => [Number(k), v as ImageCell])));
          setCart(new Map(Object.entries(userData?.cart || {}).map(([k, v]) => [Number(k), v as ImageCell])));
          setMovieGenrePrefState(userData?.movieGenrePref || movieGenres.map((g) => g.slug));

          setTvGenrePrefState(userData?.tvGenrePref || tvGenres.map((g) => g.slug));
          setAvatarState(userData?.avatar || "");
          setPurchases(userData?.purchases || []);
        } else {
          setUser(null);
          setFavorites(new Map());
          setCart(new Map());
          setMovieGenrePrefState(movieGenres.map((g) => g.slug));
          setTvGenrePrefState(tvGenres.map((g) => g.slug));
          setAvatarState("");
          setPurchases([]);
        }
      } catch (error) {
        console.error("User sync error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const addPurchase = async (purchase: Purchase) => {
    const next = [purchase, ...purchases];

    setPurchases(next);

    await saveToFirestore({
      purchases: next,
    });
  };

  const setMovieGenrePref = async (genres: string[]) => {
    setMovieGenrePrefState(genres);

    await saveToFirestore({
      movieGenrePref: genres,
    });
  };

  const setTvGenrePref = async (genres: string[]) => {
    setTvGenrePrefState(genres);

    await saveToFirestore({
      tvGenrePref: genres,
    });
  };

  const refreshUser = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return;

    try {
      await updateProfile(auth.currentUser, updates);
      await auth.currentUser.reload();
      const updatedUser = auth.currentUser;
      setUser({ ...updatedUser });
      const newName = updatedUser.displayName || updatedUser.email?.split("@")[0] || "Guest";
      setUserNameState(newName);
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const setUserName = (name: string) => refreshUser({ displayName: name });
  const setAvatar = async (newAvatar: string) => {
    setAvatarState(newAvatar);
    await saveToFirestore({ avatar: newAvatar });
  };

  const toggleFavorite = async (image: ImageCell) => {
    const next = new Map(favorites);
    next.has(image.id) ? next.delete(image.id) : next.set(image.id, image);
    setFavorites(next);
    await saveToFirestore({ favorites: next });
  };

  const addToCart = async (image: ImageCell) => {
    const next = new Map(cart);
    next.set(image.id, image);
    setCart(next);
    await saveToFirestore({ cart: next });
  };

  const removeFromCart = async (id: number) => {
    const next = new Map(cart);
    next.delete(id);
    setCart(next);
    await saveToFirestore({ cart: next });
  };

  const clearCart = async () => {
    setCart(new Map());
    await saveToFirestore({ cart: new Map() });
  };

  const clearFavoritesByType = async (mediaType: "movie" | "tv") => {
    const newFavorites = new Map(favorites);
    for (const [id, item] of favorites) {
      if (item.media === mediaType) newFavorites.delete(id);
    }
    setFavorites(newFavorites);
    await saveToFirestore({ favorites: newFavorites });
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <FirebaseContext.Provider
      value={{
        addPurchase,
        addToCart,
        auth,
        avatar,
        cart,
        clearCart,
        clearFavoritesByType,
        favorites,
        firestore,
        movieGenrePref,
        purchases,
        refreshUser,
        removeFromCart,
        setAvatar,
        setMovieGenrePref,
        setTvGenrePref,
        setUser,
        setUserName,
        toggleFavorite,
        tvGenrePref,
        user,
        userName: userNameState,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
