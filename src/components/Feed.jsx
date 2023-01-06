import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { client } from "client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";
import { PinSlices } from "redux/slices";
import { useDispatch, useSelector } from "react-redux";
import { searchQuery, feedQuery, subscriptionFeedPinQuery } from "utils/data";
// Utils
import { fetchUser } from "utils/fetchUser";
import { UseFetcher } from "./UseFetcher";
import { v4 as uuidv4 } from "uuid";
import groq from "groq";
import PinService from "services/pinService";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();
  const dispatch = useDispatch();

  const resPinData = useSelector((state) => {
    const { pin } = state;
    if (pin) {
      return pin;
    }
  });

  const fetcher = useCallback(
    async (query) => {
      if (!categoryId) {
        const data = await PinService.getPinFeed(query);
        return data;
      } else {
        const data = await PinService.getPinById(categoryId);
        return data;
      }
    },
    [categoryId]
  );

  const { data } = UseFetcher(groq`${feedQuery}`, fetcher, {
    revalidateOnFocus: true,
  });

  const initFetchPin = useCallback(() => {
    if (!categoryId) {
      if (!data) {
        dispatch(PinSlices.getPinFeedLoading());
      }
      if (data) {
        const { data: dataPin, error } = data;
        if (dataPin) {
          dispatch(PinSlices.getPinFeedSuccess(dataPin));
        } else if (error) {
          dispatch(PinSlices.getPinFeedError(error));
        }
      }
    } else {
      if (!data) {
        dispatch(PinSlices.getPinByIdLoading());
      }
      if (data) {
        const { data: dataPin, error } = data;
        if (dataPin) {
          dispatch(PinSlices.getPinByIdSuccess(dataPin));
        } else if (error) {
          dispatch(PinSlices.getPinByIdError(error));
        }
      }
    }
  }, [dispatch, data, categoryId]);

  useEffect(() => {
    initFetchPin();
  }, [initFetchPin]);

  if (resPinData && resPinData.loading)
    return <Spinner message="We are adding new ideas to your feed!" />;

  return (
    <div>
      {resPinData && resPinData?.data && (
        <MasonryLayout pins={resPinData?.data} />
      )}
    </div>
  );
};

export default Feed;
