import Popup from "reactjs-popup";
import { selectIcon } from "./helperFunctions";
import { useState } from "react";
import { createOpenArray } from "./helperFunctions";
import { refreshToken } from "./helperFunctions";
import add_comment from "./assets/add_comment.webp";
import AddComModal from "./AddComMod";

function ConditionModal(props) {
  const [reviews, setReviews] = useState([]);
  const [openAddComMod, setOpenAddComMod] = useState(false);

  async function getReviews(runId) {
    let header = new Headers({
      "Content-type": "application/json",
    });

    const response = await fetch(
      `${import.meta.env.VITE_DJANGO_API}/api/conditions/${runId}/`,
      {
        method: "GET",
        headers: header,
      }
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data.reviews);
      setReviews(data.reviews);
    }
  }

  return (
    <Popup
      open={props.openComMod}
      modal
      nested
      onOpen={() => {
        refreshToken(null, getReviews, props.query.name);
        props.setOpen(createOpenArray()); // closes all tooltips
      }}
      onClose={() => {
        props.setOpenComMod(false);
      }}
      contentStyle={{
        width: "65%",
        height: "85%",
        backgroundColor: "#FFF",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="modal">
        <button
          className="close"
          onClick={() => {
            props.setOpenComMod(false);
          }}
        >
          &times;
        </button>
        <div
          style={{ paddingLeft: "10px", paddingRight: "10px" }}
          className="header flex items-center justify-between"
        >
          <div className="flex items-center justify-center gap-1">
            {" "}
            <div
              className="conditions-modal-header"
              style={{ fontWeight: "bold" }}
            >
              {props.query.title}
            </div>
            <img
              className="add-condition-icon"
              src={selectIcon(props.query.category)}
              alt="category"
            />
            <div className="conditions-modal-header">| Conditions</div>
          </div>
          <Popup
            trigger={() => (
              <div
                className="flex items-center justify-center cursor-pointer add-condition-btn"
                onClick={() => {
                  if (localStorage.getItem("access_token") === null) {
                    alert("Please sign in to add a review");
                  } else {
                    setOpenAddComMod(true);
                  }
                }}
              >
                <button>
                  <img
                    className="add-condition-icon"
                    src={add_comment}
                    alt="add video"
                  />
                </button>
              </div>
            )}
            position="bottom center"
            closeOnDocumentClick
            on={["hover", "focus"]}
            contentStyle={{
              textAlign: "center",
              maxWidth: "200px",
              boxShadow:
                "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
            }}
          >
            <span>Add a review on the conditions</span>
          </Popup>
        </div>
        <div
          className="content flex flex-col items-center justify-center"
          style={{
            width: "100%",
            height: "90%",
          }}
        >
          {reviews.length > 0 ? (
            <div
              style={{
                overflowY: "scroll",
                height: "100%",
                paddingLeft: "10px",
                paddingRight: "10px",
                minWidth: "200px",
              }}
            >
              {reviews.map((review) => (
                <div className="flex flex-col" key={review.id}>
                  <div className="flex justify-between">
                    <div
                      className="condition-content"
                      style={{ fontWeight: "bold" }}
                    >
                      @{review.user.username}
                    </div>
                    <div
                      className="condition-content"
                      style={{ color: "rgb(101, 110, 94)" }}
                    >
                      {review.date}
                    </div>
                  </div>
                  <div>
                    <span
                      className="condition-content"
                      style={{ fontWeight: "bold" }}
                    >
                      Comment:{" "}
                    </span>
                    <span className="condition-content">{review.comment}</span>
                  </div>
                  {review.snow_condition.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <div
                        className="condition-content"
                        style={{
                          color: "rgb(26, 115, 232)",
                          fontWeight: "bold",
                        }}
                      >
                        Snow Conditions:{" "}
                      </div>
                      {review.snow_condition.map((condition) => (
                        <div
                          className="snow-condition condition-content"
                          key={condition.category}
                        >
                          {condition.category}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {review.trail_feature.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      <div
                        className="condition-content"
                        style={{
                          color: "rgb(95, 26, 232)",
                          fontWeight: "bold",
                        }}
                      >
                        Trail Features:{" "}
                      </div>
                      {review.trail_feature.map((feature) => (
                        <div
                          className="trail-feature condition-content"
                          key={feature.category}
                        >
                          {feature.category}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  <hr className="mb-2 mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="condition-content">
              There are currently no reviews on the conditions 😔
            </div>
          )}
        </div>
      </div>
      <AddComModal
        query={props.query}
        openAddComMod={openAddComMod}
        setOpenAddComMod={setOpenAddComMod}
        reviews={reviews}
        setReviews={setReviews}
      />
    </Popup>
  );
}

export default ConditionModal;
