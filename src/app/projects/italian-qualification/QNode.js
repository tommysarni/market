/**
 * Qualification Node for the Are you Qualified? Flow
 * @typedef {Object} QNode
 * @property {string|undefined} result - true if qualify, false if don't, undefined if too early to tell
 * @property {string|undefined} question - Question of the Node
 * @property {QNode|undefined} yes - Next QNode if choose yes
 * @property {QNode|undefined} no - Next QNode if choose no
 * @property {QNode|undefined} parent - Previous QNode
 */
function QNode({ result, question, yes, no } = {}) {
  this.result = result;
  this.question = question;
  this.yes = yes;
  this.no = no;

  this.next = (answer) => {
    const choice = answer ? yes : no;
    if (choice) {
      choice.parent = this
      return choice;
    } 
  };
  this.back = () => {
    if (this.parent) {
      return this.parent;
    }
  };
}

export default QNode;
