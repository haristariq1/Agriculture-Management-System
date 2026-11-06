import { ATTENDANCE_REQUEST as T } from "../../actions/utilities";
const initial = {
  records: [],
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
};
export const attendanceReducer = (state = initial, action) => {
  switch (action.type) {
    case T.GET_ATTENDANCE_REQUEST:
      return {
        ...state,
        getLoading: true,
        getSuccess: false,
        getFailure: false,
        getError: null,
      };
    case T.GET_ATTENDANCE_SUCCESS:
      return {
        ...state,
        getLoading: false,
        getSuccess: true,
        records: action.payload,
      };
    case T.GET_ATTENDANCE_FAILURE:
      return {
        ...state,
        getLoading: false,
        getFailure: true,
        getError: action.payload,
      };
    case T.ADD_ATTENDANCE_REQUEST:
      return {
        ...state,
        addLoading: true,
        addSuccess: false,
        addFailure: false,
        addError: null,
      };
    case T.ADD_ATTENDANCE_SUCCESS:
      return {
        ...state,
        addLoading: false,
        addSuccess: true,
        records: [...state.records, action.payload],
      };
    case T.ADD_ATTENDANCE_FAILURE:
      return {
        ...state,
        addLoading: false,
        addFailure: true,
        addError: action.payload,
      };
    case T.UPDATE_ATTENDANCE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateFailure: false,
        updateError: null,
      };
    case T.UPDATE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        records: state.records.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x,
        ),
      };
    case T.UPDATE_ATTENDANCE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateFailure: true,
        updateError: action.payload,
      };
    case T.REMOVE_ATTENDANCE_REQUEST:
      return {
        ...state,
        removeLoading: true,
        removeSuccess: false,
        removeFailure: false,
        removeError: null,
      };
    case T.REMOVE_ATTENDANCE_SUCCESS:
      return {
        ...state,
        removeLoading: false,
        removeSuccess: true,
        records: state.records.filter((x) => x.id !== action.payload.id),
      };
    case T.REMOVE_ATTENDANCE_FAILURE:
      return {
        ...state,
        removeLoading: false,
        removeFailure: true,
        removeError: action.payload,
      };
    default:
      return state;
  }
};
