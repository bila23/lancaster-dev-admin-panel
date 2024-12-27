import React from "react";

const EmptyField = (props) => {
  return (
    <>
      <div
        className="p-d-flex p-ai-center p-dir-col center-align"
        style={{ marginTop: "20px" }}
      >
        <img src="/images/theme/empty_1.png" alt="Empty" title="" />
        <h5
          style={{
            color: "var(--text-color-secondary)",
          }}
          className="p-my-5"
        >
          {props.message}
        </h5>
      </div>
    </>
  );
};

export default EmptyField;
