import { useState } from "react";

function SnowConditionBtn(props) {
  const [selected, setSelected] = useState(false);

  function addSnowCondition(btnId) {
    let copySnowConditions = Array.from(props.snowConditions);
    copySnowConditions.push(btnId);
    props.setSnowConditions(copySnowConditions);
  }

  function removeSnowCondition(btnId) {
    let copySnowConditions = [];
    for (let i = 0; i < props.snowConditions.length; i++) {
      if (props.snowConditions[i] !== btnId) {
        copySnowConditions.push(props.snowConditions[i]);
      }
    }
    props.setSnowConditions(copySnowConditions);
  }

  return (
    <button
      onClick={(e) => {
        setSelected(!selected);
        if (e.target.style.backgroundColor != "") {
          e.target.style.backgroundColor = "";
          removeSnowCondition(props.id);
        } else {
          e.target.style.backgroundColor = "#04ff006d";
          addSnowCondition(props.id);
        }
      }}
      type="button"
      className="snow-condition-btn"
    >
      {props.condition}
    </button>
  );
}

export default SnowConditionBtn;
