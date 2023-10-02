import {
  GET_CRITERIA_CATEGORY_ACTION,
  GET_CRITERIA_PAGE_BY_ID_ACTION,
  POST_CRITERIA_ACTION,
  POST_CRITERIA_CATEGORY_ACTION,
} from '../../consts';

export const postCriteriaCategoryAction = (data) => ({ type: POST_CRITERIA_CATEGORY_ACTION, data });
export const getCriteriaCategoryAction = (data) => ({ type: GET_CRITERIA_CATEGORY_ACTION, data });
export const postCriteriaAction = (data, id) => ({ type: POST_CRITERIA_ACTION, data, id });
export const getCriteriaByIdAction = (data) => ({ type: GET_CRITERIA_PAGE_BY_ID_ACTION, data });
