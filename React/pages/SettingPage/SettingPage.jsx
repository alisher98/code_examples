import React, { useCallback, useEffect, useState } from 'react';
import cl from './Setting.module.scss';
import { ReactComponent as ArrowLeftIcon } from '../../assets/images/icon/mailingIcons/arrow-left-icon.svg';
import CheckboxCustom from '../../components/CheckboxCustom/CheckboxCustom';
import SettingParametr from '../../components/SettingParametr/SettingParametr';
import { ReactComponent as PlusIcon } from '../../assets/images/icon/plus-icon.svg';
import AddCategory from '../../components/AddCategory/AddCategory';
import AddPage from '../../components/AddPage/AddPage';
import { getSettingById, getSettingsCriteria } from '../../redux/actions/settingAction';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../../components/Spinner/Spinner';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { Switch } from 'antd';
const SettingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.get('search') ? searchParams.get('search') : ''
  );
  const criteries = useSelector((state) => state.settings.criteries);
  const currentCriteriaPage = useSelector((state) => state.settings.currentCriteriaPage);
  const loading = useSelector((state) => state.categories.loading);
  const {
    fileSet: [file, setFile],
    paramsSet: [params, setParams],
    specialist: [specialist, setSpecialist],
  } = useOutletContext();
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [showNewCategory, setShowNewCatgory] = useState(false);
  const [showNewPage, setShowNewPage] = useState(false);
  const [category, setCategory] = useState({});
  const [checkedId, setCheckedId] = useState(null);

  useEffect(() => {
    setSearchParams({
      search: search,
    });
  }, [search]);
  useEffect(() => {
    dispatch(getSettingsCriteria(searchParams));
  }, [searchParams]);

  const debounce = (func) => {
    let timer;
    return function (...args) {
      // eslint-disable-next-line no-invalid-this
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 1000);
    };
  };
  const handleChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };
  const optimisedVersion = useCallback(debounce(handleChange), []);

  const createSetting = () => {
    setParams((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'input',
        title: '',
        code: '',
      },
    ]);
  };
  useEffect(() => {
    if (Object.keys(category).length) {
      setCategory(criteries.find((item) => item.id === category.id));
    }
  }, [criteries]);

  useEffect(() => {
    if (Object.keys(currentCriteriaPage).length) {
      setShowSettings(true);
      setParams(
        (currentCriteriaPage.fields || []).map((item, i) => ({ ...item, id: Date.now() - i }))
      );
      setFile(null);
    }
  }, [currentCriteriaPage]);

  useEffect(() => {
    if (checkedId) dispatch(getSettingById(checkedId));
  }, [checkedId]);

  const addNewCategory = () => {
    setShowNewCatgory(!showNewCategory);
  };
  const addNewPage = () => {
    setShowNewPage(!showNewPage);
  };

  return (
    <div className={cl.setting}>
      <h2 className={cl.setting_title}>Настройка справок</h2>

      <div className={cl.setting_inner}>
        <div className={cl.setting_inner_left}>
          <label htmlFor="search">ПОИСК</label>
          <input
            name="search"
            type="text"
            placeholder="Найти критерий"
            onChange={optimisedVersion}
          />
          <h6>Выберите критерий</h6>
          <div className={cl.settings_tab}>
            <div className={cl.tab_criteries}>
              {criteries.map((item) => (
                <div
                  key={item.id}
                  className={
                    cl.tab_criteries_item +
                    ` ${category.id === item.id ? cl.tab_criteries_item_active : ''}`
                  }
                  onClick={() => setCategory(item)}
                >
                  <p>{item.name}</p>
                  <ArrowLeftIcon style={{ cursor: 'pointer' }} />
                </div>
              ))}
              {showNewCategory && (
                <AddCategory
                  setShowCategoryAddingWindow={setShowNewCatgory}
                  type="settings"
                  dispatch={dispatch}
                />
              )}
            </div>
            <div className={cl.tab_pages}>
              <>
                {category?.templates?.map((item) => (
                  <div
                    key={item.id}
                    className={cl.tab_pages_item}
                    onClick={() => setCheckedId(item.id)}
                  >
                    <p>{item.name}</p>
                    <CheckboxCustom isChecked={checkedId === item.id} type="criteria" alone />
                  </div>
                ))}
              </>
              {showNewPage && (
                <AddPage
                  type="settings"
                  dispatch={dispatch}
                  category={category}
                  setShowNewPage={addNewPage}
                />
              )}
            </div>
            <PlusIcon className={cl.plusIcon} onClick={() => addNewCategory()} />
            {Object.keys(category).length ? (
              <PlusIcon className={cl.plusIcon2} onClick={() => addNewPage()} />
            ) : (
              ''
            )}
          </div>
        </div>
        {showSettings && (
          <div className={cl.setting_inner_right}>
            <div className={cl.header}>
              <button className={cl.buttons} onClick={() => createSetting()}>
                Добавить поле
              </button>
              <div>
                <label className={cl.buttons} onChange={setFile} htmlFor="fileId">
                  Выберите файл
                  <input type="file" id="fileId" hidden />
                </label>
                <span>
                  {file ? (
                    file.name
                  ) : currentCriteriaPage.file ? (
                    <a href={currentCriteriaPage.file} target="_blank" rel="noreferrer">
                      загруженный файл
                    </a>
                  ) : (
                    'файл не выбран'
                  )}
                </span>
              </div>
            </div>
            <div className={cl.specialist}>
              <Switch checked={specialist} onChange={(e) => setSpecialist(e)} />
              <span>Справка подготавливается специалистом кадрового отдела</span>
            </div>
            <div className={cl.area_container}>
              {params.map((item, index) => (
                <SettingParametr
                  key={item.id || index}
                  item={item}
                  id={item.id}
                  setArr={setParams}
                />
              ))}
            </div>
            <div className={cl.table}>
              <h5>Справочник кодов системных полей</h5>
              <div className={cl.table_head}>
                <div>
                  <p>Наименование</p>
                </div>
                <div>
                  <p>Код поля</p>
                </div>
                <div>
                  <p>Пример</p>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Порядковый номер справки</p>
                  </div>
                  <div>
                    <p>spravka_id</p>
                  </div>
                  <div>
                    <p>36</p>
                  </div>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Должность пользователя</p>
                  </div>
                  <div>
                    <p>position</p>
                  </div>
                  <div>
                    <p>Аналитик</p>
                  </div>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Имя компании пользователя</p>
                  </div>
                  <div>
                    <p>company</p>
                  </div>
                  <div>
                    <p>ГК ФСК ООО</p>
                  </div>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Инициалы и фамилия пользователя</p>
                  </div>
                  <div>
                    <p>fio_short</p>
                  </div>
                  <div>
                    <p>И.И. Иванов</p>
                  </div>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Фамилия Имя Отчество</p>
                  </div>
                  <div>
                    <p>fio_full</p>
                  </div>
                  <div>
                    <p>Иванов Иван Иванович</p>
                  </div>
                </div>
              </div>
              <div className={cl.table_item}>
                <div className={cl.table_item_inner}>
                  <div>
                    <p>Текущая дата</p>
                  </div>
                  <div>
                    <p>current_date</p>
                  </div>
                  <div>
                    <p>05.04.2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default SettingPage;
