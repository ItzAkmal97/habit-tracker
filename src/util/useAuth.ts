import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { setIsLoggedIn } from "../features/authenticationSlice";
import { auth } from "../util/firebaseConfig";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setIsLoggedIn(true));
      } else {
        dispatch(setIsLoggedIn(false));
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  return isLoading;
};
