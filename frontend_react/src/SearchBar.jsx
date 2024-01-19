import { useState, useEffect } from "react";
import stevens_pass_runs from "./assets/stevens_pass_runs.json";
import { createOpenArray } from "./helperFunctions";
import SidePanel from "./SidePanel";
import { selectIcon } from "./helperFunctions";

// style for when search bar is not focused
let notFocusedStyle = {
  borderRadius: "20px",
  backgroundColor: "#FFF",
};

// style for when search bar is focused
let focusedStyle = {
  borderTopLeftRadius: "20px",
  borderTopRightRadius: "20px",
  backgroundColor: "#FFF",
};

function SearchBar(props) {
  const [style, setStyle] = useState(notFocusedStyle); // styles the search bar
  // used to track focus on drop down select so the onBlur from the input
  // doesn't close it when trying to select an option
  const [selectClick, setSelectClick] = useState(false); // track when mouse is hovering over dropdown
  const [showDropDown, setShowDropDown] = useState(false); // shows or hides drop down
  const [options, setOptions] = useState(stevens_pass_runs); // stores the options for drop down
  const [optionIdx, setOptionIdx] = useState(0); // used to track arrow up and arrow down for options

  function handleSubmit(e) {
    e.preventDefault();
    props.setShowPanel(true);
    setShowDropDown(false); // close drop down
    setStyle(notFocusedStyle);
    document.activeElement.blur(); // unfocuses the search and also resets optionIdx to 0
    props.openRunSelection(); // search run
  }

  // uses optionIdx to track drop down selection. optionIdx = 0 is no selection
  function handleKeyDown(e) {
    // arrow down
    if (e.keyCode === 40) {
      // setArrowPressed("down");
      if (optionIdx === options.length) {
        setOptionIdx(0);
      } else {
        setOptionIdx(optionIdx + 1);
      }
    }
    // arrow up
    else if (e.keyCode == 38) {
      // setArrowPressed("up");
      if (optionIdx === 0) {
        setOptionIdx(options.length);
      } else {
        setOptionIdx(optionIdx - 1);
      }
    }
  }

  // sets the highlighted option as the runSelection
  function keySelection() {
    if (optionIdx === 0 && showDropDown === true) {
      props.setRunSelection(""); // set runSelection to be empty
    } else if (optionIdx >= 1) {
      props.setRunSelection(options[optionIdx - 1].title); // set runSelection to be highlighted dropdown
    }
  }

  // scrolls the drop down so the option is in view
  function scroll() {
    // scroll to top
    if (optionIdx === 0 && showDropDown === true) {
      document.getElementById("drop-down").scroll(0, 0);
    } else if (optionIdx > 0) {
      // currentOptionY is the relative position of selected option to the top of dropdown
      let currentOptionY = document
        .getElementById(options[optionIdx - 1].id)
        .getBoundingClientRect().y;
      // 62 is the top of the dropdown view, if currentOptionY is less than 62, then scroll up one
      if (currentOptionY < 62) {
        document.getElementById(options[optionIdx - 1].id).scrollIntoView();
      }
      // 188 is the bottom of dropdown view, if currentOption Y is greater than 182, then scroll down one
      else if (currentOptionY > 188) {
        document.getElementById("drop-down").scroll(0, (optionIdx - 4) * 42);
      }
    }
  }

  // add background hover color to selected drop down option
  function addFocusSelectOption() {
    document
      .getElementById(options[optionIdx - 1].id)
      .classList.add("hover-background");
  }

  // remove background hover color
  function removeFocusSelectionOption() {
    let selectedOption = document.querySelector(".hover-background");
    if (selectedOption !== null) {
      selectedOption.classList.remove("hover-background");
    }
  }

  // responsive styling for the search bar radius
  useEffect(() => {
    if (showDropDown === true) {
      if (props.mapperWidth <= 475) {
        let newFocusedStyle = {
          borderTopLeftRadius: "14px",
          borderTopRightRadius: "14px",
          backgroundColor: "#FFF",
        };
        setStyle(newFocusedStyle);
      } else if (props.mapperWidth <= 625) {
        let newFocusedStyle = {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          backgroundColor: "#FFF",
        };
        setStyle(newFocusedStyle);
      } else {
        setStyle(focusedStyle);
      }
    }
  }, [showDropDown]);

  useEffect(() => {
    scroll();
    keySelection();
    removeFocusSelectionOption();
    if (optionIdx >= 1) {
      addFocusSelectOption();
    }
  }, [optionIdx]);

  function filterOption() {
    let filteredOption = [];
    stevens_pass_runs.forEach((run) => {
      if (run.title.toLowerCase().includes(props.runSelection.toLowerCase())) {
        filteredOption.push(run);
      }
    });
    setOptions(filteredOption);
  }

  // filters the options
  useEffect(() => {
    // optionIdx === 0 means user is not using the dropDown selection
    if (props.runSelection !== "" && optionIdx === 0) {
      filterOption();
    } else {
      setOptions(stevens_pass_runs);
    }
  }, [props.runSelection]);

  return (
    <form
      onSubmit={handleSubmit}
      style={{ alignSelf: "start" }}
      className="searchbar-cont"
    >
      {props.showPanel === true ? (
        <SidePanel
          userInfo={props.userInfo}
          showPanel={props.showPanel}
          setShowPanel={props.setShowPanel}
          runSelection={props.runSelection}
          setOpen={props.setOpen}
        />
      ) : null}
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search Trails
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none search-bar-svg-cont">
          <svg
            className="search-bar-svg"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
        <input
          type="search"
          id="default-search"
          className="block w-full text-sm border focus:outline-none shadow-lg"
          style={style}
          placeholder="Search..."
          required
          onChange={(e) => {
            props.setRunSelection(e.target.value);
            props.setShowPanel(false); // closes the side panel
          }}
          value={props.runSelection}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            props.setDisabled(true); // disables tooltips hover
            props.setOpen(createOpenArray()); // closes all tooltips
            setStyle(focusedStyle);
            setShowDropDown(true);
            filterOption();
            props.setToggle(["", "", "", "", ""]); // turn off all category btns
          }}
          onBlur={() => {
            if (selectClick !== true) {
              props.setDisabled(false); // disables tooltips hover
              props.setOpen(createOpenArray()); // closes all tooltips
              setStyle(notFocusedStyle);
              setShowDropDown(false);
              setOptionIdx(0); // reset optionIdx so the filtering starts again
            }
          }}
        />
        {showDropDown === true ? (
          <div
            className="focus:outline-none"
            id="drop-down"
            size="4"
            style={{
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
              borderBottomLeftRadius: "20px",
              borderBottomRightRadius: "20px",
              backgroundColor: "#fff",
              overflowY: "scroll",
            }}
            onMouseEnter={() => setSelectClick(true)}
            onMouseLeave={() => setSelectClick(false)}
            name="search"
          >
            <ul>
              {options.map((run) => (
                <li
                  className="text-sm searchbar-option"
                  id={run.id}
                  key={run.name}
                  onClick={() => {
                    setShowDropDown(false); // disables tooltips hover
                    props.setOpen(createOpenArray()); // closes all tooltips
                    setStyle(notFocusedStyle);
                    props.setRunSelection(run.title);
                    props.openRunSelection(run.title);
                    props.setShowPanel(true);
                  }}
                >
                  <img
                    className="drop-down-image"
                    src={selectIcon(run.category)}
                    alt="category"
                  />
                  <div className="drop-down-text">{run.title}</div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </form>
  );
}

export default SearchBar;
