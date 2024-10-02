import { MarbleBlock } from "../../dual-citizen/marble_ui";
import style from "./nodeForm.module.css";

const NodeForm = ({ node, setNode, reset, styles }) => {
  return (
    <div className={style.nodeContainer}>
      <FormSection {...node} reset={reset} styles={styles} setNode={setNode} />
    </div>
  );
};

const FormSection = ({
  question,
  parent,
  result,
  setNode,
  reset,
  yes,
  no,
  styles,
}) => {
  return (
    <div className={style.formSection}>
      {question && <h3 className={style.question}>{question}</h3>}
      {result && <h3 className={style.question}>{result}</h3>}
      <div style={{ width: "75%" }}>
        <div className={style.answerContainer}>
          {no && (
            <NodeNav
              label={"No"}
              fn={() => setNode((prev) => prev.next(false))}
              styles={styles}
            />
          )}
          {yes && (
            <NodeNav
              label={"Yes"}
              fn={() => setNode((prev) => prev.next(true))}
              styles={styles}
            />
          )}
        </div>
        {parent && (
          <NodeNav
            label="Back"
            fn={() => setNode((prev) => prev.back())}
            styles={styles}
          />
        )}
        {result && (
          <NodeNav
            styles={styles}
            label={"Try with another relative line."}
            fn={() => reset()}
          />
        )}
      </div>
    </div>
  );
};

const NodeNav = ({ label, fn, styles }) => {
  return (
    <button className={style.nodeBtn} onClick={() => fn()}>
      <MarbleBlock styles={styles}>
        <h3
          className={styles.title}
          style={{ marginBottom: "0", pointerEvents: "none" }}
        >
          {label}
        </h3>
      </MarbleBlock>
    </button>
  );
};

// marble block css

export default NodeForm;
