import { Document, MarbleBlock } from "../../dual-citizen/marble_ui";

/**
 * Defines a Relative in the family line to LIRA
 * @typedef {Object} Relative
 * @property {number} posToUser - position offset to user
 * @property {Relative|undefined} parent - parent of this
 * @property {Relative|undefined} descendent - descendent in citizenship line of this
 * @property {Relative|undefined} spouse - spouse of this
 * @property {boolean} deceased - is this deceased?
 * @property {boolean} divorced - is this previously divorced?
 * @property {boolean} isUser - is this the user?
 * @property {boolean} isSpouse - is this the spouse?
 * @property {boolean} isChild - is this a child of user?
 */
function Relative({
  posToUser,
  parent,
  descendent,
  spouse,
  deceased,
  divorced,
  isUser,
  isSpouse,
  isChild,
} = {}) {
  this.posToUser = posToUser;
  this.lira = false;
  this.parent = parent;
  this.descendent = descendent;
  this.spouse = spouse;
  this.deceased = deceased;
  this.divorced = divorced;
  this.isUser = isUser;
  this.isSpouse = isSpouse;
  this.isChild = isChild;
  this.children = [];

  /**
   * Updates this Relative
   * @param {Object} obj Object with updated info
   * @returns the updated Relative
   */
  this.update = (obj) => {
    for (const [key, val] of Object.entries(obj)) {
      this[key] = val;
    }
    return this;
  };

  this.remove = () => {
    if (this.isChild) {
      const user = this.parent;
      user.update({ children: user.children.slice(1) });
      return user;
    }
    if (this.isUser) return this;
    if (this.isSpouse) {
      const spouse = this.spouse;
      this.spouse.spouse = undefined;
      return spouse;
    }
    if (this.parent && this.descendent) {
      const descendent = this.descendent;
      this.parent.descendent = descendent;
      descendent.parent = this.parent;
      descendent.updatePosToUser(descendent.parent, -1);
      return descendent;
    } else if (this.descendent) {
      const descendent = this.descendent;
      descendent.parent = undefined;
      descendent.update({ lira: true });
      return descendent;
    } else {
      return this;
    }
  };

  /**
   * Adds spouse to this
   * @param {Relative} relative spouse
   */
  this.addSpouse = (relative = new Relative()) => {
    if (this.isSpouse) return this;
    const old = this.spouse;
    if (old) return old;
    this.spouse = relative;
    const defaults = {
      posToUser: this.posToUser,
      spouse: this,
      isUser: false,
      isSpouse: true,
    };
    this.spouse.update(defaults);

    return this.spouse;
  };

  /**
   * Adds descendent to this
   * @param {Relative} relative descendent
   */
  this.addDescendent = (relative = new Relative()) => {
    if (
      this.isChild ||
      this.isSpouse ||
      (this.getMaxPos() === 7 && !this.isUser)
    )
      return this;

    if (this.isUser) {
      const child = new Relative({
        posToUser: -1,
        parent: this,
        isUser: false,
        isChild: true,
      });
      this.update({ children: [...this.children, child] });
      return child;
    } else {
      const old = this.descendent;
      this.descendent = relative;
      if (old) {
        old.parent = this.descendent;
      }

      const defaults = {
        posToUser: this.posToUser,
        descendent: old,
        isUser: false,
        parent: this,
      };

      this.descendent.update(defaults);

      this.updatePosToUser(this, 1);
      return this.descendent;
    }
  };

  /**
   * Adds parent to this
   * @param {Relative} relative descendent
   */
  this.addParent = (relative = new Relative()) => {
    if (this.isSpouse || this.getMaxPos() === 7) return this;
    const old = this.parent;
    this.parent = relative;

    if (old) {
      if (old.isUser) return old;
      old.descendent = this.parent;
    }

    const defaults = {
      posToUser: this.posToUser,
      parent: old,
      descendent: this,
      isUser: false,
    };

    this.parent.update(defaults);

    if (this.parent.isUser) this.parent.posToUser = 0;
    else {
      this.updatePosToUser(this.parent, 1);
      this.update({ lira: false });
    }

    return this.parent;
  };

  /**
   * Gets the documents needed for this relative
   * @returns {Array} Documents needed for this relative
   */
  this.getDocuments = () => {
    const docs = [];
    docs.push(this.documentType.birth);
    if (this.isSpouse || this.isChild) return docs;
    if (this.spouse) docs.push(this.documentType.marriage);
    if (this.deceased) docs.push(this.documentType.deceased);
    if (this.divorced) docs.push(this.documentType.divorced);
    if (this.lira) docs.push(this.documentType.naturalization);
    return docs;
  };

  /**
   * Encodes Relative to Binary Str
   * 8bits
   * isChild, isSpouse, isUser, divorced, deceased, (3 bits) posToUser
   * @returns {string} - Relative as Encoded String
   */
  this.encode = () => {
    let res = "";
    res += this.isChild ? "1" : "0";
    res += this.isSpouse ? "1" : "0";
    res += this.isUser ? "1" : "0";
    res += this.divorced ? "1" : "0";
    res += this.deceased ? "1" : "0";
    res += this.isChild
      ? "000"
      : `${this.posToUser.toString(2)}`.padStart(3, "0");
    return res;
  };

  this.findEncodedRelative = (str) => {
    if (!str) return;
    const target = this.decode(str);

    /**
     * Gets the target relative (or user if target is child)
     * @param {Relative} relative - target relative
     * @returns {Relative|undefined} The Target Relative (User if searching for child)
     */
    const findRelative = (_this, relative) => {
      if (!_this || !relative) return;

      if (relative.isChild) {
        return findRelative(
          _this,
          new Relative({ isUser: true, posToUser: 0 })
        );
      }

      if (relative.posToUser === _this.posToUser) {
        if (
          (!relative.isSpouse && !_this.isSpouse) ||
          (relative.isSpouse && _this.isSpouse)
        )
          return _this;
        else return _this.spouse;
      }

      if (relative.posToUser > _this.posToUser) {
        if (_this.isSpouse) return findRelative(_this.spouse.parent, relative);
        else return findRelative(_this.parent, relative);
      }

      if (relative.posToUser < _this.posToUser) {
        if (_this.isSpouse)
          return findRelative(_this.spouse.descendent, relative);
        else return findRelative(_this.descendent, relative);
      }
    };
    return findRelative(this, target);
  };

  this.getMaxPos = () => {
    if (this.isSpouse) return this.spouse.getMaxPos();
    if (this.parent) return this.parent.getMaxPos();
    else return this.posToUser;
  };

  this.toJSX = ({
    addParent,
    addSpouse,
    addDescendent,
    updateRelative,
    remove,
    styles,
  } = {}) => {
    const title = this.getTitle(this);
    const docs = this.getDocuments();
    const encodedSpouse = this.spouse ? this.spouse.encode() : "";
    let spouseTitle = this.spouse ? this.spouse.getTitle(this.spouse) : "";
    if (this.isUser) {
      spouseTitle = spouseTitle.replace("Me ", "");
    } else spouseTitle = spouseTitle.replace(" Spouse", "");
    const spouseDocs = spouseTitle ? ["Birth Certificate"] : [];
    return makeRelativeJSX({
      ...this,
      encoded: this.encode(),
      title,
      docs,
      spouseTitle,
      spouseDocs,
      encodedSpouse,
      addParent,
      addSpouse,
      addDescendent,
      updateRelative,
      remove,
      styles,
    });
  };
}

