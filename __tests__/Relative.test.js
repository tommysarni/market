const { default: Relative } = require("@/app/projects/italian-documents/Relative");

test("test props of empty relative", () => {
  const empty = new Relative();
  expect(empty.isUser).toBe(undefined);
  expect(empty.lira).toBe(false);
});

test("test props of user relative", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  expect(user.isUser).toBe(true);
  expect(user.posToUser).toBe(0);
});

test("test posToUser of addSpouse to user ", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  expect(user.spouse.posToUser).toBe(0);
});

test("test posToUser of addSpouse to user: pos 1", () => {
  const user = new Relative({ isUser: true, posToUser: 1 });
  user.addSpouse();
  expect(user.spouse.posToUser).toBe(1);
});

test("test self, addSpouse then spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  expect(user.spouse.spouse.isUser).toBe(true);
});
test("test spouse, addSpouse then spouse then spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  expect(user.spouse.spouse.spouse.isUser).toBe(false);
});
test("addSpouse if already spouse not divorced", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse().addSpouse();
  expect(user.spouse.posToUser).toBe(0);
  expect(user.spouse.spouse.posToUser).toBe(0);
  expect(user.spouse.spouse.isUser).toBe(true);
});

test("test descendent, addDescendent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  expect(user.descendent).toBe(undefined);
  expect(user.children.length).toBe(1);
  expect(user.children[0].posToUser).toBe(-1);
  expect(user.children[0].parent.isUser).toBe(true);
});

test("test descendent, addDescendent not User", () => {
  const user = new Relative({ isUser: false, posToUser: 2 });
  user.addDescendent();
  expect(user.descendent.posToUser).toBe(2);
  expect(user.posToUser).toBe(3);
});

test("test self, addDescendent then parent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  expect(user.children[0].parent.posToUser).toBe(0);
});

test("test self, addParent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent();
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.lira).toBe(true);
});

test("test self, addParent to child", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent().addParent();
  expect(user.posToUser).toBe(0);
  expect(user.children[0].posToUser).toBe(-1);
});

test("test multiple add parent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent();

  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.lira).toBe(false);
  expect(user.parent.parent.posToUser).toBe(2);
  expect(user.parent.parent.lira).toBe(true);
});

test("test multiple add parent then add descendent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent();
  user.parent.addDescendent();

  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.parent.posToUser).toBe(2);
});

test("test add parents unit", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent();
  user.parent.addSpouse();
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.spouse.posToUser).toBe(1);
  expect(user.parent.spouse.lira).toBe(false);
  expect(user.parent.spouse.spouse.descendent.isUser).toBe(true);
});

test("test add grandparent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent();
  user.addParent();
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.parent.posToUser).toBe(2);
});

test("test add parents unit 2", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addSpouse();
  user.parent.addDescendent();
  expect(user.posToUser).toBe(0);
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.parent.posToUser).toBe(2);
  expect(user.parent.parent.spouse.posToUser).toBe(2);
});

test("test add big family", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent(); // adds child
  user
    .addParent() // parent
    .addParent() // grandparent
    .addParent(); // great grandparent
  expect(user.children[0].posToUser).toBe(-1);
  expect(user.posToUser).toBe(0);
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.parent.posToUser).toBe(2);
  expect(user.parent.parent.lira).toBe(false);
  expect(user.parent.parent.parent.posToUser).toBe(3);
  expect(user.parent.parent.parent.lira).toBe(true);
});

test("test add big family 2 (change order of add", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent(); // adds child
  user
    .addParent() // parent
    .addParent() // great-grandparent
    .addDescendent(); // grandparent
  expect(user.children[0].posToUser).toBe(-1);
  expect(user.posToUser).toBe(0);
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.parent.posToUser).toBe(2);
});

test('remove self', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.remove()
  expect(user.isUser).toBe(true);
  expect(user.posToUser).toBe(0);
})

