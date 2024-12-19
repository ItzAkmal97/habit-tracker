import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../util/firebaseConfig";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../util/firebaseConfig";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff, } from "lucide-react";
import {
  setShowPassword,
  setShowToast,
  setToastColor,
  setToastMessage,
} from "../features/loginSignupSlice";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setIsLoggedIn } from "../features/authenticationSlice";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "./ui/toast";
import { Loader2 } from "lucide-react";
type LoginData = {
  email: string;
  password: string;
};

function LoginPage() {
  const { showToast, showPassword, toastColor, toastMessage } = useSelector(
    (state: RootState) => state.loginSignup
  );

  const [isLoginLoading, setIsLoginLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setIsLoggedIn(true));
        navigate("/dashboard");
      } else {
        dispatch(setIsLoggedIn(false));
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [dispatch, navigate]);

  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
  });

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      const userGoogleAuth = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );

      if (userGoogleAuth.user) {
        const username = userGoogleAuth.user.displayName;
        const email = userGoogleAuth.user.email;
        const photoURL = userGoogleAuth.user.photoURL;

        if (username && email && photoURL) {
          localStorage.setItem("username", username);
          localStorage.setItem("email", email);
          localStorage.setItem("photoURL", photoURL);
        }

        setIsGoogleLoading(false);
        dispatch(setIsLoggedIn(true));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error(typeof error, error);

      if (error instanceof FirebaseError) {
        dispatch(setShowToast(true));
        dispatch(setToastMessage("Google Login Failed, Please Try Again"));
        dispatch(setToastColor("destructive"));
      } else {
        dispatch(setShowToast(true));
        dispatch(
          setToastMessage("An Unexpected Error Occurred, Please Try Again")
        );
        dispatch(setToastColor("destructive"));
      }
    }
  };

  const onSubmit = async (data: LoginData) => {
    try {
      setIsLoginLoading(true);
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userId = userCredentials.user.uid;

      const userDoc = await getDoc(doc(db, "users", userId));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData) {
          localStorage.setItem("username", userData.username);
          localStorage.setItem("email", userData.email);
        }
        const localLoggedin = dispatch(setIsLoggedIn(true));
        localStorage.setItem("isLoggedIn", JSON.stringify(localLoggedin));
        setIsLoginLoading(false);
        navigate("/dashboard");
      } else {
        console.log("No User Document Found");
      }

    } catch (error: unknown) {
      console.error(typeof error, error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/invalid-credential"
      ) {
        dispatch(
          setToastMessage("Invalid Email or Password, Please Try Again")
        );
        dispatch(setToastColor("destructive"));
        dispatch(setShowToast(true));
      } else {
        dispatch(setToastMessage("Login Failed"));
        dispatch(setToastColor("destructive"));
        dispatch(setShowToast(true));
      }
    }
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Log In
            </h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Toast
              open={showToast}
              onOpenChange={() => dispatch(setShowToast(false))}
              variant={toastColor as "default" | "destructive"}
            >
              <div className="grid gap-1">
                <ToastTitle className="text-gray-900 dark:text-white">
                  Login Error
                </ToastTitle>
                <ToastDescription className="text-gray-500 dark:text-gray-300">
                  {toastMessage}
                </ToastDescription>
              </div>
              <ToastClose />
            </Toast>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGoogleAuth}
              className="w-full border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
              disabled={isGoogleLoading && isLoginLoading}
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>Log in with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                  OR
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => dispatch(setShowPassword(!showPassword))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
              disabled={isLoginLoading}
            >
              {isLoginLoading ? (
                <div className="flex items-center justify-center">
                  <span className="mr-2">Logging in</span>
                  <Loader2 className="animate-spin" />
                </div>
              ) : (
                "Log In"
              )}
            </Button>

            <div className="text-center">
              <Link
                to="/"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}

export default LoginPage;
