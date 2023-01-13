import { client } from "client";

export const imageUpload = async (files = []) => {
  try {
    if (files.length !== 0) {
      const { type, name } = files[0];
      if (
        type === "image/png" ||
        type === "image/svg" ||
        type === "image/jpeg" ||
        type === "image/gif" ||
        type === "image/tiff"
      ) {
        const resUpload = await client.assets
          .upload("image", files[0], {
            contentType: type,
            filename: name,
          })
          .then((image) => {
            return image;
          })
          .catch((err) => {
            throw err;
          });
        return {
          data: resUpload,
          error: "",
        };
      } else {
        throw new Error("File type not supported");
      }
    } else {
      throw new Error("No file selected");
    }
  } catch (error) {
    const { message, type } = error;
    return {
      data: [],
      error: type || message,
    };
  }
};
