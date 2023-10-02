import {
  CREATE_TAG,
  DELETE_POST_ACTION,
  DELETE_TAG,
  GET_CURRENT_POST_ACTION,
  GET_POSTS_ACTION,
  GET_TAGS_ACTION,
  GET_USERS_ACTION,
  SEND_POST_ACTION,
  UPDATE_POST_ACTION,
  UPDATE_TAG,
} from '../../consts';

export const getTagsAction = (data) => ({ type: GET_TAGS_ACTION, data });
export const getPostsAction = (data) => ({ type: GET_POSTS_ACTION, data });
export const sendPostAction = (data) => ({ type: SEND_POST_ACTION, data });
export const updatePostAction = (data) => ({ type: UPDATE_POST_ACTION, data });
export const getCurrentPostAction = (data) => ({ type: GET_CURRENT_POST_ACTION, data });
export const getUsersAction = (data) => ({ type: GET_USERS_ACTION, data });
export const deletePostAction = (data) => ({ type: DELETE_POST_ACTION, data });
export const removeCurrentPost = () => ({ type: 'REMOVE_CURRENT_POST' });
export const deleteTagAction = (data) => ({ type: DELETE_TAG, data });
export const editTagAction = (data) => ({ type: UPDATE_TAG, data });
export const sendTags = (data) => ({ type: CREATE_TAG, data });
