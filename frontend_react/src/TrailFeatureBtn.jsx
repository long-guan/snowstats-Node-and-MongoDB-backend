import { useState } from "react";

function TrailFeatureBtn(props) {
  const [selected, setSelected] = useState(false);

  function addTrailFeature(btnId) {
    let copyTrailFeatures = Array.from(props.trailFeatures);
    copyTrailFeatures.push(btnId);
    props.setTrailFeatures(copyTrailFeatures);
  }

  function removeTrailFeature(btnId) {
    let copyTrailFeatures = [];
    for (let i = 0; i < props.trailFeatures.length; i++) {
      if (props.trailFeatures[i] !== btnId) {
        copyTrailFeatures.push(props.trailFeatures[i]);
      }
    }
    props.setTrailFeatures(copyTrailFeatures);
  }

  return (
    <button
      onClick={(e) => {
        setSelected(!selected);
        if (e.target.style.backgroundColor != "") {
          e.target.style.backgroundColor = "";
          removeTrailFeature(props.id);
        } else {
          e.target.style.backgroundColor = "#04ff006d";
          addTrailFeature(props.id);
        }
      }}
      type="button"
      className="trail-feature-btn"
    >
      {props.feature}
    </button>
  );
}

export default TrailFeatureBtn;
