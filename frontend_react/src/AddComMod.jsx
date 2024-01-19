import Popup from "reactjs-popup";
import { useState } from "react";
import { refreshToken } from "./helperFunctions";
import SnowConditionBtn from "./SnowConditionBtn";
import TrailFeatureBtn from "./TrailFeatureBtn";

const normal =
  "bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 condition-form";

// const success =
//   "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:border-green-500";

// const error =
//   "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";

function AddComModal(props) {
  const [comment, setComment] = useState("");
  const [date, setDate] = useState("");
  const [snowConditions, setSnowConditions] = useState([]);
  const [trailFeatures, setTrailFeatures] = useState([]);
  const [successMsg, setSuccessMsg] = useState(false); // used to track if form is successfully submitted

  const handleAddCom = async () => {
    const data = {
      run_id: props.query.name,
      user_id: localStorage.getItem("user_id"),
      date: date,
      comment: comment,
      snow_condition: snowConditions,
      trail_feature: trailFeatures,
    };
    const response = await fetch(
      `${import.meta.env.VITE_DJANGO_API}/api/conditions/`,
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
        props.setOpenAddComMod(false);
        setSuccessMsg(false);
        setComment("");
        setDate("");
        setSnowConditions([]);
        setTrailFeatures([]);
      }, 1500);

      const data = await response.json();
      // add review to Condition Modal
      let copyReviews = Array.from(props.reviews);
      copyReviews.push(data.reviews);
      props.setReviews(copyReviews);
    }
  };

  return (
    <Popup
      open={props.openAddComMod}
      modal
      nested
      // onOpen={() => {}}
      onClose={() => {
        props.setOpenAddComMod(false);
        setSuccessMsg(false);
        setComment("");
        setDate("");
        setSnowConditions([]);
        setTrailFeatures([]);
      }}
      contentStyle={{
        width: "60%",
        height: "75%",
        backgroundColor: "#FFF",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="modal">
        <button
          className="close"
          onClick={() => {
            props.setOpenAddComMod(false);
          }}
        >
          &times;
        </button>
        <div className="header flex flex-col items-center justify-center">
          <div
            style={{ fontWeight: "bold" }}
            className="conditions-modal-header"
          >
            Add a review for {props.query.title}
          </div>
        </div>
        <div
          style={{ height: "85%", overflowY: "scroll" }}
          className="flex flex-col items-center justify-center"
        >
          {successMsg === true ? (
            <div
              className="p-4 mb-4 text-base text-green-800 rounded-lg bg-green-50"
              role="alert"
            >
              <div className="condition-content">
                Review successfully added 😊
              </div>
            </div>
          ) : (
            <form
              style={{
                height: "90%",
                paddingLeft: "10px",

                paddingRight: "10px",
              }}
              onSubmit={(e) => refreshToken(e, handleAddCom)}
              className="content flex flex-col gap-6"
            >
              <div style={{ maxWidth: "140px" }} className="flex flex-col">
                <label
                  style={{ fontWeight: "bold" }}
                  htmlFor="date"
                  className="block condition-form"
                >
                  Date
                </label>
                <input
                  onChange={(e) => {
                    setDate(e.target.value);
                  }}
                  type="date"
                  id="date"
                  className={normal}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  style={{ fontWeight: "bold" }}
                  htmlFor="comment"
                  className="block condition-form"
                >
                  Comment:
                </label>
                <textarea
                  onChange={(e) => {
                    setComment(e.target.value);
                  }}
                  id="comment"
                  rows="4"
                  style={{ width: "100%", padding: "5px" }}
                  className={normal}
                  required
                  placeholder="Share your thoughts so others know what to expect"
                ></textarea>
              </div>
              <div>
                <div className="condition-form" style={{ fontWeight: "bold" }}>
                  Snow Conditions
                </div>
                <div className="flex gap-1 flex-wrap">
                  <SnowConditionBtn
                    condition="Champagne Powder"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"1"}
                  />
                  <SnowConditionBtn
                    condition="Deep"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"2"}
                  />
                  <SnowConditionBtn
                    condition="Pow"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"3"}
                  />
                  <SnowConditionBtn
                    condition="Groomers"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"4"}
                  />
                  <SnowConditionBtn
                    condition="Slush"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"5"}
                  />
                  <SnowConditionBtn
                    condition="Wet"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"6"}
                  />
                  <SnowConditionBtn
                    condition="Choppy"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"7"}
                  />
                  <SnowConditionBtn
                    condition="Corn"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"8"}
                  />
                  <SnowConditionBtn
                    condition="Mashed Potatoes"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"9"}
                  />
                  <SnowConditionBtn
                    condition="Moguls"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"10"}
                  />
                  <SnowConditionBtn
                    condition="Hard Pack"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"11"}
                  />
                  <SnowConditionBtn
                    condition="Dust on Crust"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"12"}
                  />
                  <SnowConditionBtn
                    condition="Cascade Concrete"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"13"}
                  />
                  <SnowConditionBtn
                    condition="Icy"
                    snowConditions={snowConditions}
                    setSnowConditions={setSnowConditions}
                    id={"14"}
                  />
                </div>
              </div>
              <div>
                <div className="condition-form" style={{ fontWeight: "bold" }}>
                  Trail Features
                </div>
                <div className="flex gap-1 flex-wrap">
                  <TrailFeatureBtn
                    feature="Crowded"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="1"
                  />
                  <TrailFeatureBtn
                    feature="Narrow"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="2"
                  />
                  <TrailFeatureBtn
                    feature="Wide"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="3"
                  />
                  <TrailFeatureBtn
                    feature="Side hits"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="4"
                  />
                  <TrailFeatureBtn
                    feature="Cat Track"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="5"
                  />
                  <TrailFeatureBtn
                    feature="Flat"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="6"
                  />
                  <TrailFeatureBtn
                    feature="Straight"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="7"
                  />
                  <TrailFeatureBtn
                    feature="Curvy"
                    trailFeatures={trailFeatures}
                    setTrailFeatures={setTrailFeatures}
                    id="8"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center flex-col gap-1">
                <button
                  type="submit"
                  style={{ backgroundColor: "#4285f4", maxWidth: "120px" }}
                  className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Add Review
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default AddComModal;
