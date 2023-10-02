import { toast } from 'react-toastify';
import apiRequest from '../../configs';
import {
  CREATE_SIGNATURES_CMD,
  DELETE_SIGNATURES_CMD,
  GET_SIGNATURES_CMD,
  UPDATE_SIGNATURES_CMD,
} from '../../consts';
import {
  deleteSignatureAction,
  getSignatureAction,
  sendSignatureAction,
  updateSignatureAction,
} from '../actionCreators/signatureActionCreators';

export const getSignature = () => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(GET_SIGNATURES_CMD);
      dispatch(getSignatureAction(data));
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const editSignature = (obj, id) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(UPDATE_SIGNATURES_CMD, { data: obj, params: { id } });
      dispatch(updateSignatureAction(data));
      toast.success('Подпись обновлена!');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const createSignature = (obj) => {
  return async (dispatch) => {
    try {
      const { data } = await apiRequest(CREATE_SIGNATURES_CMD, { data: obj });
      dispatch(sendSignatureAction(data));
      toast.success('Подпись добавлена!');
    } catch (e) {
      console.log(e.message);
    }
  };
};

export const removeSignature = (id) => {
  return async (dispatch) => {
    try {
      await apiRequest(DELETE_SIGNATURES_CMD, { params: { id } });
      dispatch(deleteSignatureAction(id));
      toast.success('Подпись удалена!');
    } catch (e) {
      console.log(e.message);
    }
  };
};