test('remove parent', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().remove()

  expect(user.parent).toBe(undefined);
  expect(user.posToUser).toBe(0);
})

test('remove parent with grandparent', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent()
  user.parent.remove()

  expect(user.parent.posToUser).toBe(1);
  expect(user.posToUser).toBe(0);
})

test('remove grandparent ', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent().remove()
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.lira).toBe(true);
  expect(user.posToUser).toBe(0);
})

test('remove child ', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent().remove()
  expect(user.posToUser).toBe(0);
  expect(user.children.length).toBe(0);
})

test('remove child 2 fake', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent().addDescendent().remove()
  expect(user.posToUser).toBe(0);
  expect(user.children.length).toBe(0);
})

test('remove child 2 ', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent()
  user.addDescendent().remove()
  expect(user.posToUser).toBe(0);
  expect(user.children.length).toBe(1);
})

test('remove spouse ', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse().remove()
  expect(user.spouse).toBe(undefined);
  expect(user.posToUser).toBe(0);
})

test('remove parent spouse ', () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addSpouse().remove()
  expect(user.parent.spouse).toBe(undefined);
  expect(user.parent.posToUser).toBe(1);
  expect(user.posToUser).toBe(0);
})

test("updatePosToUser", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  const parent = user.addParent();
  parent.updatePosToUser(parent, 1);
  expect(user.parent.posToUser).toBe(2);
});

test("test getTitle me", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  expect(user.getTitle(user)).toBe("Me");
});

test("test getTitle spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  expect(user.getTitle(user.spouse)).toBe("Me Spouse");
});
test("test getTitle child", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  expect(user.getTitle(user.children[0])).toBe("Child");
});
test("test getTitle parent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent();
  expect(user.getTitle(user.parent)).toBe("Parent");
});
test("test getTitle Grandparent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent();
  expect(user.getTitle(user.parent.parent)).toBe("Grandparent");
});
test("test getTitle Great Grandparent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent().addParent();
  expect(user.getTitle(user.parent.parent.parent)).toBe("Great Grandparent");
});
test("test getTitle Great Graet Grandparent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent().addParent().addParent();
  expect(user.getTitle(user.parent.parent.parent.parent)).toBe(
    "Great Great Grandparent"
  );
});

test("test getAllDocs me", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([user.documentType.birth]);
});
test("test getAllDocs me spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
  ]);
  expect(allDocs.get("Me Spouse")).toEqual([user.documentType.birth]);
});

test("test getAllDocs me grandparents", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addSpouse();
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Parent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
    user.documentType.naturalization,
  ]);
  expect(allDocs.get("Parent Spouse")).toEqual([user.documentType.birth]);
});

test("test getAllDocs me children", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  user.addDescendent();
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Child 1")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Child 2")).toEqual([user.documentType.birth]);
});
test("test getAllDocs sample fam", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent().addParent(new Relative({ deceased: true }));
  user.parent.addSpouse();
  user.parent.parent.addSpouse();
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Parent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
  ]);
  expect(allDocs.get("Parent Spouse")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Grandparent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
    user.documentType.deceased,
    user.documentType.naturalization,
  ]);
  expect(allDocs.get("Grandparent Spouse")).toEqual([user.documentType.birth]);
});
test("test getAllDocs sample fam with divorce", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user
    .addParent()
    .addParent(new Relative({ deceased: true }))
    .addParent(new Relative({ deceased: true, divorced: true }));
  user.parent.addSpouse();
  user.parent.parent.addSpouse();
  user.parent.parent.parent.addSpouse();
  const allDocs = user.getAllDocuments(user);
  expect(allDocs.get("Me")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Parent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
  ]);
  expect(allDocs.get("Parent Spouse")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Grandparent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
    user.documentType.deceased,
  ]);
  expect(allDocs.get("Grandparent Spouse")).toEqual([user.documentType.birth]);
  expect(allDocs.get("Great Grandparent")).toEqual([
    user.documentType.birth,
    user.documentType.marriage,
    user.documentType.deceased,
    user.documentType.divorced,
    user.documentType.naturalization,
  ]);
  expect(allDocs.get("Great Grandparent Spouse")).toEqual([
    user.documentType.birth,
  ]);
});

