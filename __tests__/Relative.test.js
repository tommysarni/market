const { default: Relative } = require("@/app/dual-citizen/Relative");

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
  expect(allDocs.get("Great Grandparent Spouse")).toEqual([user.documentType.birth]);
});
