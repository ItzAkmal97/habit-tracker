import React from "react";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  isLoading: boolean;
}

const Loading: React.FC<LoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-blue">
      <ClipLoader
        color="gold"
        className="font-bold"
        cssOverride={{
          borderWidth: "4px",
        }}
      />
    </div>
  );
};

export default Loading;
