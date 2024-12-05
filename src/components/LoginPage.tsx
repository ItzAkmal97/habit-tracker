import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../util/firebaseConfig";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import Toast from "./Toast";
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
import { setUsername, setEmail } from "../features/firebaseDbSlice";

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
        dispatch(setIsLoggedIn(true));
        navigate("/dashboard");
      }
    } catch (error: unknown) {
      console.error(typeof error, error);

      if (error instanceof FirebaseError) {
        dispatch(setShowToast(true));
        dispatch(setToastMessage("Google Login Failed, Please Try Again"));
        dispatch(setToastColor("bg-red-500 text-red-900 border-red-600"));
      } else {
        dispatch(setShowToast(true));
        dispatch(
          setToastMessage("An Unexpected Error Occurred, Please Try Again")
        );
        dispatch(setToastColor("bg-red-500 text-red-900 border-red-600"));
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
        dispatch(setUsername(userData.username));
        dispatch(setEmail(userData.email));

        dispatch(setIsLoggedIn(true));
        navigate("/dashboard");
      } else {
        console.log("No User Document Found")
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
        dispatch(setToastColor("bg-red-500 text-red-100 border-red-600"));
        dispatch(setShowToast(true));
      } else {
        dispatch(setToastMessage("Login Failed"));
        dispatch(setToastColor("bg-red-500 text-red-100 border-red-600"));
        dispatch(setShowToast(true));
      }
    }
  };

  return (
    <>
      <div className="bg-blue h-screen text-gold pt-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              <h1 className="text-center text-3xl md:text-4xl mb-12">Log In</h1>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  {showToast && (
                    <Toast
                      message={toastMessage}
                      colors={toastColor}
                      onClose={() => dispatch(setShowToast(false))}
                      isVisible={showToast}
                    />
                  )}

                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    className="flex w-full items-start justify-center gap-2 hover:border-gold duration-500 ease-in-out border border-white font-semibold py-3 rounded-md"
                  >
                    <Mail size={20} />
                    Log in with Google
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="h-px bg-[#F5E7B4] flex-1"></div>
                    <span className="text-[#F5E7B4] font-medium">OR</span>
                    <div className="h-px bg-[#F5E7B4] flex-1"></div>
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    className="h-8 w-full p-2 text-black"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 font-bold">
                      {errors.email.message}
                    </p>
                  )}

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-8 w-full p-2 text-black"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => dispatch(setShowPassword(!showPassword))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 font-bold">
                      {errors.password.message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="bg-gold text-blue font-semibold py-4 rounded-md hover:bg-yellow-400 duration-300 ease-in-out mt-4"
                  >
                    Log In
                  </button>

                  <Link
                    to="/"
                    className="text-[#F5E7B4] text-center hover:underline"
                  >
                    Don't have an account? Sign up
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
