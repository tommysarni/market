"use client";
import { useState } from "react";
import flow from "./flow";
import style from "./page.module.css";

import NodeForm from "./NodeForm";
import Link from "next/link";

const ItalianQualify = () => {
  const [node, setNode] = useState(flow);

  const reset = () => {
    flow.parent = undefined;
    setNode(flow);
  };
  return (
    <div>
      <div className="link">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/projects/italian-documents">Documents</Link>
      </div>
      <div>
        <NodeForm styles={style} node={node} setNode={setNode} reset={reset} />
      </div>
    </div>
  );
};

export default ItalianQualify;
