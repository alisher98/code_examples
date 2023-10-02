import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import createRootReducer from './reducers/combineReducers';

const middleware = [thunk];

const initialState = {};
const store = createStore(
  createRootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
