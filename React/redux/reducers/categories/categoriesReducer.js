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
} from '../../../consts';

const initialState = {
  categories: [],
  token: '',
  currentPageContent: '',
  loading: false,
  user: {},
};

export const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_DRAFT:
      return {
        ...state,
        categories: state.categories.map((item) => {
          if (item.id === action.data.category.id) {
            item.pages = item.pages.map((page) => {
              if (page.id === action.data.id) {
                page.is_draft = action.data.data?.is_draft;
              }
              return page;
            });
          }
          return item;
        }),
      };
    case DELETE_PAGE_ACTION:
      return {
        ...state,
        categories: state.categories.map((item) => {
          if (item.id === action.data.category.id) {
            item.pages = item.pages.filter((page) => page.id !== action.data.id);
          }
          return item;
        }),
      };
    case GET_CATEGORIES_ACTION:
      return { ...state, categories: action.data };
    case ADD_CATEGORY_ACTION:
      return { ...state, categories: [...state.categories, { ...action.data, pages: [] }] };
    case ADD_PAGE_ACTION:
      return {
        ...state,
        categories: state.categories.map((el) => {
          if (el.id === action.data.category) {
            el.pages = [
              ...el.pages,
              { id: action.data.id, index: action.data.index, title: action.data.title },
            ];
          }
          return el;
        }),
      };
    case LOG_IN_ACTION:
      return { ...state, token: action.data };
    case GET_USER_ACTION:
      return { ...state, user: action.data };
    case ADD_PAGE_CONTENT_ACTION:
      return { ...state, currentPageContent: action.data };
    case GET_PAGE_CONTENT_ACTION:
      return { ...state, currentPageContent: action.data };
    case ADD_PAGE_BODY_ACTION:
      return { ...state, currentPageContent: { ...state.currentPageContent, body: action.data } };
    case LOADING_START_ACTION:
      return { ...state, loading: action.data };
    case LOADING_END_ACTION:
      return { ...state, loading: action.data };
    case 'CLEAN_CURRENT_PAGE':
      return { ...state, currentPageContent: '' };
    default:
      return state;
  }
};
