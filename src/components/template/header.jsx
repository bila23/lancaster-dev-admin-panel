import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav id="header" style={{ backgroundColor: "#1C1C1C" }}>
        <div className="nav-wrapper">
          <a
            id="mp"
            href="#"
            data-target="slide-out"
            className="sidenav-trigger"
            style={{ display: "initial" }}
          >
            <i className="material-icons" style={{ color: "#fff" }}>
              menu
            </i>
          </a>
          <Link
            to="/"
            className="brand-logo hide-on-med-and-down"
            style={{ marginTop: "5px" }}
          >
            <img
              src="/images/common/logo-black.png"
              alt=""
              title=""
              style={{ width: "238px", height: "52px" }}
            />
          </Link>
          <Link
            to="/"
            className="brand-logo show-on-small show-on-medium hide-on-large-only hide-on-med-and-up"
          >
            <span style={{ color: "#fff" }}>Lancaster</span>
          </Link>
          <ul className="right hide-on-med-and-down">
            <li>
              <Link to="/" className="white-text">
                Administraci&oacute;n de Ecommerce
              </Link>
            </li>
            <li>
              <Link to="/logout" className="white-text">
                <i className="material-icons">exit_to_app</i>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
