import React from "react";
import { ClipLoader } from "react-spinners";

interface LoadingProps {
  isLoading: boolean;
  cssClassName?: string;
}

const Loading: React.FC<LoadingProps> = ({ isLoading, cssClassName }) => {
  if (!isLoading) return null;

  return (
    <div className={`flex justify-center items-center ${cssClassName}`}>
      <ClipLoader
        color="dark:gray-800"
        className="font-bold"
        cssOverride={{
          borderWidth: "4px",
        }}
      />
    </div>
  );
};

export default Loading;
