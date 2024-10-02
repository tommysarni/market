import marble from "./marble_texture.jpg";

const MarbleBlock = ({
  noBackgroundImg = false,
  isInset = false,
  styles = {},
  children,
}) => {
  const marbleContainer = {
    // backgroundImage: noBackgroundImg ? "" : `url(${marble.src})`,
  };

  let contentStyles = [styles.marbleContent];
  if (isInset) contentStyles.push(styles.insetMarbleContent);

  return (
    <div className={styles.marbleContainer} style={marbleContainer}>
      <div className={contentStyles.join(" ")}>{children}</div>
    </div>
  );
};

const Document = ({
  isUser,
  isChild,
  title,
  deceased,
  divorced,
  docs,
  spouseTitle,
  spouseDocs,
  styles,
  addParent,
  addSpouse,
  removeSpouse,
  addDescendent,
  updateRelative,
}) => {
  return (
    <div className={styles.columns}>
      <div className={styles.documentContainer}>
        <div className={styles.documentContent}>
          <h3 className={styles.title}>{title}</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            {!(isUser || isChild) && (
              <div className={styles.inputDiv}>
                <input
                  type="checkbox"
                  id={`${title}_deceased`}
                  checked={deceased}
                  onChange={(e) =>
                    updateRelative({ deceased: e.target.checked })
                  }
                />
                <label htmlFor={`${title}_deceased`}>Deceased</label>
              </div>
            )}
            {!((isUser && !spouseTitle) || isChild) && (
              <div className={styles.inputDiv} >
                <input
                  type="checkbox"
                  id={`${title}_divorced`}
                  checked={divorced}
                  onChange={(e) =>
                    updateRelative({ divorced: e.target.checked })
                  }
                />
                <label htmlFor={`${title}_divorced`}>Divorced</label>
              </div>
            )}
          </div>
          {docs.length && (
            <ul className={styles.docs}>
              {docs.map((d) => (
                <li key={`${title}_${d}`}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {spouseTitle && spouseDocs.length && (
        <div className={styles.documentContainer}>
          <div className={styles.documentContent}>
            <h3 className={styles.title}>{spouseTitle}</h3>
            <ul className={styles.docs}>
              {spouseDocs.map((d) => (
                <li key={`${spouseTitle}_${d}`}>{d}</li>
              ))}
            </ul>
          </div>
          {isUser && (
            <button
              onClick={(e) => {
                e.target.style.boxShadow = "none";
                e.target.classList.add("finished");
                e.target.ontransitionend = () => {
                  e.target.onClick = () => {};
                  removeSpouse();
                };
              }}
              style={{border: 'none', background: 'transparent', cursor: 'pointer'}}
            >
              <MarbleBlock noBackgroundImg={true} styles={styles} isInset={true}>
                <h3
                  className={styles.title}
                  style={{ marginBottom: "0", pointerEvents: "none" }}
                >
                  Remove Spouse
                </h3>
              </MarbleBlock>
            </button>
          )}
        </div>
        
      )}
      {!spouseTitle && !isChild && (
        <div className={styles.documentContainer}>
          <div className={styles.documentContent}>
            <button
              onClick={(e) => {
                e.target.style.boxShadow = "none";
                e.target.classList.add("finished");
                e.target.ontransitionend = () => {
                  addSpouse();
                };
              }}
              style={{
                padding: 0,
                margin: 0,
                border: "none",
                background: "transparent",
                width: "100%",
                cursor: 'pointer'
              }}
            >
              <MarbleBlock noBackgroundImg={true} styles={styles} isInset={true}>
                <h3
                  className={styles.title}
                  style={{ marginBottom: "0", pointerEvents: "none" }}
                >
                  Add Spouse
                </h3>
              </MarbleBlock>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export { MarbleBlock, Document };
