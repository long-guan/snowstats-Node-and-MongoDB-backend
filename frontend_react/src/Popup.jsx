import Popup from "reactjs-popup";
import { useState, useEffect } from "react";

const InfoPopup = (props) => {
  const [underline, setUnderline] = useState("");
  const [popupFontSize, setPopupFontSize] = useState("16px");
  const [iconSize, setIconSize] = useState("20px");

  // make popup responsive
  useEffect(() => {
    getFontSize(props.mapperWidth);
    getIconSize(props.mapperWidth);
  }, [props.mapperWidth]);

  // make popup font size responsive
  function getFontSize(screenWidth) {
    if (screenWidth <= 475) {
      setPopupFontSize("6px");
    } else if (screenWidth <= 625) {
      setPopupFontSize("10px");
    } else if (screenWidth <= 1100) {
      setPopupFontSize("12px");
    } else {
      setPopupFontSize("16px");
    }
  }

  // make popup icon responsive
  function getIconSize(screenWidth) {
    if (screenWidth <= 475) {
      setIconSize("6px");
    } else if (screenWidth <= 625) {
      setIconSize("12px");
    } else if (screenWidth <= 1100) {
      setIconSize("16px");
    } else {
      setIconSize("20px");
    }
  }

  return (
    <Popup
      trigger={
        <div
          className="popup-dot-locator"
          style={{
            left: props.scaleRatio * props.left,
            top: props.scaleRatio * props.top,
          }}
        ></div>
      }
      position={props.position}
      open={props.open}
      contentStyle={{
        width: "auto",
        backgroundColor: "#FFF",
        textAlign: "center",
        fontWeight: "bold",
        position: "absolute",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        borderRadius: "10px",
        fontSize: popupFontSize,
      }}
      arrowStyle={{
        color: "#FFF",
      }}
      closeOnDocumentClick={false}
    >
      <div
        className={
          "flex flex-row items-center gap-1 cursor-pointer " + underline
        }
        onClick={() => {
          props.setRunSelection(props.name);
          props.setShowPanel(true);
        }}
        onMouseEnter={() => {
          setUnderline("underline");
        }}
        onMouseLeave={() => {
          setUnderline("");
        }}
      >
        <img src={props.icon} alt="" style={{ height: iconSize }} />
        {props.name}
      </div>
    </Popup>
  );
};

export default InfoPopup;
