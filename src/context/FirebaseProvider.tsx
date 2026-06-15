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
    await setDoc(doc(firestore, "users", user.uid), updates, { merge: true });
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
    await saveToFirestore({ purchases: updatedPurchases });
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

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!auth.currentUser) return;
    try {
      await updateProfile(auth.currentUser, updates);
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const setUserName = (name: string) => updateUserProfile({ displayName: name });
  const setAvatar = (newAvatar: string) => updateUserProfile({ photoURL: newAvatar });

  const toggleFavorite = (image: ImageCell) => {
    const map = new Map(favorites);
    map.has(image.id) ? map.delete(image.id) : map.set(image.id, image);
    setFavoritesStorage(Array.from(map.entries()));
  };

  const addToCart = (image: ImageCell) => {
    const map = new Map(cart);
    map.set(image.id, image);
    setCartStorage(Array.from(map.entries()));
  };

  const clearCart = () => setCartStorage([]);

  const removeFromCart = (id: number) => {
    setCartStorage((prev) => prev.filter(([itemId]) => itemId !== id));
  };

  const clearFavoritesByType = (mediaType: "movie" | "tv") => {
    setFavoritesStorage((prev) => prev.filter(([_, item]) => item.media !== mediaType));
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
        refreshUser: updateUserProfile,
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
