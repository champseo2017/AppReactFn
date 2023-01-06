import useSWR from "swr";
import { mutate } from "swr";

export const UseFetcher = (
  query = "",
  callBack = async () => {},
  options = {}
) => {
  return useSWR(query, callBack, options);
};

export const UseFetchAndCache = async (
  query = "",
  callBack = async () => {},
  options = false
) => {
  const request = await callBack(query);
  mutate(query, request, options);
  return request;
};