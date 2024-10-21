import React from "react";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleItem, Icon } from "react-materialize";

const Menu = (props) => {
  const user = props.user;

  return (
    <ul id="slide-out" className="sidenav">
      <li style={{ backgroundColor: "#1c1c1c", color: "#fff" }}>
        <div className="user-view">
          <span
            className="name center text-bold"
            style={{ marginTop: "0px", fontSize: "16px" }}
          >
            <div>{user.nombre}</div>
            <div>{user.correo}</div>
          </span>
          <span className="email center white-text text-bold"></span>
        </div>
      </li>
      <li style={{ marginLeft: "-12px" }}>
        <Link to="/" className="sidenav-close">
          <i
            className="material-icons"
            style={{ margin: "0 18px 0 0", color: "#000000de" }}
          >
            home
          </i>
          <span style={{ color: "#000000de" }}>Pantalla de inicio</span>
        </Link>
      </li>
      <li>
        <Collapsible accordion>
          <CollapsibleItem
            expanded={false}
            header="Productos"
            icon={<Icon>storefront</Icon>}
            node="ul"
          >
            <ul>
              <li>
                <Link to="/carga-masiva" className="sidenav-close">
                  <i className="material-icons">file_upload</i>
                  Carga Masiva
                </Link>
              </li>
              <li className="sidenav-close">
                <Link to="/productos" className="sidenav-close">
                  <i className="material-icons">calendar_view_week</i>
                  Consulta
                </Link>
              </li>
            </ul>
          </CollapsibleItem>
        </Collapsible>
      </li>
      <li>
        <Collapsible accordion>
          <CollapsibleItem
            expanded={false}
            header="Descuentos"
            icon={<Icon>insights</Icon>}
            node="ul"
          >
            <ul>
              <li>
                <Link to="/desc-masivo" className="sidenav-close">
                  <i className="material-icons">check_circle</i>
                  Aplicar Descuentos
                </Link>
              </li>
              <li>
                <Link to="/desc-query" className="sidenav-close">
                  <i className="material-icons">search</i>
                  Consulta de Descuentos
                </Link>
              </li>
            </ul>
          </CollapsibleItem>
        </Collapsible>
      </li>
      <li>
        <Collapsible accordion>
          <CollapsibleItem
            expanded={false}
            header="Administraci&oacute;n"
            icon={<Icon>settings</Icon>}
            node="ul"
          >
            <ul>
              <li>
                <Link to="/tarifa" className="sidenav-close">
                  <i className="material-icons">description</i>
                  Tarifas
                </Link>
              </li>
              <li>
                <Link to="/orden-query" className="sidenav-close">
                  <i className="material-icons">beenhere</i>
                  Orden de Compras
                </Link>
              </li>
              <li>
                <Link to="/user-reg" className="sidenav-close">
                  <i className="material-icons">account_circle</i>
                  Usuarios Registrados
                </Link>
              </li>
              <li>
                <Link to="/user-query" className="sidenav-close">
                  <i className="material-icons">person</i>
                  Usuarios Administradores
                </Link>
              </li>
              <li>
                <Link to="/pagina" className="sidenav-close">
                  <i className="material-icons">dashboard</i>
                  Diseño de Pagina
                </Link>
              </li>
              <li>
                <Link to="/categoria" className="sidenav-close">
                  <i className="material-icons">bookmark</i>
                  Categor&iacute;as
                </Link>
              </li>
            </ul>
          </CollapsibleItem>
        </Collapsible>
      </li>
      <li className="sidenav-close">
        <Link to="/logout" style={{ padding: "0 20px" }}>
          <i
            className="material-icons"
            style={{ margin: "0 20px 0 0", color: "#000000de" }}
          >
            exit_to_app
          </i>
          <span style={{ color: "#000000de" }}>[ Salir ]</span>
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
