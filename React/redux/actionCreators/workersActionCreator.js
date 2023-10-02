import {
  GET_AUTHORS_ACTION,
  GET_CRITERIA_ACTION,
  GET_DEPARTMENTS_ACTION,
  GET_FILTERED_CRITERIA_ACTION,
  GET_FILTERED_DEPS_ACTION,
  GET_FILTERED_WORKERS_ACTION,
  GET_WORKERS_ACTION,
} from '../../consts';

export const getWorkersAction = (data) => ({ type: GET_WORKERS_ACTION, data });
export const getDepartmentsAction = (data) => ({ type: GET_DEPARTMENTS_ACTION, data });
export const getCriteriaAction = (data) => ({ type: GET_CRITERIA_ACTION, data });

export const getFilteredWorkersAction = (data) => ({ type: GET_FILTERED_WORKERS_ACTION, data });
export const getFilteredDepsAction = (data) => ({ type: GET_FILTERED_DEPS_ACTION, data });
export const getFilteredCriteriaAction = (data) => ({ type: GET_FILTERED_CRITERIA_ACTION, data });
export const getAuthorsAction = (data) => ({ type: GET_AUTHORS_ACTION, data });
