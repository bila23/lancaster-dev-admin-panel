import React, { useState, useRef } from "react";
import authService from "../../service/common/authService";
import ProductoService from "../../service/modules/productoService";
import util from "../../service/common/util";
import ProductoForm from "./productoForm";
import Loading from "../common/loading";
import { Toast } from "primereact/toast";

const ProductoNew = () => {
  const initialForm = {
    categoria: "",
    categoriaNombre: "",
    categoriaHija: "",
    categoriaHijaNombre: "",
    categoriaFull: "",
    categoriaHijaFull: "",
    codigo: "",
    nombre: "",
    monto: "",
    talla: "",
    color: "",
    colorNombre: "",
    calidad: "",
    cantidad: "",
    especificaciones: "",
    estado: "ACTIVO",
    etiqueta: "",
    usuarioCrea: authService.getUser(),
  };

  const toast = useRef(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [codes, setCodes] = useState([]);
  const [disabled, setDisabled] = useState(false);

  async function findCodes() {
    const codes = await ProductoService.findDistinctCode();
    setCodes(codes);
  }

  const uploadFiles = async (event) => {
    const validate = ProductoService.validateForm(form, setErrors);
    if (validate) {
      setLoading(true);
      try {
        const result = await saveProducto(event);
        if (result.type === "SUCCESS") {
          setDisabled(false);
          setForm(initialForm);
          await findCodes();
          event.options.clear();
          util.success(toast, "Se ha guardado correctamente el producto");
        } else util.error(toast, result.msg);
      } catch (e) {
        console.error(e);
        util.error(toast, "Ha ocurrido un error al guardar el producto");
      }
      setLoading(false);
    } else
      util.warning(
        toast,
        "Favor revisar el formulario, hay uno o más campos que estan incorrectos"
      );
  };

  const saveProducto = async (event) => {
    const files = event.files;
    const result = await ProductoService.save(form, files);
    return result;
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="row" style={{ marginBottom: "0px" }}>
        <div className="col s12">
          <h4 className="left text-bold">Ingreso de Productos</h4>
        </div>
      </div>
      <div className="container">
        <div className="card" style={{ padding: "15px" }}>
          <div className="row">
            <div className="col s12 m4">
              Para agregar un nuevo producto, por favor sigue los siguientes
              pasos:
              <br />
              <br />
              <ul className="browser-default" style={{ lineHeight: "28px" }}>
                <li>
                  Completa el formulario, todos los campos son obligatorios
                </li>
                <li>
                  Si el producto que vas a ingresar ya existe en el sistema pero
                  en otro color u otra talla, selecciona el código existente, en
                  caso contrario ingresa un nuevo código. Al seleccionar un
                  código los campos del producto se llenar&aacute;n
                  autom&aacute;ticamente, solo deberas ingresar la cantidad,
                  talla y color.
                </li>
                <li>
                  En el campo de etiquetas, cuando digites una debes presionar
                  la tecla "Enter", puedes agregar las que quieras.
                </li>
                <li>
                  Anexa las imagenes relacionadas al producto, puedes subir las
                  imagenes que desees.
                </li>
                <li>
                  Procura que las imágenes tengan la misma resolución y el mismo
                  tamaño.
                </li>
                <li>
                  Haz clic en el bot&oacute;n "Subir producto", se cargará tanto
                  la informaci&oacute;n como las imagenes.
                </li>
              </ul>
            </div>
            <div className="col s12 m8">
              <ProductoForm
                form={form}
                setForm={setForm}
                errors={errors}
                codes={codes}
                setCodes={setCodes}
                uploadFiles={uploadFiles}
                disabled={disabled}
                setDisabled={setDisabled}
                showImages={true}
              />
            </div>
          </div>
          {loading && (
            <div className="row">
              <div className="col s12">
                <Loading />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductoNew;
