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
import { Eye, EyeOff } from "lucide-react";
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
import { useEffect } from "react";
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

type LoginData = {
  email: string;
  password: string;
};

function LoginPage() {
  const { showToast, showPassword, toastColor, toastMessage } = useSelector(
    (state: RootState) => state.loginSignup
  );

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
      <div className="bg-white dark:bg-gray-900 h-screen text-black dark:text-white pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              <h1 className="text-center text-3xl md:text-4xl mb-12 dark:text-white">
                Log In
              </h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <Toast
                    open={showToast}
                    onOpenChange={() => dispatch(setShowToast(false))}
                    variant={toastColor as "default" | "destructive"}
                  >
                    <div className="grid gap-1">
                      <ToastTitle className="dark:text-white">
                        Login Error
                      </ToastTitle>
                      <ToastDescription className="dark:text-gray-300">
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
                    className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                  >
                    <Mail size={20} />
                    Log in with Google
                  </Button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-black dark:bg-gray-600 flex-1"></div>
                    <span className="text-black dark:text-white font-medium">
                      OR
                    </span>
                    <div className="h-px bg-black dark:bg-gray-600 flex-1"></div>
                  </div>

                  <Input
                    type="email"
                    placeholder="Email"
                    className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 font-bold">
                      {errors.email.message}
                    </p>
                  )}

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch(setShowPassword(!showPassword))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-white dark:text-gray-400 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 font-bold">
                      {errors.password.message}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Log In
                  </Button>

                  <Button
                    variant="link"
                    size="sm"
                    className="dark:text-white dark:hover:text-gray-300"
                  >
                    <Link to="/">Don't have an account? Sign up</Link>
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastViewport />
    </ToastProvider>
  );
}

export default LoginPage;
