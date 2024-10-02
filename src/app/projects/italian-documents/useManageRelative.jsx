import { useState } from "react";
import Relative from "./Relative";
import styles from "./page.module.css";


const useManageRelative = () => {
  const [data, setData] = useState(
    new Relative({ isUser: true, posToUser: 0 }).encode()
  );

  const addParent = (relative) => {
    setData((prev) => {
      const dummy = new Relative();
      const user = dummy.decodeAllRelatives(prev);
      const target = user.findEncodedRelative(relative);
      target.addParent().addSpouse();
      return user.encodeAllRelatives(user);
    });
  };

  const addDescendent = (relative) => {
    setData((prev) => {
      const dummy = new Relative();
      const user = dummy.decodeAllRelatives(prev);
      const target = user.findEncodedRelative(relative);
      if (!target) console.warn("target not found", relative);
      if (target.isUser) {
        target.addDescendent();
      } else target.addDescendent().addSpouse();
      return user.encodeAllRelatives(user);
    });
  };

  const addSpouse = (relative) => {
    setData((prev) => {
      const dummy = new Relative();
      const user = dummy.decodeAllRelatives(prev);
      const target = user.findEncodedRelative(relative);
      target.addSpouse();
      return user.encodeAllRelatives(user);
    });
  };

  const updateRelative = (relative, updates) => {
    setData((prev) => {
      const dummy = new Relative();
      const user = dummy.decodeAllRelatives(prev);
      const target = user.findEncodedRelative(relative);

      target.update({ ...updates });
      return user.encodeAllRelatives(user);
    });
  };

  const remove = (relative) => {
    setData((prev) => {
      const dummy = new Relative();
      const user = dummy.decodeAllRelatives(prev);
      const target = user.findEncodedRelative(relative);
      if (!target) return user.encodeAllRelatives(user);;
      if (relative.charAt(0) === "1" && target.children?.length) {
        target.children[0].remove();
      } else target.remove();
      return user.encodeAllRelatives(user);
    });
  };

  const JSX = () => {

    const dummy = new Relative();
    const user = dummy.decodeAllRelatives(data);
    if (!user) console.log({data, user, dummy})
    const html = user.getFamilyJSX({
      relative: user,
      addParent,
      addSpouse,
      addDescendent,
      updateRelative,
      remove,
      styles,
    });
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: '100%'
        }}
      >
        {html}
      </div>
    );
  };

  return { data, addParent, addDescendent, addSpouse, updateRelative, JSX };
};

export default useManageRelative;
