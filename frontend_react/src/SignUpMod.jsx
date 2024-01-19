import Popup from "reactjs-popup";
import { useState, useEffect } from "react";

const normal =
  "bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500";

const success =
  "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:border-green-500";

const error =
  "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500";

function SignUpModal(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameClass, setUsernameClass] = useState(normal);
  const [passwordClass, setPasswordClass] = useState(normal);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false); // used to track if form is successfully submitted

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setPasswordClass(error);
    } else {
      setPasswordClass(normal);
    }

    const user = {
      username: username,
      password: password,
    };
    const response = await fetch(
      `${import.meta.env.VITE_DJANGO_API}/api/user/`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(user),
      }
    );
    if (response.ok) {
      setSuccessMsg(true);
      setTimeout(() => {
        props.setOpenSignUpMod(false);
        props.setOpenLogMod(true);
        setSuccessMsg(false);
        setUsernameClass(normal);
        setPasswordClass(normal);
        setPassword("");
        setUsername("");
        setConfirmPassword("");
      }, 1500);
    } else {
      setUsernameClass(error);
    }
  };

  const checkUserName = async () => {
    if (username.length >= 4) {
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_API}/api/user/${username}/`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.ok) {
        setUsernameClass(error);
        setUsernameError("Username is already taken");
      } else {
        setUsernameClass(success);
      }
    } else if (username.length > 0) {
      setUsernameClass(error);
      setUsernameError("Username must contain at least 4 characters");
    } else {
      setUsernameClass(normal);
    }
  };

  function checkPassword() {
    if (password.length >= 8 && confirmPassword.length >= 8) {
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        setPasswordClass(error);
      } else {
        setPasswordClass(success);
      }
    } else if (password.length > 0 && confirmPassword.length > 0) {
      setPasswordError("Password must contain at least 8 characters");
      setPasswordClass(error);
    } else {
      setPasswordClass(normal);
    }
  }

  useEffect(() => {
    checkPassword();
  }, [password, confirmPassword]);

  return (
    <Popup
      open={props.openSignUpMod}
      modal
      nested
      // onOpen={() => {}}
      onClose={() => {
        props.setOpenSignUpMod(false);
        setUsernameClass(normal);
        setPasswordClass(normal);
        setPassword("");
        setUsername("");
        setConfirmPassword("");
      }}
      contentStyle={{
        width: "60%",
        height: "65%",
        backgroundColor: "#FFF",
        boxShadow:
          "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      }}
    >
      <div className="modal">
        <button
          className="close"
          onClick={() => {
            props.setOpenSignUpMod(false);
          }}
        >
          &times;
        </button>
        <div className="header flex items-center justify-center">
          <div className="sign-up-header" style={{ fontWeight: "bold" }}>
            Sign up
          </div>
        </div>
        <div
          style={{ height: "90%" }}
          className="flex flex-col items-center justify-center"
        >
          {successMsg === true ? (
            <div
              className="p-4 mb-4 text-base text-green-800 rounded-lg bg-green-50"
              role="alert"
            >
              <span className="font-medium text-center">
                Account successfully created 😊
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSignUp}
              style={{ height: "100%" }}
              className="content flex flex-col items-center justify-center sign-up-form"
            >
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  className={usernameClass}
                  placeholder="Username"
                  required
                  onBlur={checkUserName}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium">
                  Password
                </label>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  id="password"
                  className={passwordClass}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium"
                >
                  Confirm password
                </label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  id="confirm-password"
                  className={passwordClass}
                  required
                />
              </div>
              <div className="flex items-center justify-center flex-col gap-1">
                {usernameClass === error ? (
                  <p className="text-sm text-red-600 dark:text-red-500">
                    {usernameError}
                  </p>
                ) : null}
                {passwordClass === error ? (
                  <p className="text-sm text-red-600 dark:text-red-500">
                    {passwordError}
                  </p>
                ) : null}
                <div
                  onClick={() => {
                    props.setOpenLogMod(true);
                    props.setOpenSignUpMod(false);
                  }}
                  className="text-base cursor-pointer acc-link text-center"
                >
                  Already have an account?
                </div>
                <button
                  type="submit"
                  style={{ backgroundColor: "#4285f4", maxWidth: "140px" }}
                  className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                >
                  Create account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Popup>
  );
}

export default SignUpModal;
