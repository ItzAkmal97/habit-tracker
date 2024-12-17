import { useForm } from "react-hook-form";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../util/firebaseConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { auth } from "../util/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { Mail } from "lucide-react";
import { FirebaseError } from "firebase/app";
import { Eye, EyeOff } from "lucide-react";
import { RootState } from "../store/store";
import { useSelector, useDispatch } from "react-redux";
import {
  setShowPassword,
  setShowToast,
  setToastColor,
  setToastMessage,
} from "../features/loginSignupSlice";
import LandingPageHeader from "./LandingPageHeader";
import { setIsLoggedIn } from "../features/authenticationSlice";
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

type SignupData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignupPage: React.FC = () => {
  const { showPassword, showToast, toastColor, toastMessage } = useSelector(
    (state: RootState) => state.loginSignup
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    username: yup
      .string()
      .matches(
        /^[a-zA-Z0-9_-]{1,20}$/,
        "Username must be 1 to 20 characters long, containing only letters (a-z), numbers (0-9), hyphens (-), or underscores (_)"
      )
      .required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must be no more than 128 characters long")
      .matches(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .matches(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .matches(/^(?=.*[0-9])/, "Password must contain at least one number")
      .matches(
        /^(?=.*[!@#$%^&*()_+={};:<>?])/,
        "Password must contain at least one special character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupData>({
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
      console.error(error instanceof FirebaseError, error);

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

  const onSubmit = async (data: SignupData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      if (userCredential.user) {
        const userId = userCredential.user.uid;
        await setDoc(doc(db, "users", userId), {
          username: data.username,
          email: data.email,
        });

        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);

        dispatch(setIsLoggedIn(true));
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error(error instanceof FirebaseError, error);

      if (
        error instanceof FirebaseError &&
        error.code === "auth/email-already-in-use"
      ) {
        dispatch(setToastMessage("Email Already In Use"));
        dispatch(setToastColor("destructive"));
        dispatch(setShowToast(true));
      } else if (
        error instanceof FirebaseError &&
        error.code === "auth/invalid-email"
      ) {
        dispatch(setToastMessage("Invalid Email"));
        dispatch(setToastColor("destructive"));
        dispatch(setShowToast(true));
      } else {
        dispatch(setToastMessage("Registration Failed"));
        dispatch(setToastColor("destructive"));
        dispatch(setShowToast(true));
      }
    }

    reset();
  };

  return (
    <>
      <LandingPageHeader />
      <ToastProvider>
        <div className="h-full md:h-screen text-black dark:text-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col gap-6 sm:flex sm:flex-row sm:justify-around md:items-center md:gap-16 pt-20 ">
              <div className="flex flex-col justify-center gap-6 max-w-xl">
                <h1 className="text-7xl font-semibold dark:text-white">
                  Turn Habits into Herds of Success.
                </h1>
                <p className="font-semibold dark:text-gray-300">
                  Take charge of your daily routines and watch your goals come
                  to life! Join HabitHerd and build better habits one step at a
                  time, all while earning rewards and tracking your progress.
                </p>
              </div>
              <div className="sm:flex sm:flex-col sm:justify-center sm:items-center py-16">
                <h1 className="text-3xl md:text-4xl mb-2 dark:text-white">
                  Sign Up For Free
                </h1>
                <form
                  className="flex flex-col gap-2 mt-8"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex flex-col gap-4">
                    <Toast
                      open={showToast}
                      onOpenChange={() => dispatch(setShowToast(false))}
                      variant={toastColor as "default" | "destructive"}
                    >
                      <div className="grid gap-1">
                        <ToastTitle className="dark:text-white">
                          Signup Error
                        </ToastTitle>
                        <ToastDescription className="dark:text-gray-300">
                          {toastMessage}
                        </ToastDescription>
                      </div>
                      <ToastClose />
                    </Toast>

                    <Input
                      type="text"
                      placeholder="Username"
                      className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                      {...register("username")}
                    />
                    {errors.username && (
                      <p className="text-red-500 font-bold">
                        {errors.username.message}
                      </p>
                    )}

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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 font-bold">
                        {errors.password.message}
                      </p>
                    )}
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        {...register("confirmPassword")}
                      />
                      <button
                        type="button"
                        onClick={() => dispatch(setShowPassword(!showPassword))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 font-bold">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold dark:text-gray-300">
                    By clicking the button below, you are indicating that you
                    have read and agree to the Terms of Service and Privacy
                    Policy.
                  </p>
                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Sign up
                  </Button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-black dark:bg-gray-600 flex-1"></div>
                    <span className="text-black dark:text-white font-medium">
                      OR
                    </span>
                    <div className="h-px bg-black dark:bg-gray-600 flex-1"></div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleGoogleAuth}
                    className="dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
                  >
                    <Mail size={20} />
                    Start with Google
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastViewport />
      </ToastProvider>
    </>
  );
};

export default SignupPage;
