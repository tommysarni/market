"use client";
import { useState } from "react";
import flow from "./flow";
import style from "./page.module.css";
import NodeForm from "./NodeForm";
import DocumentTable from "./DocumentTable";

const DualCitizen = () => {
  const [node, setNode] = useState(flow);

  const reset = () => {
    flow.parent = undefined;
    setNode(flow);
  };

  return (
    <div className={style.pageContainer}>
      {/* <NodeForm node={node} setNode={setNode} reset={reset}/> */}
      <DocumentTable />
    </div>
  );
};

export default DualCitizen;
