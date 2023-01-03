import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { urlFor, client } from "client";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
// Utils
import { fetchUser } from "utils/fetchUser";
import { PinSlices } from "redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { searchQuery, feedQuery, subscriptionFeedPinQuery } from "utils/data";
import PinService from "services/pinService";

const Pin = ({ pin }) => {
  const { destination, image, postedBy, save, _id } = pin;
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user = fetchUser();
  const alreadySaved = useMemo(() => {
    return !!save?.filter((item) => item?.postedBy?._id === user?.googleId)
      ?.length;
  }, [pin]);

  const savePinData = useCallback(async (id) => {
    if (id) {
      dispatch(PinSlices.savePinLoading());
      const resData = await PinService.savePin(id);
      const {
        data,
        error,
      } = resData
      if (data && !error) {
        dispatch(PinSlices.savePinSuccess(data));
      } else {
        dispatch(PinSlices.savePinError(error));
      }
    }
  }, []);

  const savePin = useCallback(
    async (id) => {
      if (!alreadySaved) {
        await savePinData(id);
      }
    },
    [alreadySaved]
  );

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative w-auto hover:shadow-lg rounded-lg overflow-hidden transition duration-500 ease-in-out"
        style={{
          cursor: "zoom-in",
        }}
      >
        <img
          className="rounded-lg w-full"
          alt="user-post"
          src={urlFor(image).width(250).url()}
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark-200 text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-[3rem] hover:shadow-md outline-none"
                >
                  {save?.length} Saved
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-[3rem] hover:shadow-md outline-none"
                >
                  Saved
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
