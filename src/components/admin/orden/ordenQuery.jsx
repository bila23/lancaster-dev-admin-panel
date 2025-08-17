import OrdenCompra from "../ordenCompra";
import OrdenFaceleQuery from "./ordenFaceleQuery";
import { TabView, TabPanel } from "primereact/tabview";

const OrdenQuery = () => {
  return (
    <>
      <div className="row">
        <div className="col s12">
          <h4 className="text-bold">Consulta de Ordenes de Compra</h4>
        </div>
      </div>
      <div className="row">
        <div className="col s12">
          <TabView>
            <TabPanel header="Facele">
              <OrdenFaceleQuery />
            </TabPanel>
            <TabPanel header="Nubefact">
              <OrdenCompra visible={true} />
            </TabPanel>
          </TabView>
        </div>
      </div>
    </>
  );
};

export default OrdenQuery;
