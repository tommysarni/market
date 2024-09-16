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
    if (this.isSpouse) return this;
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
    if (this.isSpouse) return this;
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
}

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
