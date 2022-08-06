import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Spinner: React.FC = () => {
  return (
    <div className="w-full flex justify-center">
      <ThreeDots
        ariaLabel="rotating-square"
        visible={true}
        color="hsl(345, 100%, 43%)"
      />
    </div>
  );
};

export default Spinner;
