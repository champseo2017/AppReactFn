import { client } from "client";
import { searchQuery, feedQuery, subscriptionFeedPinQuery } from "utils/data";
// Utils
import { fetchUser } from "utils/fetchUser";
import { v4 as uuidv4 } from "uuid";
import { res200, res400 } from "./response";

const user = fetchUser();

const getPinById = async (categoryId) => {
  try {
    if (categoryId) {
      const query = searchQuery(categoryId);
      const res = await client
        .fetch(query)
        .then((res) => {
          return res200(res);
        })
        .catch((err) => {
          throw err;
        });
      return res;
    }
  } catch (error) {
    const { type } = error;
    return res400(type);
  }
};

const createPin = async (docPin = {}) => {
  try {
    if (docPin) {
      const res = await client
        .create(docPin)
        .then(() => {
          return res200("Pin created successfully");
        })
        .catch((err) => {
          throw err;
        });
      return res;
    }
  } catch (error) {
    const { type } = error;
    return res400(type);
  }
};

const getPinFeed = async (query = feedQuery) => {
  try {
    const res = await client
      .fetch(query)
      .then((res) => {
        return res200(res);
      })
      .catch((err) => {
        throw err;
      });
    return res;
  } catch (error) {
    const { type } = error;
    return res400(type);
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
        return res200(res);
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
    const { type } = error;
    return res400(type);
  }
};

const deletePin = async (id) => {
  try {
    const res = await client
      .delete(id)
      .then((res) => {
        return res200(res);
      })
      .catch((err) => {
        throw err;
      });
    const { data, error } = res;
    if (res && data.transactionId) {
      const resValue = await getPinFeed();
      return resValue;
    }
  } catch (error) {
    const { type } = error;
    return res400(type);
  }
};

const PinService = {
  getPinById,
  getPinFeed,
  savePin,
  deletePin,
  createPin,
};

export default PinService;