test("encoding me", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  expect(user.encodeAllRelatives(user)).toBe("00100000");
});

test("encoding me child", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  const childStr = "10000000";
  expect(user.encodeAllRelatives(user)).toBe(childStr + "00100000");
});

test("encoding me 2 children", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent();
  user.addDescendent();
  const childStr = "10000000";
  expect(user.encodeAllRelatives(user)).toBe(childStr + childStr + "00100000");
});

test("encoding me granparent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent(new Relative({ deceased: true })).addDescendent();
  const parentStr = "00000001";
  const grandparentStr = "00001010";
  expect(user.encodeAllRelatives(user)).toBe(
    "00100000" + parentStr + grandparentStr
  );
});

test("encoding me parent spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addSpouse();
  user.addParent();
  const parentStr = "00000001";
  const spouseStr = "01000000";
  expect(user.encodeAllRelatives(user)).toBe(
    "00100000" + spouseStr + parentStr
  );
});

test("encoding me parent spouse start from spouse", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  const spouse = user.addSpouse();
  const parent = user.addParent();
  const parentStr = "00000001";
  const spouseStr = "01000000";
  expect(user.encodeAllRelatives(spouse)).toBe(
    "00100000" + spouseStr + parentStr
  );
});
test("encoding me parent spouse start from parent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  const spouse = user.addSpouse();
  const parent = user.addParent();
  const parentStr = "00000001";
  const spouseStr = "01000000";
  expect(user.encodeAllRelatives(parent)).toBe(
    "00100000" + spouseStr + parentStr
  );
});

test("test decode me", () => {
  const dummy = new Relative();
  const user = "00100000";
  expect(dummy.decode(user).isUser).toBe(true);
});

test("test decode child", () => {
  const dummy = new Relative();
  const child = "10000000";
  const decoded = dummy.decode(child);
  expect(decoded.isUser).toBe(false);
  expect(decoded.isChild).toBe(true);
});

test("test decode deceased great grandparent", () => {
  const dummy = new Relative();
  const deceasedGreatGrandparent = "00001011";
  const decoded = dummy.decode(deceasedGreatGrandparent);
  expect(decoded.isUser).toBe(false);
  expect(decoded.isChild).toBe(false);
  expect(decoded.posToUser).toBe(3);
  expect(decoded.deceased).toBe(true);
});

test("splitStringByRelative me", () => {
  const dummy = new Relative();
  const me = "00100000";
  const arr = dummy.splitStringByRelative(me);
  expect(arr.length).toBe(1);
  expect(arr[0].isUser).toBe(true);
});

test("splitStringByRelative child me parent", () => {
  const dummy = new Relative();
  const child = "10000000";
  const me = "00100000";
  const parent = "00010001";
  const all = `${child}${me}${parent}`;
  const arr = dummy.splitStringByRelative(all);

  expect(arr.length).toBe(3);
  expect(arr[0].isChild).toBe(true);
  expect(arr[1].isUser).toBe(true);
  expect(arr[2].divorced).toBe(true);
  expect(arr[2].posToUser).toBe(1);
});

test("combineRelatives me", () => {
  const dummy = new Relative();
  const user = new Relative({ isUser: true, posToUser: 0 });
  expect(dummy.combineRelatives([user]).isUser).toBe(true);
});

test("combineRelatives me child", () => {
  const dummy = new Relative();
  const me = new Relative({ isUser: true, posToUser: 0 });
  const child = new Relative({ isChild: true, posToUser: 0 });
  const user = dummy.combineRelatives([child, me]);
  expect(user.isUser).toBe(true);
  expect(user.children.length).toBe(1);
  expect(user.children[0].isChild).toBe(true);
  expect(user.children[0].parent.isUser).toBe(true);
});

