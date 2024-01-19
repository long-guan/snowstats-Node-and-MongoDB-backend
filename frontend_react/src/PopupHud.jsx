import InfoPopup from "./Popup";
import stevens_pass_runs from "./assets/stevens_pass_runs.json";
import { selectIcon } from "./helperFunctions";

function PopupHud(props) {
  return (
    <div
      style={{ width: props.mapperWidth, height: props.mapperHeight }}
      className="popuphud"
    >
      {stevens_pass_runs.map((run) => (
        <InfoPopup
          key={run.name}
          name={run.title}
          icon={selectIcon(run.category)}
          scaleRatio={props.scaleRatio}
          open={props.open[run.name]}
          setRunSelection={props.setRunSelection}
          position={run.popup_settings.position}
          left={run.popup_settings.left}
          top={run.popup_settings.top}
          setShowPanel={props.setShowPanel}
          showPanel={props.showPanel}
          mapperWidth={props.mapperWidth}
        />
      ))}
    </div>
  );
}

export default PopupHud;
