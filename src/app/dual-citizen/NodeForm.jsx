import style from "./nodeForm.module.css";

const NodeForm = ({ node, setNode, reset }) => {
  return (
    <div className={style.nodeContainer}>
      {!node.result && <FormSection {...node} setNode={setNode} />}
      {node.result && (
        <ResultSection {...node} setNode={setNode} reset={reset} />
      )}
    </div>
  );
};

const FormSection = ({ question, parent, setNode, yes, no }) => {
  return (
    <div className={style.formSection}>
      {question && <Question question={question} />}
      <div className={style.answerContainer}>
        {no && (
          <NodeNav
            label={"No"}
            fn={() => setNode((prev) => prev.next(false))}
          />
        )}
        {yes && (
          <NodeNav
            label={"Yes"}
            fn={() => setNode((prev) => prev.next(true))}
          />
        )}
      </div>
      {parent && (
        <NodeNav label="Back" fn={() => setNode((prev) => prev.back())} />
      )}
    </div>
  );
};

const ResultSection = ({ result, parent, reset, setNode }) => {
  return (
    <div className={style.resultSection}>
      <p>{result}</p>
      {parent && (
        <NodeNav label="Back" fn={() => setNode((prev) => prev.back())} />
      )}
      <NodeNav label={"Try with another relative line."} fn={() => reset()} />
    </div>
  );
};

const Question = ({ question }) => {
  return (
    <div>
      <p>{question}</p>
    </div>
  );
};

const NodeNav = ({ label, fn }) => {
  return (
    <div>
      <button onClick={() => fn()}>{label}</button>
    </div>
  );
};

export default NodeForm;
