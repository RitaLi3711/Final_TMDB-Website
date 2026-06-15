import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, type User, updateProfile } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FirebaseContext } from "@/context";
import { CART_KEY, DEFAULT_GENRES, FAVORITES_KEY, type ImageCell, type Purchase } from "@/core";
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
  const [favoritesStorage, setFavoritesStorage] = useLocalStorage<[number, ImageCell][]>(FAVORITES_KEY, []);
  const [cartStorage, setCartStorage] = useLocalStorage<[number, ImageCell][]>(CART_KEY, []);

  const favorites = new Map(favoritesStorage);
  const cart = new Map(cartStorage);

  const [moviePreferences, setMoviePreferencesState] = useState<string[]>(DEFAULT_GENRES.movie);
  const [tvPreferences, setTvPreferencesState] = useState<string[]>(DEFAULT_GENRES.tv);
  const userName = user?.displayName || user?.email?.split("@")[0] || "Guest";
  const avatar = user?.photoURL || "";
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const snapshot = await getDoc(doc(firestore, "users", user.uid));
          const userData = snapshot.data();

          setUser(user);

          setMoviePreferencesState(userData?.moviePreferences || DEFAULT_GENRES.movie);
          setTvPreferencesState(userData?.tvPreferences || DEFAULT_GENRES.tv);
          setPurchases(userData?.purchases || []);
        } else {
          setUser(null);
          setMoviePreferencesState(DEFAULT_GENRES.movie);
          setTvPreferencesState(DEFAULT_GENRES.tv);
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
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const setUserName = (name: string) => refreshUser({ displayName: name });
  const setAvatar = async (newAvatar: string) => {
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
        moviePreferences,
        purchases,
        refreshUser,
        removeFromCart,
        setAvatar,
        setMoviePreferences,
        setTvPreferences,
        setUser,
        setUserName,
        toggleFavorite,
        tvPreferences,
        user,
        userName,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
