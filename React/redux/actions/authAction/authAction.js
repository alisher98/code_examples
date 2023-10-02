import apiRequest from '../../../configs';
import { LOG_IN_CMD } from '../../../consts';
import { addPageAction } from '../../actionCreators/categoriesActionCreator/categoriesActionCreator';

export const loginAction = (data) => {
  console.log('ACTION BEFORE', data);
  return async (dispatch) => {
    try {
      console.log('login action data', data);
      const { data } = await apiRequest(LOG_IN_CMD, { data });
      dispatch(addPageAction(data));
    } catch (e) {
      console.log('Login error', e.message);
    }
  };
};
