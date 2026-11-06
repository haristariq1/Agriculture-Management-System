import { INVENTORY_REQUEST as T } from "../../actions/utilities";
const initial = {
  items: [],
  getLoading: false,
  getSuccess: false,
  getFailure: false,
  getError: null,
  addLoading: false,
  addSuccess: false,
  addFailure: false,
  addError: null,
  updateLoading: false,
  updateSuccess: false,
  updateFailure: false,
  updateError: null,
  removeLoading: false,
  removeSuccess: false,
  removeFailure: false,
  removeError: null,
  usageLoading: false,
  usageSuccess: false,
  usageFailure: false,
  usageError: null,
};
export const inventoryReducer = (state = initial, action) => {
  switch (action.type) {
    case T.GET_INVENTORY_REQUEST:
      return {
        ...state,
        getLoading: true,
        getSuccess: false,
        getFailure: false,
        getError: null,
      };
    case T.GET_INVENTORY_SUCCESS:
      return {
        ...state,
        getLoading: false,
        getSuccess: true,
        items: action.payload,
      };
    case T.GET_INVENTORY_FAILURE:
      return {
        ...state,
        getLoading: false,
        getFailure: true,
        getError: action.payload,
      };
    case T.ADD_INVENTORY_REQUEST:
      return {
        ...state,
        addLoading: true,
        addSuccess: false,
        addFailure: false,
        addError: null,
      };
    case T.ADD_INVENTORY_SUCCESS:
      return {
        ...state,
        addLoading: false,
        addSuccess: true,
        items: [...state.items, action.payload],
      };
    case T.ADD_INVENTORY_FAILURE:
      return {
        ...state,
        addLoading: false,
        addFailure: true,
        addError: action.payload,
      };
    case T.UPDATE_INVENTORY_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateFailure: false,
        updateError: null,
      };
    case T.UPDATE_INVENTORY_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        items: state.items.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x,
        ),
      };
    case T.UPDATE_INVENTORY_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateFailure: true,
        updateError: action.payload,
      };
    case T.REMOVE_INVENTORY_REQUEST:
      return {
        ...state,
        removeLoading: true,
        removeSuccess: false,
        removeFailure: false,
        removeError: null,
      };
    case T.REMOVE_INVENTORY_SUCCESS:
      return {
        ...state,
        removeLoading: false,
        removeSuccess: true,
        items: state.items.filter((x) => x.id !== action.payload.id),
      };
    case T.REMOVE_INVENTORY_FAILURE:
      return {
        ...state,
        removeLoading: false,
        removeFailure: true,
        removeError: action.payload,
      };
    case T.USAGE_INVENTORY_REQUEST:
      return {
        ...state,
        usageLoading: true,
        usageSuccess: false,
        usageFailure: false,
        usageError: null,
      };
    case T.USAGE_INVENTORY_SUCCESS:
      return {
        ...state,
        usageLoading: false,
        usageSuccess: true,
        items: state.items.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x,
        ),
      };
    case T.USAGE_INVENTORY_FAILURE:
      return {
        ...state,
        usageLoading: false,
        usageFailure: true,
        usageError: action.payload,
      };
    default:
      return state;
  }
};