/**
 * Makes JSX for Relative
 * @param {object} obj Relative Info
 * @returns JSX for a Relative
 */
const makeRelativeJSX = (obj = {}) => {
  const {
    styles,
    lira,
    isUser,
    encoded,
    encodedSpouse,
    addParent,
    addDescendent,
    addSpouse,
    updateRelative,
    remove,
  } = obj;
  return (
    <>
      {lira && (
        <button
          style={{
            padding: 0,
            margin: 0,
            border: "none",
            background: "transparent",
            width: "100%",
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.target.style.boxShadow = "none";
            e.target.classList.add("finished");
            addParent(encoded);
          }}
        >
          <MarbleBlock styles={styles}>
            <h3
              className={styles.title}
              style={{ marginBottom: "0", pointerEvents: "none" }}
            >
              Add Parent
            </h3>
          </MarbleBlock>
        </button>
      )}

      <MarbleBlock styles={styles}>
        {!isUser && (
          <button
            onClick={(e) => {
              e.target.style.boxShadow = "none";
              e.target.classList.add("finished");
              e.target.ontransitionend = () => {
                e.target.onClick = () => {};
                remove(encoded);
              };
            }}
            className={styles.btn}
          >
            <MarbleBlock noBackgroundImg={true} styles={styles} isInset={true}>
              <h3
                className={styles.title}
                style={{ marginBottom: "0", pointerEvents: "none" }}
              >
                Delete
              </h3>
            </MarbleBlock>
          </button>
        )}
        <Document
          {...obj}
          addParent={() => addParent(encoded)}
          addDescendent={() => addDescendent(encoded)}
          addSpouse={() => addSpouse(encoded)}
          removeSpouse={encodedSpouse ? () => remove(encodedSpouse) : undefined}
          updateRelative={(updates) => updateRelative(encoded, updates)}
        />
      </MarbleBlock>
      {isUser && (
        <button
          style={{
            padding: 0,
            margin: 0,
            border: "none",
            background: "transparent",
            width: "100%",
            cursor: 'pointer'
          }}
          onClick={(e) => {
            e.target.style.boxShadow = "none";
            e.target.classList.add("finished");
            addDescendent(encoded);
          }}
        >
          <MarbleBlock styles={styles}>
            <h3
              className={styles.title}
              style={{ marginBottom: "0", pointerEvents: "none" }}
            >
              Add Child
            </h3>
          </MarbleBlock>
        </button>
      )}
    </>
  );
};

