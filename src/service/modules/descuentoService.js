import ProductoService from "./productoService";
import http from "../common/httpService";
import _ from "lodash";

const api = "/descuento";

async function inactivate(codigo) {
  const { data: result } = await http.get(`${api}/inactivate/${codigo}`);
  return result;
}

async function findAll() {
  const { data: result } = await http.get(api);
  return result;
}

async function save(list, user, etiqueta, descuento, catPadre, catHija) {
  const lst = prepareListToSave(
    list,
    user,
    etiqueta,
    descuento,
    catPadre,
    catHija
  );
  const { data: result } = await http.post(api, lst);
  return result;
}

function prepareListToSave(
  list,
  user,
  etiqueta,
  descuento,
  categoriaPadre,
  categoriaHija
) {
  let lst = [];
  for (const model of list) {
    lst.push({
      estado: "ACTIVO",
      producto: model._id,
      categoriaPadre: categoriaPadre,
      categoriaHija: categoriaHija,
      etiqueta: etiqueta,
      valorOriginal: model.monto,
      valorNuevo: parseFloat(
        ProductoService.generateDescuento(model.monto, descuento)
      ),
      porcentaje: parseFloat(descuento),
      usuarioCrea: user,
    });
  }
  return lst;
}

export default { findAll, save, inactivate };
