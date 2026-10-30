const flags = Object.fromEntries(
  ["login", "logout", "getall", "get", "create", "update", "remove"].flatMap(
    (op) => [
      [`${op}Loading`, false],
      [`${op}Success`, false],
      [`${op}Failure`, false],
      [`${op}Error`, null],
    ],
  ),
);
const initial = {
  user: null,
  allUsers: [],
  requestedUser: null,
  ...flags,
  loginError: null,
};
export const userReducer = (state = initial, action) => {
  if (action.type === "user/logout_success") return { ...initial };
  const match = action.type.match(
    /^user\/(login|logout|getall|get|create|update|remove)_(request|success|failure)$/,
  );
  if (!match) return state;
  const [, operation, phase] = match,
    changes = {};
  if (phase === "request")
    Object.assign(changes, {
      [`${operation}Loading`]: true,
      [`${operation}Success`]: false,
      [`${operation}Failure`]: false,
      [`${operation}Error`]: null,
    });
  if (phase === "failure")
    Object.assign(changes, {
      [`${operation}Loading`]: false,
      [`${operation}Failure`]: true,
      [`${operation}Error`]: action.payload,
    });
  if (phase === "success") {
    Object.assign(changes, {
      [`${operation}Loading`]: false,
      [`${operation}Success`]: true,
    });
    if (operation === "login") changes.user = action.payload;
    if (operation === "getall") changes.allUsers = action.payload;
    if (operation === "get") changes.requestedUser = action.payload;
    if (operation === "create")
      changes.allUsers = [...state.allUsers, action.payload];
    if (operation === "update")
      changes.allUsers = state.allUsers.map((x) =>
        x.id === action.payload.id ? action.payload : x,
      );
    if (operation === "update" && state.user?.id === action.payload.id)
      changes.user = action.payload;
    if (operation === "remove")
      changes.allUsers = state.allUsers.filter(
        (x) => x.id !== action.payload.id,
      );
    if (operation === "remove" && state.user?.id === action.payload.id)
      changes.user = null;
  }
  return { ...state, ...changes };
};
