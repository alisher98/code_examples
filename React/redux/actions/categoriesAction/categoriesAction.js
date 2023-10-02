import {
  ADD_CATEGORY_CMD,
  ADD_PAGE_CMD,
  ADD_PAGE_CONTENT_CMD,
  DELETE_PAGE_CMD,
  DRAFT_PAGE_CMD,
  GET_CATEGORIES_CMD,
  GET_PAGE_CONTENT_CMD,
  GET_USER_CMD,
  LOG_IN_CMD,
  LOG_OUT_CMD,
} from '../../../consts';
import {
  addCategoryAction,
  addPageAction,
  addPageContent,
  categoriesAction,
  changeDraft,
  cleanCurrentPage,
  deletePageAction,
  getPageContent,
  getUserAction,
  loadingEndAction,
  loadingStartAction,
  postLoginAction,
} from '../../actionCreators/categoriesActionCreator/categoriesActionCreator';
import apiRequest from '../../../configs';
import { toast } from 'react-toastify';

export const getCategoriesAction = (searchParams) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_CATEGORIES_CMD, { query: searchParams });
      dispatch(categoriesAction(data));
      dispatch(loadingEndAction());
      dispatch(cleanCurrentPage());
      return data;
    } catch (e) {
      dispatch(loadingEndAction());
      console.log(e.message);
    }
  };
};

export const addNewCategoryAction = (category) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(ADD_CATEGORY_CMD, { data: category });
      dispatch(loadingEndAction());
      dispatch(addCategoryAction(data));
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const addNewPageAction = (page) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(ADD_PAGE_CMD, { data: page });
      dispatch(addPageAction(data));
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const loginAction = (admin) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(LOG_IN_CMD, { data: admin });
      localStorage.setItem('token', data.key + '');
      dispatch(postLoginAction(data));
      return data;
    } catch (e) {
      toast.error('Неверный логин или пароль...');
    }
  };
};

export const logoutAction = () => {
  return async (dispatch) => {
    try {
      await apiRequest(LOG_OUT_CMD);
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getUser = () => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_USER_CMD);
      dispatch(getUserAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const putPageAction = (page, id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(ADD_PAGE_CONTENT_CMD, { data: page, params: { id } });
      dispatch(addPageContent(data));
      toast.success('Успешно обновлено !');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getPageById = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_PAGE_CONTENT_CMD, { params: { id } });
      dispatch(getPageContent(data));
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const deletePage = (id, category) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      await apiRequest(DELETE_PAGE_CMD, { params: { id } });
      dispatch(deletePageAction({ id, category }));
      dispatch(loadingEndAction());
      toast.success('Успешно удалено');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const draftPage = (id, category) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(DRAFT_PAGE_CMD, { params: { id } });
      dispatch(loadingEndAction());
      dispatch(changeDraft({ id, category, data }));
    } catch (e) {
      console.log(e.message);
    }
  };
};
