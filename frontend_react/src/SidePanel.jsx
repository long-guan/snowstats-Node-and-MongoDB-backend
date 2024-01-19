import { useState, useEffect } from "react";
import right_arrow from "./assets/right_arrow.webp";
import ski_lift_picture from "./assets/ski_lift_picture.webp";
import stevens_pass_runs from "./assets/stevens_pass_runs.json";
import { selectIcon } from "./helperFunctions";
import youtube_social_icon from "./assets/youtube_social_icon_red.webp";
import news_icon from "./assets/news.webp";
import VideoModal from "./VideoModal";
import ConditionModal from "./ConditionModal";

function SidePanel(props) {
  const [sidePanelWidth, setPanelWidth] = useState(0);
  const [query, setQuery] = useState(stevens_pass_runs[0]);
  const [hoverBackground, setHoverBackground] = useState(["", ""]);
  const [openVidMod, setOpenVidMod] = useState(false);
  const [openComMod, setOpenComMod] = useState(false);

  // calculates width of side panel using the position of category buttons
  function calcWidthSidePanel() {
    let categoryCont = document.querySelector(".categorybtn-cont");
    let searchbarCont = document.querySelector(".searchbar-cont");
    let categoryContWidth = categoryCont.getBoundingClientRect().width;
    let categoryContLeft = categoryCont.getBoundingClientRect().left;
    let searchBarContLeft = searchbarCont.getBoundingClientRect().left;
    let searchBarContWidth = searchbarCont.getBoundingClientRect().width;
    let sidePanelWidth =
      searchBarContLeft -
      categoryContLeft -
      categoryContWidth +
      searchBarContWidth;
    return sidePanelWidth;
  }

  function getQuery(runName) {
    stevens_pass_runs.forEach((run) => {
      if (run.title.toLowerCase() === runName.toLowerCase()) {
        setQuery(run);
      }
    });
  }

  // updates width of side panel whenever the screen resizes
  window.addEventListener("resize", () => {
    setPanelWidth(calcWidthSidePanel());
  });

  useEffect(() => {
    if (props.showPanel === true) {
      setPanelWidth(calcWidthSidePanel());
      getQuery(props.runSelection);
    } else {
      setPanelWidth(0);
    }
  }, [props.showPanel]);

  useEffect(() => {
    getQuery(props.runSelection);
  }, [props.runSelection]);

  return (
    <div className="side-panel" style={{ width: sidePanelWidth }}>
      <button
        className="close-panel-btn"
        style={{ right: sidePanelWidth }}
        onClick={() => {
          setPanelWidth(0);
          // allows for sliding animation before setting display to false
          setTimeout(() => {
            props.setShowPanel(false);
          }, 250);
        }}
      >
        <img style={{ height: "10px" }} src={right_arrow} alt="" />
      </button>
      <div>
        <img src={ski_lift_picture} alt="" />
        <div
          className="flex flex-col gap-5"
          style={{
            paddingLeft: "10%",
            paddingRight: "10%",
            paddingTop: "20px",
          }}
        >
          <div className="flex justify-between items-center">
            <div style={{ fontWeight: "bold" }} className="side-panel-title">
              {query.title}
            </div>
            <div>
              <img
                className="side-panel-category-icon"
                src={selectIcon(query.category)}
                alt="category"
              />
            </div>
          </div>
          {query.category === "chairlift" ? (
            <>
              <hr />
              <div className="side-panel-info">
                <div>Vertical Rise: {query.lift_data.vertical_rise}</div>
                <div>Riders Per Hour: {query.lift_data.riders_per_hour}</div>
                <div>Chair Type: {query.lift_data.type}</div>
              </div>
            </>
          ) : null}
          <hr />
          <div className="flex justify-evenly">
            <button
              onMouseEnter={() => {
                setHoverBackground(["hover-background", ""]);
              }}
              onMouseLeave={() => {
                setHoverBackground(["", ""]);
              }}
              onClick={() => {
                setOpenVidMod(true); // open VideoModal
              }}
              className="flex items-center flex-col side-panel-btn"
            >
              <div
                className={
                  "side-panel-btn-circle flex items-center justify-center " +
                  hoverBackground[0]
                }
              >
                <img
                  className="side-panel-youtube"
                  src={youtube_social_icon}
                  alt="youtube"
                />
              </div>
              <div>Videos</div>
            </button>
            <button
              onMouseEnter={() => {
                setHoverBackground(["", "hover-background"]);
              }}
              onMouseLeave={() => {
                setHoverBackground(["", ""]);
              }}
              className="flex items-center flex-col side-panel-btn"
            >
              <div
                className={
                  "side-panel-btn-circle flex items-center justify-center " +
                  hoverBackground[1]
                }
                onClick={() => {
                  setOpenComMod(true);
                }}
              >
                <img className="side-panel-news" src={news_icon} alt="" />
              </div>
              <div>
                <div>Conditions</div>
              </div>
            </button>
            <VideoModal
              openVidMod={openVidMod}
              setOpenVidMod={setOpenVidMod}
              query={query}
              setOpen={props.setOpen}
            />
            <ConditionModal
              openComMod={openComMod}
              setOpenComMod={setOpenComMod}
              query={query}
              setOpen={props.setOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidePanel;
