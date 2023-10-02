import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from './Setting.module.scss';
import save from '../../assets/images/icon/save.png';
import { ReactComponent as PenIcon } from '../../assets/images/icon/pen-icon.svg';
import { ReactComponent as DeleteIcon } from '../../assets/images/icon/delete-icon.svg';
import PostModal from '../../components/PostModal/PostModal';
import Spinner from '../../components/Spinner/Spinner';
import {
  createSignature,
  editSignature,
  getSignature,
  removeSignature,
} from '../../redux/actions/signatureAction';
import { ReactComponent as PlusIcon } from '../../assets/images/icon/plus-icon.svg';
const SettingTagsPage = () => {
  const dispatch = useDispatch();
  const signatures = useSelector((s) => s.signatures.signatures);
  const [open2, setOpen2] = useState(null);
  const [openModal2, setOpenModal2] = useState(false);
  const [showInput2, setShowInput2] = useState(false);
  const [inputValue2, setInputValue2] = useState('');
  const [loading2, setLoading2] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [newTagInp, setNewTagInp] = useState('');
  useEffect(() => {
    setLoading2(true);
    dispatch(getSignature()).then(() => {
      setLoading2(false);
    });
  }, []);

  const toogleModal = (id) => {
    setOpenModal2(!openModal2);
    setOpen2(id);
  };
  const deleteTag = () => {
    setLoading2(true);
    dispatch(removeSignature(open2)).then(() => {
      setLoading2(false);
    });
    setOpenModal2(false);
  };
  const editTag = (id) => {
    if (inputValue2.length) {
      const newTag = { id: id, name: inputValue2 };
      setLoading2(true);
      dispatch(editSignature(newTag, id)).then(() => {
        setLoading2(false);
      });
    }
    setOpenModal2(false);
    setShowInput2(false);
  };
  const createTag = () => {
    if (newTagInp.length) {
      const newTag = { name: newTagInp };
      setLoading2(true);
      dispatch(createSignature(newTag)).then(() => {
        setLoading2(false);
      });
    }
    setNewTagInp('');
    setNewItem(false);
  };
  return (
    <div className={style.tag}>
      <h1>Подписи</h1>
      {loading2 ? (
        <Spinner />
      ) : (
        <div className={style.tag_content}>
          {signatures.map((item) => (
            <div className={style.item} key={item.id}>
              {open2 === item.id && showInput2 ? (
                <input
                  value={inputValue2 || item.name}
                  className={style.edit_input}
                  onChange={(e) => setInputValue2(e.target.value)}
                  placeholder="Название"
                />
              ) : (
                <p>{item.name}</p>
              )}
              <span>
                {showInput2 && open2 === item.id && (
                  <img className={style.checked} src={save} onClick={() => editTag(item.id)} />
                )}
                <PenIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowInput2(!showInput2);
                    setOpen2(item.id);
                  }}
                />
                <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => toogleModal(item.id)} />
                {openModal2 && (
                  <PostModal
                    confirmText="Удалить подпись ?"
                    handleClose={toogleModal}
                    declineText="Отменить"
                    acceptText="Удалить"
                    confirmFunc={deleteTag}
                  />
                )}
              </span>
            </div>
          ))}
          {newItem && (
            <div className={style.add_block}>
              <input type="text" onChange={(e) => setNewTagInp(e.target.value)} />
              <button onClick={() => createTag()}>Добавить</button>
            </div>
          )}
          <PlusIcon className={style.plus_icon} onClick={() => setNewItem(!newItem)} />
        </div>
      )}
    </div>
  );
};

export default SettingTagsPage;