test("combineRelatives me child 2", () => {
  const dummy = new Relative();
  const me = new Relative({ isUser: true, posToUser: 0 });
  const child = new Relative({ isChild: true, posToUser: 0 });
  const user = dummy.combineRelatives([child, child, me]);
  expect(user.isUser).toBe(true);
  expect(user.children.length).toBe(2);
  expect(user.children[0].isChild).toBe(true);
  expect(user.children[0].parent.isUser).toBe(true);
  expect(user.children[1].isChild).toBe(true);
  expect(user.children[1].parent.isUser).toBe(true);
});

test("combineRelatives me spouse parent parent spouse", () => {
  const dummy = new Relative();
  const me = new Relative({ isUser: true, posToUser: 0 });
  const spouse = new Relative({ isSpouse: true, posToUser: 0 });
  const parent = new Relative({ posToUser: 1 });
  const parentSpouse = new Relative({ isSpouse: true, posToUser: 1 });
  const user = dummy.combineRelatives([me, spouse, parent, parentSpouse]);
  expect(user.isUser).toBe(true);
  expect(user.spouse.isSpouse).toBe(true);
  expect(user.spouse.spouse.isUser).toBe(true);
  expect(user.parent.descendent.isUser).toBe(true);
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.spouse.posToUser).toBe(1);
  expect(user.parent.spouse.spouse.descendent.isUser).toBe(true);
});

test("test decodeAllRelatives", () => {
  const dummy = new Relative();
  // child spouse user divorced deceased posToUser

  const child = "10000000";
  const me = "00100000";
  const spouse = "01000000";
  const deceased_parent = "00001001";
  const parent_spouse = "01000001";
  const grandparent = "00011010";
  const grandparent_spouse = "01001010";
  const great_grandparent = "00001011";
  const great_grandparent_spouse = "01001011";
  const all = [
    child,
    child,
    me,
    spouse,
    deceased_parent,
    parent_spouse,
    grandparent,
    grandparent_spouse,
    great_grandparent,
    great_grandparent_spouse,
  ].join("");
  const user = dummy.decodeAllRelatives(all);

  expect(user.isUser).toBe(true);
  expect(user.children.length).toBe(2);
  expect(user.children[0].parent.isUser).toBe(true);
  expect(user.children[1].parent.isUser).toBe(true);
  expect(user.children[1].posToUser).toBe(-1);
  expect(user.spouse.isSpouse).toBe(true);
  expect(user.spouse.spouse.isUser).toBe(true);
  expect(user.parent.spouse.posToUser).toBe(1);
  expect(user.parent.spouse.isSpouse).toBe(true);
  expect(user.parent.spouse.spouse.posToUser).toBe(1);
  expect(user.parent.posToUser).toBe(1);
  expect(user.parent.deceased).toBe(true);
  expect(user.parent.descendent.isUser).toBe(true);
  expect(user.parent.parent.posToUser).toBe(2);
  expect(user.parent.parent.divorced).toBe(true);
  expect(user.parent.parent.deceased).toBe(true);
  expect(user.parent.parent.spouse.posToUser).toBe(2);
  expect(user.parent.parent.spouse.spouse.posToUser).toBe(2);
  expect(user.parent.parent.descendent.descendent.isUser).toBe(true);
  expect(user.parent.parent.parent.posToUser).toBe(3);
});

test('decode relative break test', () => {
  
})

test("findEncodedRelative me", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  const found = user.findEncodedRelative("00100000");
  expect(found.isUser).toBe(true);
});

test("findEncodedRelative me child", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addDescendent()
  const found = user.findEncodedRelative("10000000");
  expect(found.isUser).toBe(true);
});

test("findEncodedRelative me parent", () => {
  const user = new Relative({ isUser: true, posToUser: 0 });
  user.addParent()
  const found = user.findEncodedRelative("00000001");
  expect(found.descendent.isUser).toBe(true);
});

