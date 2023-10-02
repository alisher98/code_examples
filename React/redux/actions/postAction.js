import apiRequest from '../../configs';
import {
  DELETE_POST_CMD,
  GET_CURRENT_POST_CMD,
  GET_POSTS_CMD,
  GET_TAGS_CMD,
  GET_USERS_CMD,
  SEND_POST_CMD,
  UPDATE_POST_CMD,
  UPDATE_DRAFT,
  REMOVE_TAG_CMD,
  EDIT_TAG_CMD,
  CREATE_TAG_CMD,
} from '../../consts';
import {
  deletePostAction,
  deleteTagAction,
  editTagAction,
  getCurrentPostAction,
  getPostsAction,
  getTagsAction,
  getUsersAction,
  removeCurrentPost,
  sendPostAction,
  sendTags,
  updatePostAction,
} from '../actionCreators/postActionCreator';
import {
  loadingEndAction,
  loadingStartAction,
} from '../actionCreators/categoriesActionCreator/categoriesActionCreator';
import { toast } from 'react-toastify';

export const deletePost = (id) => {
  return async (dispatch) => {
    try {
      await apiRequest(DELETE_POST_CMD, { params: { id } });
      dispatch(deletePostAction(id));
      toast.success('Пост успешно удалён !');
    } catch (error) {
      console.log(e.message);
    }
  };
};
export const sendPost = (payload) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(SEND_POST_CMD, { data: payload });
      dispatch(sendPostAction(data));
      toast.success('Успешно сохранено!');
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const toggleDraft = (id) => {
  return async () => {
    try {
      await apiRequest(UPDATE_DRAFT, { params: { id } });
      toast.success('Тип поста изменён !');
    } catch (error) {
      console.log(e.message);
    }
  };
};

export const updatePost = (payload, id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(UPDATE_POST_CMD, { data: payload, params: { id } });
      dispatch(updatePostAction(data));
      toast.success('Успешно обновлено !');
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getCurrentPost = (id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_CURRENT_POST_CMD, { params: { id } });
      dispatch(getCurrentPostAction(data));
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getTags = () => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_TAGS_CMD);
      dispatch(getTagsAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const removeTags = (id) => {
  return async (dispatch) => {
    try {
      await apiRequest(REMOVE_TAG_CMD, { params: { id } });
      dispatch(deleteTagAction(id));
      toast.success('Тэг удалён!');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const editTags = (obj, id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(EDIT_TAG_CMD, { data: obj, params: { id } });
      dispatch(editTagAction(data));
      toast.success('Тэг обновлён!');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const createTags = (obj) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(CREATE_TAG_CMD, { data: obj });
      dispatch(sendTags(data));
      toast.success('Тэг добавлен!');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getPosts = (searchParams) => {
  return async (dispatch) => {
    try {
      dispatch(loadingStartAction());
      const { data } = await apiRequest(GET_POSTS_CMD, { query: searchParams });
      dispatch(getPostsAction(data));
      dispatch(removeCurrentPost());
      dispatch(loadingEndAction());
      return data;
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_USERS_CMD);
      dispatch(getUsersAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};
