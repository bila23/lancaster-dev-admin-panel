import React from "react";
import util from "../../service/common/util";
import { Dropdown } from "primereact/dropdown";

const InputMate = ({
  id,
  type,
  value,
  setForm,
  label,
  dwon,
  options,
  editClass,
}) => {
  return (
    <div className="row">
      <div className={`col s12 input-field ${editClass}`}>
        {!dwon && (
          <>
            <input
              type={type}
              id={id}
              name={id}
              value={value}
              onChange={(e) =>
                util.handleFormChange(id, e.target.value, setForm)
              }
            />
            <label htmlFor={id} className={editClass}>
              {label}
            </label>
          </>
        )}
        {dwon && (
          <>
            <Dropdown
              id={id}
              value={value}
              options={options}
              onChange={(e) => util.handleFormChange(id, e.value, setForm)}
              placeholder={label}
              style={{ width: "100%" }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default InputMate;
