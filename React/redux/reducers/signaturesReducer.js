const initialState = {
  signatures: [],
};

export const signatures = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_SIGNATURES':
      return { ...state, signatures: [...state.signatures, action.data] };
    case 'GET_SIGNATURES':
      return { ...state, signatures: (state.signatures = action.data) };
    case 'DELETE_SIGNATURE':
      return {
        ...state,
        signatures: state.signatures.filter((item) => item.id !== action.data),
      };
    case 'UPDATE_SIGNATURE':
      return {
        ...state,
        signatures: state.signatures.map((item) => {
          if (item.id === action.data.id) {
            item = action.data;
          }
          return item;
        }),
      };
    default:
      return state;
  }
};
