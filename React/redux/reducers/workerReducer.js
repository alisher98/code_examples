import {
  GET_AUTHORS_ACTION,
  GET_CRITERIA_ACTION,
  GET_DEPARTMENTS_ACTION,
  GET_FILTERED_CRITERIA_ACTION,
  GET_FILTERED_DEPS_ACTION,
  GET_FILTERED_WORKERS_ACTION,
  GET_WORKERS_ACTION,
} from '../../consts';

const initialState = {
  workers: [],
  departments: [],
  criteria: [],
  filteredWorkers: [],
  filteredDepartments: [],
  filteredCriteria: [],
  authors: [],
};

export const workers = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTHORS_ACTION:
      return {
        ...state,
        authors: action.data,
      };
    case GET_WORKERS_ACTION:
      return {
        ...state,
        workers: action.data.filter((el) => {
          if ((el.last_name.length && el.first_name.length) || el.second_name.length) {
            return el;
          }
        }),
      };
    case GET_FILTERED_WORKERS_ACTION:
      return { ...state, filteredWorkers: action.data };
    case GET_DEPARTMENTS_ACTION:
      return { ...state, departments: action.data };
    case GET_FILTERED_DEPS_ACTION:
      return { ...state, filteredDepartments: action.data };
    case GET_CRITERIA_ACTION:
      return { ...state, criteria: action.data };
    case GET_FILTERED_CRITERIA_ACTION:
      return { ...state, filteredCriteria: action.data };
    default:
      return state;
  }
};