Relative.prototype.getFamilyJSX = ({
  relative,
  addParent,
  addSpouse,
  addDescendent,
  updateRelative,
  remove,
  styles,
}) => {
  const user = relative.findUser(relative);
  const childrenItems = (user.children || []).map((c) =>
    c.toJSX({
      addParent,
      addSpouse,
      addDescendent,
      updateRelative,
      remove,
      styles,
    })
  );
  let curr = user;
  let jsxItems = [...childrenItems];
  while (curr) {
    jsxItems = [
      curr.toJSX({
        addParent,
        addSpouse,
        addDescendent,
        updateRelative,
        remove,
        styles,
      }),
      ...jsxItems,
    ];
    curr = curr.parent;
  }
  return <div className={styles.jsx}>{...jsxItems}</div>;
};

Relative.prototype.findUser = (relative) => {
  if (!relative) return undefined;
  if (relative.isUser) return relative;
  if (relative.isChild) return relative.parent;
  if (relative.isSpouse && relative.posToUser === 0) return relative.spouse;
  return relative.findUser(
    relative.isSpouse ? relative.spouse.descendent : relative.descendent
  );
};

/**
 *
 * @param {Relative} relative
 * @returns {string}
 */
Relative.prototype.encodeAllRelatives = (relative) => {
  const user = relative.findUser(relative);
  let result = "";
  result += (user.children || []).map((c) => c.encode()).join("");
  const queue = [user];
  while (queue.length) {
    const curr = queue.shift();
    result += curr.encode();
    if (curr.spouse) result += curr.spouse.encode();

    if (curr.parent) queue.push(curr.parent);
  }
  return result;
};

/**
 * Creates a Relative based on string
 * @param {string} str
 * @returns {Relative} - decoded Relative
 */
Relative.prototype.decode = (str) => {
  let strArr = str.split("");

  const posToUser = parseInt(strArr.splice(str.length - 3).join(""), 2);

  const [isChild, isSpouse, isUser, divorced, deceased] = strArr.map((b) =>
    b === "0" ? false : true
  );
  return new Relative({
    isChild,
    isSpouse,
    isUser,
    divorced,
    deceased,
    posToUser,
  });
};

Relative.prototype.splitStringByRelative = (str) => {
  const base = new Relative();
  let result = [];
  for (let i = 0; i < str.length; i += 8) {
    result.push(base.decode(str.slice(i, i + 8)));
  }
  return result;
};

