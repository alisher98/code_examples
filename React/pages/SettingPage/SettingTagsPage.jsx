import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editTags, getTags, removeTags, createTags } from '../../redux/actions/postAction';
import style from './Setting.module.scss';
import save from '../../assets/images/icon/save.png';
import { ReactComponent as PenIcon } from '../../assets/images/icon/pen-icon.svg';
import { ReactComponent as DeleteIcon } from '../../assets/images/icon/delete-icon.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/icon/plus-icon.svg';
import PostModal from '../../components/PostModal/PostModal';
import Spinner from '../../components/Spinner/Spinner';

const SettingTagsPage = () => {
  const dispatch = useDispatch();
  const tags = useSelector((s) => s.posts.tags);
  const [open, setOpen] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState(false);
  const [newTagInp, setNewTagInp] = useState('');
  useEffect(() => {
    setLoading(true);
    dispatch(getTags()).then(() => {
      setLoading(false);
    });
  }, []);

  const toogleModal = (id) => {
    setOpenModal(!openModal);
    setOpen(id);
  };
  const deleteTag = () => {
    setLoading(true);
    dispatch(removeTags(open)).then(() => {
      setLoading(false);
    });
    setOpenModal(false);
  };
  const editTag = (id) => {
    if (inputValue.length) {
      const newTag = { id: id, name: inputValue };
      setLoading(true);
      dispatch(editTags(newTag, id)).then(() => {
        setLoading(false);
      });
    }
    setOpenModal(false);
    setShowInput(false);
  };
  const createTag = () => {
    if (newTagInp.length) {
      const newTag = { name: newTagInp };
      setLoading(true);
      dispatch(createTags(newTag)).then(() => {
        setLoading(false);
      });
    }
    setNewTagInp('');
    setNewItem(false);
  };
  return (
    <div className={style.tag}>
      <h1>Тэги</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className={style.tag_content}>
          {tags?.map((item) => (
            <div className={style.item} key={item.id}>
              {open === item.id && showInput ? (
                <input
                  value={inputValue || item.name}
                  className={style.edit_input}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Название"
                />
              ) : (
                <p>{item.name}</p>
              )}
              <span>
                {showInput && open === item.id && (
                  <img className={style.checked} src={save} onClick={() => editTag(item.id)} />
                )}
                <PenIcon
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setShowInput(!showInput);
                    setOpen(item.id);
                  }}
                />
                <DeleteIcon style={{ cursor: 'pointer' }} onClick={() => toogleModal(item.id)} />
                {openModal && (
                  <PostModal
                    confirmText="Удалить тэг ?"
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
