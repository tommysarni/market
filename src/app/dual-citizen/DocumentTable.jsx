import { useEffect, useState } from "react";
import Relative from "./Relative";

const DocumentTable = () => {
  const [relative, setRelative] = useState(
    new Relative({ isUser: true, posToUser: 0 })
  );

  return (
    <div>
      {relative && (
        <RelativeToJSX relative={relative} setRelative={setRelative} />
      )}
    </div>
  );
};

const RelativeToJSX = ({ relative, setRelative }) => {
  const addParent = (e) => {
    const updated = relative.addParent()
    setRelative(updated);
  };
  const addDescendent = (e) => {
    console.log('add descend')
    setRelative(prev => {
        const updated = prev.addDescendent()
        return updated
    });
  };

  return (
    <div>
      <button onClick={(e) => addParent(e)}>Add Parent</button>
      {docsToJSX(relative)}
      <button onClick={(e) => addDescendent(e)}>Add Descendent</button>
    </div>
  );
};

const docsToJSX = (relative) => {
  if (!relative) return <></>;
  const documents = relative.getAllDocuments(relative);
  const items = [];
  documents.forEach((val, key) => {
    items.push(
      <div key={key}>
        <h3>{key}</h3>
        {val.map((v) => (
          <p key={`${key}_${v}`}>{v}</p>
        ))}
      </div>
    );
  });

  return (
    <div>
        {items}
    </div>
  )
};

export default DocumentTable;
