console.log(import.meta.env.VITE_BASE_URL);
console.log(import.meta.env)

export const globals = {
  BACKEND_BASE_URL: import.meta.env.VITE_BASE_URL,
  BE_ENDPOINTS: {
    NEW_USER: "/user/new"
  },
  FE_ENDPOINTS: {
    LOGIN: ""
  },
  RESPONSE_MESSAGES: {
    AUTHENTICATION: ["Failed to authenticate", "Incorrect token given", "Authorization headers not found"]
  }

}
