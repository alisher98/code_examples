import {
  GET_CRITERIA_BY_ID_CMD,
  GET_CRITERIA_CATEGORY_CMD,
  POST_CRITERIA_CATEGORY_CMD,
  POST_CRITERIA_CMD,
  UPDATE_CRITERIA_BY_ID_CMD,
} from '../../consts';
import {
  getCriteriaByIdAction,
  getCriteriaCategoryAction,
  postCriteriaAction,
  postCriteriaCategoryAction,
} from '../actionCreators/criteriaActionCreator';
import apiRequest from '../../configs';
import {
  loadingEndAction,
  loadingStartAction,
} from '../actionCreators/categoriesActionCreator/categoriesActionCreator';
import { toast } from 'react-toastify';

export const postCriteriaCategory = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(POST_CRITERIA_CATEGORY_CMD, { data: payload });
      dispatch(loadingEndAction());
      dispatch(postCriteriaCategoryAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getCriteriaCategory = (searchParams) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_CRITERIA_CATEGORY_CMD, { query: searchParams });
      dispatch(loadingEndAction());
      dispatch(getCriteriaCategoryAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const postCriteria = (payload, id) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(POST_CRITERIA_CMD, { data: payload });
      dispatch(loadingEndAction());
      dispatch(postCriteriaAction(data, id));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getCriteriaById = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_CRITERIA_BY_ID_CMD, { params: { id } });
      dispatch(loadingEndAction());
      dispatch(getCriteriaByIdAction(data));
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const updateCriterias = (id, payload) => {
  return async (dispatch) => {
    try {
      await apiRequest(UPDATE_CRITERIA_BY_ID_CMD, {
        params: { id },
        data: payload,
      });
      toast.success('Успешно сохранено!');
    } catch (e) {
      console.log(e.message);
    }
  };
};
