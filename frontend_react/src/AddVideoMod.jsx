import Popup from "reactjs-popup";
import { useState } from "react";
import { refreshToken } from "./helperFunctions";

const normal =
  "bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500";

const success =
  "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:border-green-500";

const error =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";

function AddVideoModal(props) {
  const [videoLink, setVideoLink] = useState("");
  const [videoLinkInputClass, setVideoLinkInputClass] = useState(normal);
  const [successMsg, setSuccessMsg] = useState(false); // used to track if form is successfully submitted

  // converts a normal youtube url into embed youtube url
  function convertLink2Embed(videoLink) {
    let endUrl = "";
    let addLink = false;
    // eslint-disable-next-line for-direction
    for (let i = 0; i < videoLink.length; i++) {
      // video url info occurs after "="
      if (videoLink[i] === "=") {
        addLink = true;
      } else if (addLink === true) {
        endUrl += videoLink[i];
      }
    }
    return `https://www.youtube.com/embed/${endUrl}`;
  }

  const handleAddVideo = async () => {
    if (checkLink() === true) {
      const data = {
        src: convertLink2Embed(videoLink),
        runId: props.query.name,
        userId: localStorage.getItem("user_id"),
      };
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_API}/api/videos/`,
        {
          method: "POST",
          headers: new Headers({
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-type": "application/json",
          }),
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        setSuccessMsg(true);
        setTimeout(() => {
          props.setOpenAddVideoMod(false);
          setSuccessMsg(false);
          setVideoLink("");
          setVideoLinkInputClass(normal);
        }, 1500);
        // add to video to Video Modal
        const data = await response.json();
        // combine the json response into one dict
        let combineVideosLikes = Object.assign(data.video, data.like_status);
        let copyVideos = Array.from(props.videos);
        copyVideos.push(combineVideosLikes);
        props.setVideos(copyVideos);
      }
    }
  };

  function checkLink() {
    if (videoLink.length > 0) {
      if (videoLink.includes("https://www.youtube.com/watch") !== true) {
        setVideoLinkInputClass(error);
        return false;
      } else {
        setVideoLinkInputClass(success);
        return true;
      }
    } else {
      setVideoLinkInputClass(normal);
    }
  }

  return (
    <Popup
      open={props.openAddVideoMod}
      modal
      nested
      // onOpen={() => {}}
      onClose={() => {
        props.setOpenAddVideoMod(false);
      }}
      contentStyle={{
        width: "50%",
        height: "50%",
        backgroundColor: "#FFF",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="modal">
        <button
          className="close"
          onClick={() => {
            props.setOpenAddVideoMod(false);
          }}
        >
          &times;
        </button>
        <div className="header flex items-center justify-center">
          <div className="add-video-header" style={{ fontWeight: "bold" }}>
            Add video | {props.query.title}
          </div>
        </div>
        <div
          style={{ height: "80%" }}
          className="flex flex-col items-center justify-center"
        >
          {successMsg === true ? (
            <div
              className="p-4 mb-4 text-base text-green-800 rounded-lg bg-green-50"
              role="alert"
            >
              <span className="font-medium text-center">
                Video successfully added 😊
              </span>
            </div>
          ) : (
            <form
              onSubmit={(e) => refreshToken(e, handleAddVideo)}
              style={{ width: "100%" }}
              className="content flex flex-col items-center gap-1 add-video-form"
            >
              <div
                style={{ width: "100%", maxWidth: "400px" }}
                className="flex justify-center flex-col text-center"
              >
                <label
                  htmlFor="videolink"
                  className="block text-sm font-medium"
                >
                  Youtube Link
                </label>
                <input
                  onChange={(e) => {
                    setVideoLink(e.target.value);
                    checkLink();
                  }}
                  onBlur={checkLink}
                  type="text"
                  id="videolink"
                  className={videoLinkInputClass}
                  required
                  placeholder="https://www.youtube.com/..."
                />
                {videoLinkInputClass === error ? (
                  <div
                    style={{ textAlign: "center" }}
                    className="text-sm text-red-600 dark:text-red-500"
                  >
                    <div>Please enter a valid Youtube link.</div>
                    <div className="add-video-example">
                      Example: https://www.youtube.com/watch?v=M-qFkPblAic
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-center flex-col gap-1">
                <button
                  type="submit"
                  style={{ backgroundColor: "#4285f4" }}
                  className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Add Video
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default AddVideoModal;
