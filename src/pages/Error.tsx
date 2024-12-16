import { useNavigate } from "react-router";

interface ErrorProps {
  isLoggedIn: boolean;
}
function Error({ isLoggedIn }: ErrorProps) {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };
  return (
    <main className="h-screen flex flex-col">
      <div className="flex-1 flex flex-col gap-8 justify-center items-center">
        <span className="text-9xl font-bold text-stone-600">404!</span>
        <h1 className="text-5xl font-bold text-stone-600">
          Something’s not right.
        </h1>
        <p className="text-stone-600 font-semibold">
          We can’t find the page you're are looking for.
        </p>

        <button
          onClick={handleBackToHome}
          className="bg-stone-500 hover:bg-stone-700 text-white font-bold py-4 px-6 rounded-full mt-4"
        >
          Back to Home
        </button>
      </div>
    </main>
  );
}

export default Error;
