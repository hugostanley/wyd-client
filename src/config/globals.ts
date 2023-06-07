export const globals = {
  BACKEND_BASE_URL: import.meta.env.VITE_BASE_URL,
  BE_ENDPOINTS: {
    NEW_USER: "/user/new",
    SIGNIN_USER: "/user/signin",
    NEW_TODO: "/todo/new"
  },
  FE_ENDPOINTS: {
    LOGIN: "/login",
    REGISTER: "/register",
  },
  RESPONSE_MESSAGES: {
    AUTHENTICATION: ["Failed to authenticate", "Incorrect token given", "Authorization headers not found"]
  }

}
