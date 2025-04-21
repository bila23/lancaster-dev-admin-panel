import React, { useState, useEffect, useRef } from "react";
import service from "../../service/modules/infDescService";
import InfDescSave from "./infDescSave";
import Btn from "../common/btn";
import util from "../../service/common/util";
import Modal from "../common/modal";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";

const InfDescQuery = () => {
  const toast = useRef(null);
  const [data, setData] = useState([]);
  const [editDlg, setEditDlg] = useState(false);
  const [deleteDlg, setDeleteDlg] = useState(false);
  const [saveDlg, setSaveDlg] = useState(false);
  const [model, setModel] = useState("");

  return <></>;
};

export default InfDescQuery;
