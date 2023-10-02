import {
  ADD_CATEGORY_ACTION,
  ADD_PAGE_ACTION,
  ADD_PAGE_BODY_ACTION,
  ADD_PAGE_CONTENT_ACTION,
  CHANGE_DRAFT,
  DELETE_PAGE_ACTION,
  GET_CATEGORIES_ACTION,
  GET_PAGE_CONTENT_ACTION,
  GET_USER_ACTION,
  LOADING_END_ACTION,
  LOADING_START_ACTION,
  LOG_IN_ACTION,
  LOG_IN_SUCCESS_ACTION,
} from '../../../consts';

export const categoriesAction = (data) => ({ type: GET_CATEGORIES_ACTION, data });
export const addCategoryAction = (data) => ({ type: ADD_CATEGORY_ACTION, data });
export const addPageAction = (data) => ({ type: ADD_PAGE_ACTION, data });
export const postLoginAction = (data) => ({ type: LOG_IN_ACTION, data });
export const getUserAction = (data) => ({ type: GET_USER_ACTION, data });
export const successLoginAction = () => ({ type: LOG_IN_SUCCESS_ACTION, data: true });
export const addPageContent = (data) => ({ type: ADD_PAGE_CONTENT_ACTION, data });
export const getPageContent = (data) => ({ type: GET_PAGE_CONTENT_ACTION, data });
export const addPageBody = (data) => ({ type: ADD_PAGE_BODY_ACTION, data });
export const deletePageAction = (data) => ({ type: DELETE_PAGE_ACTION, data });
export const cleanCurrentPage = () => ({ type: 'CLEAN_CURRENT_PAGE' });
export const loadingStartAction = () => ({ type: LOADING_START_ACTION, data: true });
export const loadingEndAction = () => ({ type: LOADING_END_ACTION, data: false });
export const changeDraft = (data) => ({ type: CHANGE_DRAFT, data });
