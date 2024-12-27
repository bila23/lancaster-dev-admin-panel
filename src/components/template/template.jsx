import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Logout from "../common/logout";
import CustomHome from "../common/customHome";
import ProductoNew from "../productos/productoNew";
import ProductoQuery from "../productos/productoQuery";
import ProductoEdit from "../productos/productoEdit";
import CargaMasiva from "../productos/cargaMasiva";
import TallaQuery from "../tallas/tallaQuery";
import DescuentoMasivo from "../descuentos/descMasivo";
import DescuentoQuery from "../descuentos/descuentoQuery";
import PaginaForm from "../pagina/paginaForm";
import PaginaEdit from "../pagina/paginaEdit";
import UsuarioQuery from "../admin/usuarioQuery";
import OrdenCompra from "../admin/ordenCompra";
import userShopQuery from "../user-shop/userShopQuery";
import Tarifa from "../admin/tarifa/tarifa";
import CategoriaQuery from "../categoria/categoriaQuery";
import DeliverFreeQuery from "../deliverfree/deliverFreeQuery";
import DmfQuery from "../delMontoFree/dmfQuery";

class Template extends Component {
  render() {
    const { user } = this.props;
    return (
      <Switch>
        <Route path="/dmf-query" component={DmfQuery} />
        <Route path="/deliver-free" component={DeliverFreeQuery} />
        <Route path="/categoria" component={CategoriaQuery} />
        <Route path="/tarifa" component={Tarifa} />
        <Route path="/user-reg" component={userShopQuery} />
        <Route path="/orden-query" component={OrdenCompra} />
        <Route path="/pagina-edit/:id" component={PaginaEdit} />
        <Route path="/user-query" component={UsuarioQuery} />
        <Route path="/pagina" component={PaginaForm} />
        <Route path="/desc-query" component={DescuentoQuery} />
        <Route path="/desc-masivo" component={DescuentoMasivo} />
        <Route path="/talla-query" component={TallaQuery} />
        <Route path="/carga-masiva" component={CargaMasiva} />
        <Route path="/producto/:id" component={ProductoEdit} />
        <Route path="/productos" component={ProductoQuery} />
        <Route path="/producto-nuevo" component={ProductoNew} />
        <Route path="/logout" component={Logout} />
        <Route path="/home" component={CustomHome} />
        <Route exact path="/">
          {user.nombre ? <CustomHome /> : <Logout />}
        </Route>
      </Switch>
    );
  }
}

export default Template;
