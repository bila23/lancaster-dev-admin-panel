import React from "react";
import Template from "../template/template";
import Header from "../template/header";
import Menu from "../template/menu";

const Home = (props) => {
  const user = props.user;
  const css = `body{background: #f4f4f4}`;
  return (
    <>
      <style>{css}</style>
      <Header />
      <Menu user={user} />
      <Template user={user} />
    </>
  );
};

export default Home;
