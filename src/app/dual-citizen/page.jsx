"use client";
import { useState } from "react";
import flow from "../projects/italian-qualification/flow";
import style from "./page.module.css";
import NodeForm from "../projects/italian-qualification/NodeForm";
import DocumentTable from "../projects/italian-documents/DocumentTable";
import Link from "next/link";

const DualCitizen = () => {
  const [node, setNode] = useState(flow);

  const reset = () => {
    flow.parent = undefined;
    setNode(flow);
  };

  return (
    <div className={style.pageContainer}>
      <div className="link">

      <Link href="/">Home</Link>
      <Link href="/projects">Projects</Link>
      </div>
      <div className={style.sectionContainer}>
        <div>Info about qualification</div>
        <div className={style.jsx}>
          <NodeForm
            styles={style}
            node={node}
            setNode={setNode}
            reset={reset}
          />
        </div>
      </div>
      <div className={style.sectionContainer}>
        <div>Info about Documents Needed</div>
        <DocumentTable />
      </div>
    </div>
  );
};

export default DualCitizen;
