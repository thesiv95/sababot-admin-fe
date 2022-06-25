import axios from "axios";

// all env vars should start from VITE_blablabla
// see docs: https://vitejs.dev/config/#envprefix
const baseURL = "https://sababot-crud.herokuapp.com" //import.meta.env.VITE_API_BASE_URL;
const xApiKey = "1149c713-3a9e-4a13-9171-e250da21bd7e" //import.meta.env.VITE_API_KEY;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "x-api-key": xApiKey,
  },
});

export const doGetRequest = async (path: string) => {
  try {
    const response = await axiosInstance.get(path);
    return response.data.data; // return only data
  } catch (error) {
    const errorCasted = error as string;
    throw new Error(errorCasted);
  }
};

export const doPostRequest = async (path: string, payload: object) => {
  try {
    const response = await axiosInstance.post(path, payload);
    return response.data; // return all express object
  } catch (error) {
    const errorCasted = error as string;
    throw new Error(errorCasted);
  }
};

export const doPutRequest = async (path: string, payload: object) => {
  try {
    const response = await axiosInstance.put(path, payload);
    return response.data;
  } catch (error) {
    const errorCasted = error as string;
    throw new Error(errorCasted);
  }
};

export const doDeleteRequest = async (path: string) => {
  try {
    const response = await axiosInstance.delete(path);
    return response.data;
  } catch (error) {
    const errorCasted = error as string;
    throw new Error(errorCasted);
  }
};

// TODO: config
