import { gapi } from "gapi-script";
const start = () => {
  return gapi.client.init({
    clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
    scope: "email",
  });
};

export const gapiLoad = () => {
  gapi.load("client:auth2", start);
}