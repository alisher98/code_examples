import { toast } from 'react-toastify';
import apiRequest from '../../configs';
import {
  GET_SETTINGS_BY_ID_CMD,
  GET_SETTINGS_CRITERIA_CMD,
  POST_SETTINGS_CMD,
  POST_SETTINGS_CRITERIA_CMD,
  REMOVE_SETTINGS_CMD,
  UPDATE_SETTINGS_CMD,
} from '../../consts';
import {
  loadingEndAction,
  loadingStartAction,
} from '../actionCreators/categoriesActionCreator/categoriesActionCreator';
import { getCriteriaByIdAction } from '../actionCreators/criteriaActionCreator';
import {
  getSettingCriteriaAction,
  postSettingAction,
  postSettingCriteriaAction,
} from '../actionCreators/settingActionCreator';

export const getSettingsCriteria = (searchParams) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_SETTINGS_CRITERIA_CMD, { query: searchParams });
      dispatch(getSettingCriteriaAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const postSettingsCriteria = (obj) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(POST_SETTINGS_CRITERIA_CMD, { data: obj });
      dispatch(postSettingCriteriaAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const postSettings = (obj, id) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(POST_SETTINGS_CMD, { data: obj });
      dispatch(postSettingAction(data, id));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getSettingById = (id) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_SETTINGS_BY_ID_CMD, { params: { id } });
      dispatch(getCriteriaByIdAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const sendToBackSettings = (payload, id) => {
  return async () => {
    try {
      await apiRequest(UPDATE_SETTINGS_CMD, { data: payload, params: { id } });
      toast.success('Успешно сохранено');
    } catch (e) {
      toast.error(e.message || 'Ошибка запроса на сервер');
    }
  };
};

export const remove = (id, obj) => {
  return async (dispatch) => {
    try {
      await apiRequest(REMOVE_SETTINGS_CMD, { params: { id } });
    } catch (error) {
      console.log(e.message);
    }
  };
};
