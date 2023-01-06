import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";
import { gapiLoad } from "utils/startGoogleApi";

const Logout = () => {
  const navigate = useNavigate();
  const handlersGoogleLogout = useCallback((e) => {
    e.stopPropagation();
    const auth2 = window.gapi.auth2.getAuthInstance();
    if (auth2 != null) {
      auth2.signOut().then(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
        navigate(0);
      });
    }
  }, []);

  useEffect(() => {
    gapiLoad();
    return () => {};
  }, []);

  return (
    <div className="flex items-center">
      <div className="w-full h-full">
        <div className="flex justify-center items-center">
          <div className="drop-shadow-2xl">
            <button
              type="button"
              className="bg-white text-black p-3 rounded-lg flex justify-center items-center outline-none"
              onClick={handlersGoogleLogout}
            >
              <MdLogout className="mr-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logout;
