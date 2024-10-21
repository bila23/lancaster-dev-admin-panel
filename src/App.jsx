import React from "react";
import auth from "./service/common/authService";
import Login from "./components/common/login";
import Home from "./components/common/home";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const App = () => {
  let flag = "";
  const jwt = auth.getCurrentUser();
  //REACT_APP_API_URL=https://lancaster-production-back.herokuapp.com/

  if (jwt) flag = "home";
  else if (!jwt) flag = "login";

  return (
    <>
      {flag === "login" && <Login />}
      {flag === "home" && <Home user={jwt} />}
    </>
  );
};

export default App;
