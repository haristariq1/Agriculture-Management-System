const initial = {
  user: null,
  allUsers: [],
  loginLoading: false,
  loginSuccess: false,
  loginFailure: false,
  loginError: null,
};
export const userReducer = (state = initial, action) => {
  switch (action.type) {
    case "user/login_request":
      return {
        ...state,
        loginLoading: true,
        loginError: null,
        loginSuccess: false,
        loginFailure: false,
      };
    case "user/login_success":
      return {
        ...state,
        user: action.payload,
        loginLoading: false,
        loginSuccess: true,
      };
    case "user/login_failure":
      return {
        ...state,
        loginLoading: false,
        loginFailure: true,
        loginError: action.payload,
      };
    case "user/logout_success":
      return { ...initial };
    case "user/getall_success":
      return { ...state, allUsers: action.payload };
    default:
      return state;
  }
};
