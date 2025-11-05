import ky from "ky";
import type { KyHeadersInit } from "node_modules/ky/distribution/types/options";

class API {
  get = <ReturnType = undefined>(path: string, headers?: KyHeadersInit) => {
    return ky
      .get<ReturnType>(`${process.env.BUN_PUBLIC_SERVER_URL}${path}`, {
        headers,
      })
      .json();
  };

  post = <ReturnType = undefined, Payload = undefined>(
    path: string,
    payload: Payload,
    headers?: KyHeadersInit,
  ) => {
    return ky
      .post<ReturnType>(`${process.env.BUN_PUBLIC_SERVER_URL}${path}`, {
        json: payload,
        headers,
      })
      .json();
  };
  put = <ReturnType = undefined, Payload = undefined>(
    path: string,
    payload: Payload,
    headers?: KyHeadersInit,
  ) => {
    return ky
      .put<ReturnType>(`${process.env.BUN_PUBLIC_SERVER_URL}${path}`, {
        json: payload,
        headers,
      })
      .json();
  };
  delete = <ReturnType = undefined, Payload = undefined>(
    path: string,
    payload: Payload,
    headers?: KyHeadersInit,
  ) => {
    return ky
      .delete<ReturnType>(`${process.env.BUN_PUBLIC_SERVER_URL}${path}`, {
        json: payload,
        headers,
      })
      .json();
  };
}

export default new API();
