import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, type User, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "@/context";
import type { ImageCell, Purchase } from "@/core";
import { movieGenres, tvGenres } from "@/core";
import { useLocalStorage } from "@/hooks";

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
  const [favoritesStorage, setFavoritesStorage] = useLocalStorage<[number, ImageCell][]>("favorites", []);
  const [cartStorage, setCartStorage] = useLocalStorage<[number, ImageCell][]>("cart", []);

  const favorites = new Map(favoritesStorage);
  const cart = new Map(cartStorage);

  // Changed to match teacher's naming
  const [moviePreferences, setMoviePreferencesState] = useState<string[]>([]);
  const [tvPreferences, setTvPreferencesState] = useState<string[]>([]);
  const [userNameState, setUserNameState] = useState<string>("Guest");
  const [avatar, setAvatarState] = useState<string>("");
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const { auth, firestore } = useMemo(() => {
    const app = initializeApp(firebaseConfig);
    return { auth: getAuth(app), firestore: getFirestore(app) };
  }, []);
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setCartStorage([]);
    setFavoritesStorage([]);
    navigate("/sign-in");
  };

  // Changed to use moviePreferences/tvPreferences
  const saveToFirestore = async (updates: { moviePreferences?: string[]; tvPreferences?: string[]; purchases?: Purchase[] }) => {
    if (!user) return;

    const dataToSave: {
      moviePreferences?: string[];
      tvPreferences?: string[];
      purchases?: Purchase[];
    } = {};

    if (updates.moviePreferences !== undefined) dataToSave.moviePreferences = updates.moviePreferences;
    if (updates.tvPreferences !== undefined) dataToSave.tvPreferences = updates.tvPreferences;
    if (updates.purchases !== undefined) dataToSave.purchases = updates.purchases;

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

          // Changed to moviePreferences/tvPreferences
          setMoviePreferencesState(userData?.moviePreferences || movieGenres.map((g) => g.slug));
          setTvPreferencesState(userData?.tvPreferences || tvGenres.map((g) => g.slug));
          setAvatarState(user.photoURL || "");
          setPurchases(userData?.purchases || []);
        } else {
          setUser(null);
          setMoviePreferencesState(movieGenres.map((g) => g.slug));
          setTvPreferencesState(tvGenres.map((g) => g.slug));
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

  const completePurchase = async (purchase: Purchase) => {
    if (!user) return;

    const updatedPurchases = [purchase, ...purchases];

    await setDoc(
      doc(firestore, "users", user.uid),
      {
        purchases: updatedPurchases,
      },
      { merge: true },
    );

    setPurchases(updatedPurchases);
    setCartStorage([]);
  };

  // Changed to setMoviePreferences/setTvPreferences
  const setMoviePreferences = async (genres: string[]) => {
    setMoviePreferencesState(genres);
    await saveToFirestore({ moviePreferences: genres });
  };

  const setTvPreferences = async (genres: string[]) => {
    setTvPreferencesState(genres);
    await saveToFirestore({ tvPreferences: genres });
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

    if (auth.currentUser) {
      await updateProfile(auth.currentUser, { photoURL: newAvatar });
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    }
  };

  const toggleFavorite = async (image: ImageCell) => {
    const map = new Map(favorites);
    if (map.has(image.id)) {
      map.delete(image.id);
    } else {
      map.set(image.id, image);
    }
    setFavoritesStorage(Array.from(map.entries()));
  };

  const addToCart = async (image: ImageCell) => {
    const map = new Map(cart);
    map.set(image.id, image);
    setCartStorage(Array.from(map.entries()));
  };

  const removeFromCart = async (id: number) => {
    const map = new Map(cart);
    map.delete(id);
    setCartStorage(Array.from(map.entries()));
  };

  const clearCart = async () => {
    setCartStorage([]);
  };

  const clearFavoritesByType = async (mediaType: "movie" | "tv") => {
    const newFavorites = Array.from(favoritesStorage).filter(([_, item]) => item.media !== mediaType);
    setFavoritesStorage(newFavorites);
  };

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;

  return (
    <FirebaseContext.Provider
      value={{
        addToCart,
        auth,
        avatar,
        cart,
        clearCart,
        clearFavoritesByType,
        completePurchase,
        favorites,
        firestore,
        loading,
        logout,
        moviePreferences, // Changed
        purchases,
        refreshUser,
        removeFromCart,
        setAvatar,
        setMoviePreferences, // Changed
        setTvPreferences, // Changed
        setUser,
        setUserName,
        toggleFavorite,
        tvPreferences, // Changed
        user,
        userName: userNameState,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
