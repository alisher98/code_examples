import { combineReducers } from 'redux';
import { categoriesReducer } from './categories/categoriesReducer';
import { workers } from './workerReducer';
import { posts } from './postReducer';
import { criteria } from './criteriaReducer';
import { settings } from './settingsReducer';
import { signatures } from './signaturesReducer';

const createRootReducer = combineReducers({
  categories: categoriesReducer,
  workers,
  posts,
  criteria,
  settings,
  signatures,
});

export default createRootReducer;
