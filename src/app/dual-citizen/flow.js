const { default: QNode } = require("./QNode");

const qualified = new QNode({
  result:
    "You qualify for recognition of Italian Citizenship via Administrative Process!",
});
const qualifiedJudicial = new QNode({
  result:
    "You qualify for recognition of Italian Citizenship via Jusdicial Process!",
});
const unqualified = new QNode({
  result:
    "You do not qualify for recognition of Italian Citizenship through this line of ancestry.",
});

const renounceQuestion =
  "Did you or anyone in your line of citizenship transmission ever formally renounce Italian citizenship before an Italian authority?";

const didRenounceWithoutFemale = new QNode({
  question: renounceQuestion,
  yes: unqualified,
  no: qualified,
});

const didRenounceWithFemaleBefore1948 = new QNode({
  question: renounceQuestion,
  yes: unqualified,
  no: qualifiedJudicial,
});

const childOfFemaleBornAfter1948 = new QNode({
  question: "Was the child of your female ancestor born on/after Jan 1, 1948?",
  yes: didRenounceWithoutFemale,
  no: didRenounceWithFemaleBefore1948,
});

const anyFemales = new QNode({
  question:
    "Are there any females in your line of Italian citizenship transmission?",
  yes: childOfFemaleBornAfter1948,
  no: didRenounceWithoutFemale,
});

const acquireForeignBefore1992 = new QNode({
  question:
    "Did your Italian ancestor acquire a foreign citizenship before August 16, 1992, before the birth of the next person in line of citizenship transmission? (or while the next person in line was still a minor and born in a non jus-soli country)",
  yes: unqualified,
  no: anyFemales,
});

const acquireForeignBefore1912 = new QNode({
  question:
    "Did your Italian ancestor acquire a foreign citizenship before July 1, 1912, while the next person in line of citizenship transmission was still a minor?",
  yes: unqualified,
  no: acquireForeignBefore1992,
});

const natOrDie = new QNode({
  question:
    "Did your Italian Ancestor naturalize or die before March 17, 1861?",
  yes: unqualified,
  no: acquireForeignBefore1912,
});

const flow = new QNode({
  question: "Do you have an Italian Ancestor?",
  yes: natOrDie,
  no: unqualified,
});

export default flow