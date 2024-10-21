import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loading = ({ active }) => {
  return (
    <div className="row" style={{ textAlign: "center" }}>
      <div className="col s12">
        <ProgressSpinner
          style={{ width: "50px", height: "50px" }}
          strokeWidth="5"
          fill="var(--surface-ground)"
          animationDuration=".5s"
        />
      </div>
    </div>
  );
};

export default Loading;
