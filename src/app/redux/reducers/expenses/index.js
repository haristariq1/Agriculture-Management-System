import { EXPENSE_REQUEST as T } from "../../actions/utilities";
const initial = {
  expenses: [],
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
export const expensesReducer = (state = initial, action) => {
  switch (action.type) {
    case T.GET_EXPENSE_REQUEST:
      return {
        ...state,
        getLoading: true,
        getSuccess: false,
        getFailure: false,
        getError: null,
      };
    case T.GET_EXPENSE_SUCCESS:
      return {
        ...state,
        getLoading: false,
        getSuccess: true,
        expenses: action.payload,
      };
    case T.GET_EXPENSE_FAILURE:
      return {
        ...state,
        getLoading: false,
        getFailure: true,
        getError: action.payload,
      };
    case T.ADD_EXPENSE_REQUEST:
      return {
        ...state,
        addLoading: true,
        addSuccess: false,
        addFailure: false,
        addError: null,
      };
    case T.ADD_EXPENSE_SUCCESS:
      return {
        ...state,
        addLoading: false,
        addSuccess: true,
        expenses: [...state.expenses, action.payload],
      };
    case T.ADD_EXPENSE_FAILURE:
      return {
        ...state,
        addLoading: false,
        addFailure: true,
        addError: action.payload,
      };
    case T.UPDATE_EXPENSE_REQUEST:
      return {
        ...state,
        updateLoading: true,
        updateSuccess: false,
        updateFailure: false,
        updateError: null,
      };
    case T.UPDATE_EXPENSE_SUCCESS:
      return {
        ...state,
        updateLoading: false,
        updateSuccess: true,
        expenses: state.expenses.map((x) =>
          x.id === action.payload.id ? { ...x, ...action.payload } : x,
        ),
      };
    case T.UPDATE_EXPENSE_FAILURE:
      return {
        ...state,
        updateLoading: false,
        updateFailure: true,
        updateError: action.payload,
      };
    case T.REMOVE_EXPENSE_REQUEST:
      return {
        ...state,
        removeLoading: true,
        removeSuccess: false,
        removeFailure: false,
        removeError: null,
      };
    case T.REMOVE_EXPENSE_SUCCESS:
      return {
        ...state,
        removeLoading: false,
        removeSuccess: true,
        expenses: state.expenses.filter((x) => x.id !== action.payload.id),
      };
    case T.REMOVE_EXPENSE_FAILURE:
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
