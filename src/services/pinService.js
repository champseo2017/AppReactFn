import { client } from "client";
import { searchQuery, feedQuery, subscriptionFeedPinQuery } from "utils/data";
// Utils
import { fetchUser } from "utils/fetchUser";
import { v4 as uuidv4 } from "uuid";

const user = fetchUser();

const getPinById = async (categoryId) => {
  try {
    if (categoryId) {
      const query = searchQuery(categoryId);
      const res = await client
        .fetch(query)
        .then((res) => {
          return {
            data: res,
            error: "",
          };
        })
        .catch((err) => {
          throw err;
        });
      return res;
    }
  } catch (error) {
    const { message } = error;
    return {
      data: [],
      error: message,
    };
  }
};

const getPinFeed = async (query = feedQuery) => {
  try {
    const res = await client
      .fetch(query)
      .then((res) => {
        return {
          data: res,
          error: "",
        };
      })
      .catch((err) => {
        throw err;
      });
    return res;
  } catch (error) {
    const { message } = error;
    return {
      data: [],
      error: message,
    };
  }
};

const savePin = async (id) => {
  try {
    const res = await client
      .patch(id)
      .setIfMissing({ save: [] })
      .insert("after", "save[-1]", [
        {
          _key: uuidv4(),
          userId: user?.googleId,
          postedBy: {
            _type: "postedBy",
            _ref: user?.googleId,
          },
        },
      ])
      .commit()
      .then((res) => {
        return {
          data: res,
          error: "",
        };
      })
      .catch((err) => {
        throw err;
      });
    const { data, error } = res;
    if (res && data._createdAt) {
      const resValue = await getPinFeed();
      return resValue;
    }
  } catch (error) {
    const { message } = error;
    return {
      data: [],
      error: message,
    };
  }
};

const PinService = {
  getPinById,
  getPinFeed,
  savePin,
};

export default PinService;
