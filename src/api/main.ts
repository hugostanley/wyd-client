import axios from "axios";
import { globals } from "../config/globals";

export const mainInstance = axios.create({
  baseURL: globals.BACKEND_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

