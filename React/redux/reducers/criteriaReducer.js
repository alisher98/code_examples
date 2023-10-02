import {
  GET_CRITERIA_CATEGORY_ACTION,
  GET_CRITERIA_PAGE_BY_ID_ACTION,
  POST_CRITERIA_ACTION,
  POST_CRITERIA_CATEGORY_ACTION,
} from '../../consts';

const initialState = {
  criteriaCategories: [],
  currentCriteria: {},
};

export const criteria = (state = initialState, action) => {
  switch (action.type) {
    case POST_CRITERIA_CATEGORY_ACTION:
      return { ...state, criteriaCategories: [...state.criteriaCategories, action.data] };
    case GET_CRITERIA_CATEGORY_ACTION:
      return { ...state, criteriaCategories: action.data };
    case POST_CRITERIA_ACTION:
      return {
        ...state,
        criteriaCategories: state.criteriaCategories.map((category) => {
          if (category.id === action.id) {
            category.set_criterions = [
              ...category.set_criterions,
              { id: action.data.id, name: action.data.name },
            ];
          }
          return category;
        }),
      };
    case GET_CRITERIA_PAGE_BY_ID_ACTION:
      return { ...state, currentCriteria: action.data };
    case 'REMOVE_CURRENT_CRITERIA':
      return { ...state, currentCriteria: {} };
    case 'REMOVE_CRITERIA_BY_ID':
      return { ...state, currentCriteria: {} };
    default:
      return state;
  }
};
