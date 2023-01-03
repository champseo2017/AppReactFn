import { useCallback, useEffect } from "react";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import logo from "assets/logowhite.png";
import { client } from 'client'
import ReactPlayer from 'react-player/lazy'

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = useCallback((response) => {

    if (response) {

      const { profileObj } = response
      const {
        name,
        googleId,
        imageUrl,
      } = profileObj

      localStorage.setItem("user", JSON.stringify(profileObj));

      const doc = {
        _id: googleId,
        _type: 'user',
        userName: name,
        image: imageUrl,
      }

      client.createIfNotExists(doc).then(() => {
        navigate("/", { replace: true });
      })

    }

  }, []);

  const start = () => {
    gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
      scope: "email",
    });
  };

  useEffect(() => {
    gapi.load("client:auth2", start);
    return () => {};
  }, []);

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <ReactPlayer
          url="https://www.youtube.com/watch?v=oMS8EX5OG3k"
          type="video/mp4"
          loop={true}
          controls={false}
          muted={true}
          playing={true}
          width='100%'
          height='100%'
          className="!z-0"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="logo" width="130px" />
          </div>
          <div className="drop-shadow-2xl">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-white text-black p-3 rounded-lg flex justify-center items-center outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" />
                  <span>Sign in with Google</span>
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
