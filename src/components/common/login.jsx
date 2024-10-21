import React, { useState, useEffect, useRef } from "react";
import auth from "../../service/common/authService";
import util from "../../service/common/util";
import { Toast } from "primereact/toast";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [display, setDisplay] = useState(false);
  const toast = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      util.warning(toast, "Debe ingresar el usuario");
      return;
    }
    if (!password) {
      util.warning(toast, "Debe ingresar la contraseña");
      return;
    }
    try {
      await auth.login(user.toLowerCase(), password);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        util.error(toast, ex.response.data);
      else {
        console.error(ex);
        util.error(toast, "Ha ocurrido un error inesperado");
      }
    }
  };

  useEffect(() => {
    const pictureArray = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
    const randomIndex = Math.floor(Math.random() * pictureArray.length);
    const selectedPicture = pictureArray[randomIndex];
    var elem = document.getElementById("lg-imga");
    elem.style.backgroundImage = "url(images/init/" + selectedPicture + ")";
  }, []);

  const css = `body{overflow-y: hidden}`;

  return (
    <>
      <Toast ref={toast} />
      <style>{css}</style>
      <div
        className="row"
        style={{
          height: "100vh",
          display: "flex",
          flexWrap: "wrap",
          borderSizing: "border-box",
          marginBottom: "0px",
        }}
      >
        <div
          id="lg-imga"
          className="col m8 hide-on-small-only"
          style={{
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="col s12 m4 valign-wrapper">
          <form className="col s12" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col s12 center-align">
                <img src="images/common/logo.jpeg" alt="" title="" />
              </div>
            </div>
            <div className="row">
              <div
                className="col s12 center-align"
                style={{ fontWeight: "bold", fontSize: "18px" }}
              >
                ADMINISTRACI&Oacute;N DE ECOMMERCE
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">account_circle</i>
                <input
                  id="user"
                  className="validate"
                  name="user"
                  type="text"
                  onChange={(e) => setUser(e.target.value)}
                  value={user}
                />
                <label htmlFor="user">Ingrese su usuario:</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12">
                <i className="material-icons prefix">lock</i>
                <input
                  id="password"
                  className="validate"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                />
                <label htmlFor="password">Ingrese su contraseña:</label>
              </div>
            </div>
            <div className="row">
              <div className="col s12 right-align">
                <button
                  className="btn waves-effect waves-light black darken-4"
                  type="submit"
                >
                  <i className="material-icons left">exit_to_app</i>
                  INGRESAR
                </button>
              </div>
            </div>
            <div className="row">
              <div className="input-field col s12 right-align">
                <a href="#" onClick={(e) => setDisplay(true)}>
                  ¿Desea cambiar su contrase&ntilde;a?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
