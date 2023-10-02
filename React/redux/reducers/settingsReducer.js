import {
  GET_CRITERIA_PAGE_BY_ID_ACTION,
  GET_SETTINGS_CRITERIA_ACTION,
  POST_SETTINGS_ACTION,
  POST_SETTINGS_CRITERIA_ACTION,
} from '../../consts';

const initialState = {
  criteries: [],
  currentCriteriaPage: {},
};

export const settings = (state = initialState, action) => {
  switch (action.type) {
    case GET_SETTINGS_CRITERIA_ACTION:
      return { ...state, criteries: action.data };
    case POST_SETTINGS_CRITERIA_ACTION:
      return { ...state, criteries: [...state.criteries, action.data] };
    case POST_SETTINGS_ACTION:
      console.log('TEST CALL', action);
      return {
        ...state,
        criteries: state.criteries.map((item) => {
          if (item.id === action.data.category) {
            console.log('TEST CATEG', {
              ...item,
              templates: [...item.templates, action.data],
            });
            return {
              ...item,
              templates: [...item.templates, action.data],
            };
          }
          return item;
        }),
      };
    case GET_CRITERIA_PAGE_BY_ID_ACTION:
      return { ...state, currentCriteriaPage: action.data };
    default:
      return state;
  }
};
