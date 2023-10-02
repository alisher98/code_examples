import apiRequest from '../../configs';
import {
  GET_AUTHOR_CMD,
  GET_CRITERIA_CMD,
  GET_DEPARTMENTS_CMD,
  GET_FILTERED_CRITERIA_CMD,
  GET_FILTERED_DEPS_CMD,
  GET_FILTERED_WORKERS_CMD,
  GET_WORKERS_CMD,
} from '../../consts';
import {
  getAuthorsAction,
  getCriteriaAction,
  getDepartmentsAction,
  getFilteredCriteriaAction,
  getFilteredDepsAction,
  getFilteredWorkersAction,
  getWorkersAction,
} from '../actionCreators/workersActionCreator';
import {
  loadingEndAction,
  loadingStartAction,
} from '../actionCreators/categoriesActionCreator/categoriesActionCreator';

export const getAuthors = () => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_AUTHOR_CMD);
      dispatch(loadingEndAction());
      dispatch(getAuthorsAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getWorkers = () => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_WORKERS_CMD);
      dispatch(loadingEndAction());
      dispatch(getWorkersAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getFilteredWorkers = (value) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_FILTERED_WORKERS_CMD, { query: { search: value } });
      dispatch(
        getFilteredWorkersAction(
          data.map((user) => ({ ...user, first_name: user.first_name || 'Empty#' }))
        )
      );
      dispatch(loadingEndAction());
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getFilteredDeps = (value) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_FILTERED_DEPS_CMD, { query: { search: value } });
      dispatch(getFilteredDepsAction(data));
      dispatch(loadingEndAction());
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getFilteredCriteria = (value) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_FILTERED_CRITERIA_CMD, { query: { search: value } });
      dispatch(getFilteredCriteriaAction(data));
      dispatch(loadingEndAction());
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getDepartments = () => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_DEPARTMENTS_CMD);
      dispatch(loadingEndAction());
      dispatch(getDepartmentsAction(data));
      return data;
    } catch (e) {
      console.log(e.message);
      dispatch(loadingEndAction());
    }
  };
};

export const getCriterias = () => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_CRITERIA_CMD);
      dispatch(loadingEndAction());
      dispatch(getCriteriaAction(data));
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};
