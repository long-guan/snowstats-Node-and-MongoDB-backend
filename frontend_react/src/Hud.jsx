import SearchBar from "./SearchBar";
import ProfileSignIn from "./ProfileSignIn";
import HudCategoryBtn from "./HudCategoryBtn";
import green_circle from "./assets/green_circle.webp";
import blue_square from "./assets/blue_square.webp";
import black_diamond from "./assets/black_diamond.webp";
import double_black_diamond from "./assets/double_black_diamond.webp";
import chair_lift from "./assets/chair_lift.webp";
// import { useEffect } from "react";
import { createOpenArray } from "./helperFunctions";

function Hud(props) {
  function openPopups(indexStart, indexEnd) {
    let openArray = [];
    for (let i = 0; i <= 49; i++) {
      if (i >= indexStart && i <= indexEnd) {
        openArray.push(true);
      } else {
        openArray.push(false);
      }
    }
    props.setOpen(openArray);
    props.setPopupOpened(true);
  }

  function toggleOnOff(idx) {
    if (props.toggle[idx] === "") {
      props.setDisabled(true);
      // props.setImgClickDisabled(true);
      let newToggle = ["", "", "", "", ""];
      newToggle[idx] = "underline decoration-2";
      props.setToggle(newToggle);
      // green runs
      if (idx === 0) {
        openPopups(0, 3);
      }
      // blue runs
      else if (idx === 1) {
        openPopups(4, 22);
      }
      // black runs
      else if (idx === 2) {
        openPopups(23, 31);
      }
      // double black runs
      else if (idx === 3) {
        openPopups(32, 41);
      }
      // chairlifts
      else {
        openPopups(42, 49);
      }
    } else {
      props.setPopupOpened(false);
      props.setDisabled(false);
      props.setImgClickDisabled(false);
      props.setToggle(["", "", "", "", ""]);
      props.setOpen(createOpenArray());
    }
  }

  return (
    <div className="hud">
      <ProfileSignIn />
      <div className="flex flex-row gap-1 categorybtn-cont">
        <HudCategoryBtn
          src={green_circle}
          toggle={props.toggle}
          toggleOnOff={toggleOnOff}
          toggleIdx={0}
          alt="green runs"
          btnName="Easiest"
        />
        <HudCategoryBtn
          src={blue_square}
          toggle={props.toggle}
          toggleOnOff={toggleOnOff}
          toggleIdx={1}
          alt="blue runs"
          btnName="More Difficult"
        />
        <HudCategoryBtn
          src={black_diamond}
          toggle={props.toggle}
          toggleOnOff={toggleOnOff}
          toggleIdx={2}
          alt="black runs"
          btnName="Advanced"
        />
        <HudCategoryBtn
          src={double_black_diamond}
          toggle={props.toggle}
          toggleOnOff={toggleOnOff}
          toggleIdx={3}
          alt="double black runs"
          btnName="Experts Only"
        />
        <HudCategoryBtn
          src={chair_lift}
          toggle={props.toggle}
          toggleOnOff={toggleOnOff}
          toggleIdx={4}
          alt="chair lifts"
          btnName="Chairlifts"
        />
      </div>
      <SearchBar
        openRunSelection={props.openRunSelection}
        runSelection={props.runSelection}
        setRunSelection={props.setRunSelection}
        setDisabled={props.setDisabled}
        setOpen={props.setOpen}
        setToggle={props.setToggle}
        showPanel={props.showPanel}
        setShowPanel={props.setShowPanel}
        mapperWidth={props.mapperWidth}
      />
    </div>
  );
}

export default Hud;
