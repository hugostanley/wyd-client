
import { AxiosResponse, AxiosError } from "axios";
import { useState } from "react";
import { mainInstance } from '../api/main'
import { globals } from "../config/globals";
import { useNavigate } from "react-router-dom";

type UseFetchResult<T> = {
  data: AxiosResponse<T> | null;
  error: AxiosError<T> | null;
  loading: boolean;
  fetch: (url: string, body?: any, type?: string) => Promise<void>;
};

type Methods = "post" | "get";

export function useFetch<T>(method: Methods): UseFetchResult<T> {
  const [data, setData] = useState<AxiosResponse<T> | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AxiosError<T> | null>(null);
  const navigate = useNavigate()

  async function fetch(url: string, body?: T): Promise<void> {
    const token = localStorage.getItem("secret_key")
    try {
      let response;
      setLoading(true);
      if (method == "post" && body) {
        response = await mainInstance[method](url, body, {
          headers: {
            ...(token && { Authorization: token })
          }
        });
      } else {
        response = await mainInstance[method](url, {
          headers: {
            ...(token && { Authorization: token })
          }
        });
      }
      setData(response);
    } catch (error: any) {
      // this is to handle session expiration
      if (globals.RESPONSE_MESSAGES.AUTHENTICATION.includes(error.response.data.message)) {
        localStorage.removeItem("secret_key")
        localStorage.setItem("isLoggedIn", "false")
        navigate(globals.FE_ENDPOINTS.LOGIN)
      }
      setError(error.response as AxiosError<T>);
    } finally {
      setLoading(false);
    }
  }
  return { data, error, loading, fetch };
}


