export const globals = {
  BACKEND_BASE_URL: import.meta.env.VITE_BASE_URL,
  BE_ENDPOINTS: {
    NEW_USER: "/user/new",
    SIGNIN_USER: "/user/signin",
    NEW_TODO: "/todo/new",
    EDIT_TODO: "/todo/edit",
    DELETE_TODO: "/todo/delete",
    ALL_USERS: "/users",
    ADD_FRIEND: "/friend/add",
    ALL_FRIENDS: "/friends",
    FRIEND_REQUESTS: "/friend/requests", 
    INCOMING_REQUEST: "/friend/incoming",
    ACCEPT_REQUEST: "/friend/accept",
    GET_FEED: "/todo/feed"
  },
  FE_ENDPOINTS: {
    LOGIN: "login",
    REGISTER: "register",
    FRIENDS: "friends"
  },
  RESPONSE_MESSAGES: {
    AUTHENTICATION: ["Failed to authenticate", "Incorrect token given", "Authorization headers not found"]
  }

}
