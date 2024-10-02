const { default: QNode } = require("@/app/projects/italian-qualification/QNode");

test("empty has undefinded result", () => {
  const empty = new QNode();
  expect(empty.result).toBe(undefined);
});

test("test next with empty", () => {
  const empty = new QNode();
  expect(empty.next()).toBe(undefined);
});

test("test back with empty", () => {
  const empty = new QNode();
  expect(empty.back()).toBe(undefined);
});

test("test next with yes", () => {
  const node = new QNode({
    yes: new QNode({ result: "yes" }),
    no: new QNode({ result: "no" }),
  });
  const actual = node.next(true);
  expect(actual.result).toBe("yes");
});

test("test next with no", () => {
  const node = new QNode({
    yes: new QNode({ result: "yes" }),
    no: new QNode({ result: "no" }),
  });
  const actual = node.next(false);
  expect(actual.result).toBe("no");
});

test("test next with no back to parent", () => {
  const node = new QNode({
    result: "parent",
    yes: new QNode({ result: "yes" }),
    no: new QNode({ result: "no" }),
  });
  const actual = node.next(false).back();
  expect(actual.result).toBe("parent");
});

test("test next with yes back to parent", () => {
  const node = new QNode({
    result: "parent",
    yes: new QNode({ result: "yes" }),
    no: new QNode({ result: "no" }),
  });
  const actual = node.next(true).back();
  expect(actual.result).toBe("parent");
});

test("test next with yes back to parent to no", () => {
    const node = new QNode({
      result: "parent",
      yes: new QNode({ result: "yes" }),
      no: new QNode({ result: "no" }),
    });
    const actual = node.next(true).back().next(false);
    expect(actual.result).toBe("no");
  });

  test("test next with no back to parent to yes", () => {
    const node = new QNode({
      result: "parent",
      yes: new QNode({ result: "yes" }),
      no: new QNode({ result: "no" }),
    });
    const actual = node.next(false).back().next(true);
    expect(actual.result).toBe("yes");
  });

  test("test next with no back to parent to no", () => {
    const node = new QNode({
      result: "parent",
      yes: new QNode({ result: "yes" }),
      no: new QNode({ result: "no" }),
    });
    const actual = node.next(false).back().next(false);
    expect(actual.result).toBe("no");
  });
