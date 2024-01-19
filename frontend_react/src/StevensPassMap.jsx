// import ImageMapper from "react-img-mapper";
import ImageMapper from "/react-img-mapper/src/imagemapper.tsx";
import stevens_pass_map from "./assets/stevens_pass_map.webp";
import stevens_pass_runs from "./assets/stevens_pass_runs.json";
import { useState, useEffect } from "react";
import Hud from "./Hud";
import PopupHud from "./PopupHud";
import { createOpenArray } from "./helperFunctions";

function StevensPassMap() {
  const [mapperWidth, setMapperWidth] = useState(null); // sets the width of the client screen
  const [mapperHeight, setMapperHeight] = useState(null);
  const [runSelection, setRunSelection] = useState("");
  const [scaleRatio, setScaleRatio] = useState(null); // used to scale the HUD and PopupHud
  const [open, setOpen] = useState(() => createOpenArray()); // array to toggle tooltip where index associates to the area name
  const [disabled, setDisabled] = useState(false); // toggles the hover to show tooltips
  const [imgClickDisabled, setImgClickDisabled] = useState(false); // allows clicking of runs/lifts
  const [toggle, setToggle] = useState(["", "", "", "", ""]); // toggle use to control category btn selection
  const [showPanel, setShowPanel] = useState(false); // shows or hides side panel
  const [popupOpened, setPopupOpened] = useState(false); // for performance improvement since comparing an array of 49 values is too slow. used to track if any popups are opened

  const MAP = {
    name: "stevenspassmap",
    areas: stevens_pass_runs,
  };

  // returns width of client screen
  const viewWidth = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  );

  // toogles on the tooltip of the searched run inside runSelection
  function openRunSelection(runName = runSelection) {
    stevens_pass_runs.forEach((run) => {
      if (run.title.toLowerCase() === runName.toLowerCase()) {
        let openArray = createOpenArray();
        openArray[run.name] = true;
        setOpen(openArray);
      }
    });
  }

  // turns on the tooltip when hover over the area
  const handleEnterHover = (area) => {
    let copyOpen = Array.from(open);
    copyOpen[area.name] = true;
    setOpen(copyOpen);
  };

  const handleClick = (area) => {
    setRunSelection(area.title);
    setShowPanel(true); // opens side panel
  };

  // updates dimensions whenever the screen resizes
  // closes any opened popups whenever screen resizes
  window.addEventListener("resize", () => {
    setMapperWidth(document.documentElement.clientWidth);
    setMapperHeight(document.documentElement.clientWidth * (1452 / 2400));
    setScaleRatio(document.documentElement.clientWidth / 2400);
    if (popupOpened === true) {
      setOpen(createOpenArray());
      setDisabled(false);
      setImgClickDisabled(false);
      setToggle(["", "", "", "", ""]);
      setPopupOpened(false);
    }
  });

  useEffect(() => {
    setMapperWidth(viewWidth); // sets initial screen width
    setMapperHeight(viewWidth * (1452 / 2400)); // trail map is 2400x1452
    setScaleRatio(viewWidth / 2400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ImageMapper
        onClick={handleClick}
        onMouseEnter={handleEnterHover}
        responsive={true}
        parentWidth={mapperWidth}
        src={stevens_pass_map}
        map={MAP}
        active={false}
        onImageClick={() => {
          if (imgClickDisabled === false) {
            setOpen(createOpenArray()); // closes all tooltips
            setDisabled(false); // enables hover to show tooltip
            setToggle(["", "", "", "", ""]); // turns off all category btn
            setShowPanel(false); // hides the side panel
          }
        }}
        disabled={disabled} // toggles hover for tooltips
      />
      <Hud
        toggle={toggle}
        setToggle={setToggle}
        runSelection={runSelection}
        setRunSelection={setRunSelection}
        mapperHeight={mapperHeight}
        mapperWidth={mapperWidth}
        setOpen={setOpen}
        setDisabled={setDisabled}
        setImgClickDisabled={setImgClickDisabled}
        openRunSelection={openRunSelection}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        setPopupOpened={setPopupOpened}
      />
      <PopupHud
        scaleRatio={scaleRatio}
        mapperHeight={mapperHeight}
        mapperWidth={mapperWidth}
        open={open}
        setRunSelection={setRunSelection}
        setShowPanel={setShowPanel}
        showPanel={showPanel}
        setPopupOpened={setPopupOpened}
      />
    </div>
  );
}

export default StevensPassMap;