Relative.prototype.combineRelatives = (relArr) => {
  if (!relArr.length) return;
  const user = relArr.find((r) => r.isUser);
  if (!user) return;
  for (let relative of relArr) {
    if (relative.isChild) {
      relative.update({ parent: user, posToUser: -1 });
      user.update({ children: [...(user.children || []), relative] });
    } else if (relative.isSpouse) {
      const relatedSpouse =
        relative.posToUser === 0
          ? user
          : relArr.find(
              (r) => r.posToUser === relative.posToUser && relative.isSpouse
            );

      if (relatedSpouse) {
        relative.update({ spouse: relatedSpouse });
        relatedSpouse.update({ spouse: relative });
      }
    } else {
      const parent = relArr.find((r) => r.posToUser === relative.posToUser + 1);
      if (parent) {
        parent.update({ descendent: relative });
        relative.update({ parent });
      } else {
        relative.update({ lira: true });
      }
    }
  }
  return user;
};

Relative.prototype.decodeAllRelatives = (str) => {
  const dummy = new Relative();
  return dummy.combineRelatives(dummy.splitStringByRelative(str));
};

/**
 * Document Types with associated Title strings
 */
Relative.prototype.documentType = {
  birth: "Birth Certificate",
  marriage: "Marriage Certificate",
  deceased: "Death Certificate",
  divorced: "All Divorce Records and CONA (certificate of no appeal)",
  naturalization: "Naturalization",
};

/**
 * Attributes to update from UI
 */
Relative.prototype.attributes = {
  //   isUser: "isUser",
  isChild: "isChild",
  isSpouse: "isSpouse",
  divorced: "divorced",
  deceased: "deceased",
  //   posToUser: "posToUser",
};

/**
 * Updates this and all parents and spouses of this or parents posToUser by 1
 * @param {Relative} relative the relative
 * @param {number} offset how many positions to append to
 */
Relative.prototype.updatePosToUser = (relative, offset) => {
  let curr = relative;

  while (curr) {
    curr.update({ posToUser: curr.posToUser + offset, lira: !curr.parent });

    if (curr.spouse)
      curr.spouse.update({ posToUser: curr.spouse.posToUser + offset });

    curr = curr.parent;
  }
};

/**
 * Gets all the documents needed in the family tree
 * @param {Relative} relative the relative
 * @returns {Map} all documents in the ancestral line
 */
Relative.prototype.getAllDocuments = (relative) => {
  const docs = new Map();

  if (!relative) return docs;
  const queue = [relative];
  while (queue.length) {
    const curr = queue.shift();
    let title = curr.getTitle(curr);

    if (!docs.get(title)) {
      if (curr.isChild) {
        let idx = 1;
        while (docs.get(title + ` ${idx}`)) idx++;
        title = title + ` ${idx}`;
      }
      docs.set(title, curr.getDocuments());

      if (curr.parent) {
        const parentTitle = curr.getTitle(curr.parent);
        if (!docs.get(parentTitle)) queue.push(curr.parent);
      }

      if (curr.descendent) {
        const descendentTitle = curr.getTitle(curr.descendent);
        if (!docs.get(descendentTitle)) queue.push(curr.descendent);
      }

      if (curr.spouse) {
        const spouseTitle = curr.getTitle(curr.spouse);
        if (!docs.get(spouseTitle)) queue.push(curr.spouse);
      }

      if (curr.children.length) queue.push(...curr.children);
    }
  }

  return docs;
};

/**
 * Gets the title of the Relative (if spouse append 'Spouse')
 * @param {Relative} relative - the relative
 * @returns The title of the relative
 */
Relative.prototype.getTitle = (relative) => {
  const titles = ["Me", "Parent", "Grandparent"];
  if (relative.isChild) return "Child";
  let suffix = "";
  if (relative.isSpouse) suffix += " Spouse";
  if (relative.posToUser > 2) {
    const localPos = relative.posToUser - 2;
    let prefix = "";
    for (let i = 0; i < localPos; i++) {
      prefix += "Great ";
    }
    return prefix + "Grandparent" + suffix;
  }
  return titles[relative.posToUser] + suffix;
};

export default Relative;
