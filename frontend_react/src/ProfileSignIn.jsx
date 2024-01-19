import { useState, useEffect } from "react";
import SignInModal from "./SignInMod";
import SignUpModal from "./SignUpMod";

function ProfileSignIn(props) {
  const [openLogMod, setOpenLogMod] = useState(false);
  const [openSignUpMod, setOpenSignUpMod] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access_token") !== null) {
      setSignedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    const refresh_token = {
      refresh: localStorage.getItem("refresh_token"),
    };
    const response = await fetch(
      `${import.meta.env.VITE_DJANGO_API}/api/token/blacklist/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(refresh_token),
      }
    );
    if (response.ok) {
      setSignedIn(false);
      localStorage.clear();
    } else {
      console.log("error");
      localStorage.clear();
      setSignedIn(false);
    }
  };

  return (
    <div className="flex">
      {signedIn ? (
        <button onClick={handleLogout} className="profile-sign-in">
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => {
            setOpenLogMod(true);
          }}
          className="profile-sign-in"
        >
          Sign In
        </button>
      )}
      <SignInModal
        userInfo={props.userInfo}
        setSignedIn={setSignedIn}
        openLogMod={openLogMod}
        setOpenLogMod={setOpenLogMod}
        setOpenSignUpMod={setOpenSignUpMod}
      />
      <SignUpModal
        setOpenSignUpMod={setOpenSignUpMod}
        openSignUpMod={openSignUpMod}
        setOpenLogMod={setOpenLogMod}
      />
    </div>
  );
}

export default ProfileSignIn;
