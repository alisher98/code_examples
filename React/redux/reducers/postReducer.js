import {
  CREATE_TAG,
  DELETE_POST_ACTION,
  DELETE_TAG,
  GET_CURRENT_POST_ACTION,
  GET_POSTS_ACTION,
  GET_TAGS_ACTION,
  SEND_POST_ACTION,
  UPDATE_POST_ACTION,
  UPDATE_TAG,
} from '../../consts';

const initialState = {
  tags: [],
  posts: [],
  newPost: {},
  currentPost: {},
};

export const posts = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TAG:
      return { ...state, tags: [...state.tags, action.data] };
    case UPDATE_TAG:
      return {
        ...state,
        tags: state.tags.map((item) => {
          if (item.id === action.data.id) {
            item = action.data;
          }
          return item;
        }),
      };
    case DELETE_TAG:
      return { ...state, tags: state.tags.filter((item) => item.id !== action.data) };
    case GET_TAGS_ACTION:
      return { ...state, tags: action.data };
    case GET_POSTS_ACTION:
      return { ...state, posts: action.data };
    case SEND_POST_ACTION:
      return { ...state, newPost: action.newPost };
    case GET_CURRENT_POST_ACTION:
      return { ...state, currentPost: action.data };
    case UPDATE_POST_ACTION:
      return { ...state, updatedPost: action.data };
    case DELETE_POST_ACTION:
      return { ...state, posts: state.posts.filter((item) => item.id !== action.data) };
    case 'REMOVE_CURRENT_POST':
      return { ...state, currentPost: {} };
    case 'SET_NEW_POST_TITLE':
      return { ...state, currentPost: { ...state.currentPost, title: action.data } };
    case 'SET_NEW_POST_BODY':
      return { ...state, currentPost: { ...state.currentPost, body: action.data } };
    default:
      return state;
  }
};
