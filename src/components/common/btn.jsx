import React from "react";

const Btn = ({ name, execute, icon, style, className = "blue darken-4" }) => {
  return (
    <>
      <button
        className={`btn waves-effect waves-light ${className}`}
        onClick={execute}
        style={style}
      >
        {icon && <i className="material-icons left">{icon}</i>}
        {name}
      </button>
    </>
  );
};

export default Btn;
