import {
  GET_SETTINGS_CRITERIA_ACTION,
  POST_SETTINGS_ACTION,
  POST_SETTINGS_CRITERIA_ACTION,
} from '../../consts';

export const getSettingCriteriaAction = (data) => ({ type: GET_SETTINGS_CRITERIA_ACTION, data });
export const postSettingCriteriaAction = (data) => ({ type: POST_SETTINGS_CRITERIA_ACTION, data });
export const postSettingAction = (data) => ({ type: POST_SETTINGS_ACTION, data });
//   export const getSettingByIDAction = (data) => ({ type: POST_SETTINGS_ACTION, data });
