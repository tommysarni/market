"use client";
import Link from "next/link";
import DocumentTable from "./DocumentTable";
const ItalianDocs = () => {
  return (
    <div>
      <div className="link">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/projects/italian-qualification">Qualification</Link>
      </div>

      <div>
        <DocumentTable />
      </div>
    </div>
  );
};

export default ItalianDocs;
