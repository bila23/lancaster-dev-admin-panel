import React from "react";

const Input = ({ name, label, error, labelClass, ...rest }) => {
  return (
    <>
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      <input
        {...rest}
        id={name}
        className="validate"
        name={name}
        autoComplete="false"
      />
      {error && <div className="danger-alert alert">{error}</div>}
    </>
  );
};

export default Input;
