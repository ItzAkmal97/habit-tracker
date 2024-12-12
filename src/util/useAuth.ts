import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setIsLoggedIn } from "../features/authenticationSlice";
import { auth } from "../util/firebaseConfig";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<null | any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        dispatch(setIsLoggedIn(true));
      } else {
        setUser(null);
        dispatch(setIsLoggedIn(false));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return {isLoading, user};
};
