import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as SearchGrayIcon } from '../../assets/images/icon/search-gray-icon.svg';
import { ReactComponent as ArrowLeftIcon } from '../../assets/images/icon/mailingIcons/arrow-left-icon.svg';
import { ReactComponent as PlusIcon } from '../../assets/images/icon/plus-icon.svg';
import AddPage from '../../components/AddPage/AddPage';
import AddCategory from '../../components/AddCategory/AddCategory';
import SectionListItem from '../../components/Selection/SectionlistItem/SectionListItem';
import { useDispatch, useSelector } from 'react-redux';
import { getCriteriaCategory } from '../../redux/actions/criteriaAction';
import ParameterItem from '../../components/ParameterItem/ParameterItem';
import { Select } from 'antd';
import { ReactComponent as ArrowDown } from '../../assets/images/icon/contentCreateIcons/arrow-down-icon.svg';
import Button from '../../components/Buttons/Button';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import { getFilteredDeps } from '../../redux/actions/workersAction';

const dropDownStyles = {
  background: 'gray',
};
const Option = Select.Option;

const CriteriaConstructorPage = () => {
  const dispatch = useDispatch();
  const {
    paramSet: [params, setParams],
  } = useOutletContext();
  const loading = useSelector((s) => s.categories.loading);
  const criteriaCategories = useSelector((s) => s.criteria.criteriaCategories);
  const currentCriteria = useSelector((s) => s.criteria.currentCriteria);
  const [, setSearchConstructors] = useState([]);
  const [showOne, setShowOne] = useState(null);
  const [showTwo, setShowTwo] = useState(null);
  const [showCurrentEditWindow, setShowCurrentEditWindow] = useState(0);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [selected, setSelected] = useState('position');
  const [selectedSections, setSelectedSections] = useState([]);
  const [showNewCriteria, setShowNewCriteria] = useState(false);
  const [showCriteriaAddingWindow, setShowCriteriaAddingWindow] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(
    searchParams.get('search') ? searchParams.get('search') : ''
  );
  const ref = useRef(null);
  const editBarRef = useRef(null);
  useEffect(() => {
    setSearchParams({
      search: search,
    });
  }, [search]);
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

  const addNewParam = () => {
    if (
      currentCriteria.id &&
      selected.length !== 0 &&
      selected !== 'department' &&
      selected !== 'gender'
    ) {
      setParams((prev) => [
        ...prev,
        {
          id: Date.now(),
          parameter: selected,
          value_min: 0,
          value_max: 0,
          value: '',
          unit: 'years',
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    if (selected === 'department') {
      setParams((prev) => [
        ...prev,
        {
          id: Date.now(),
          parameter: selected,
          value_min: 0,
          value_max: 0,
          value: [],
          unit: 'years',
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
    if (selected === 'gender') {
      setParams((prev) => [
        ...prev,
        {
          id: Date.now(),
          parameter: selected,
          value_min: 0,
          value_max: 0,
          value: 'мужской',
          unit: 'years',
          date: new Date().toISOString().split('T')[0],
        },
      ]);
    }
  };

  const editConstructor = (idx) => {
    // if (idx === showTwo) {
    //   setShowTwo(null);
    // } else {
    //   setShowTwo(idx);
    //   setShowCurrentEditWindow(idx);
    // }
  };
  const showCategoryAdding = () => {
    setShowCriteriaAddingWindow(!showCriteriaAddingWindow);
  };
  useEffect(() => {
    dispatch(getCriteriaCategory(searchParams));
  }, [searchParams]);

  useEffect(() => {
    dispatch(getFilteredDeps(''));
  }, []);
  return (
    <div className="constructor">
      <h2 className="constructor__title">Конструктор критериев</h2>
      <div className="constructor__block">
        <div className="constructor__left">
          <div className="constructor__form">
            <label className="constructor__input-label" htmlFor="search" ref={ref}>
              <div>Поиск</div>
              <div className="constructor__input-wrapper">
                <SearchGrayIcon />
                <input
                  onChange={optimisedVersion}
                  className="constructor__input"
                  type="text"
                  id="search"
                  placeholder="НАЙТИ РАЗДЕЛ"
                />
              </div>
            </label>
          </div>
          <h4 className="constructor__description">Выберите категорию</h4>
          <div className="constructor__wrapper">
            <ul className="constructor__levelOne-list">
              {criteriaCategories.map((category, index) => (
                <li
                  key={category.id}
                  className={
                    showOne === index
                      ? 'constructor__levelOne-item active'
                      : 'constructor__levelOne-item'
                  }
                  onClick={() => {
                    setShowOne(index);
                    if (showOne !== index) {
                      dispatch({ type: 'REMOVE_CURRENT_CRITERIA' });
                    }
                  }}
                >
                  <span>{category.name}</span>
                  <ArrowLeftIcon />
                  {showOne === index && (
                    <div>
                      <ul className="constructor__levelTwo-list">
                        {category.set_criterions.map((criteria, idx) => (
                          <SectionListItem
                            type="criteria"
                            setShowTwo={setShowTwo}
                            editBarRef={editBarRef}
                            key={criteria.id}
                            id={criteria.id}
                            showTwo={showTwo}
                            editSection={editConstructor}
                            showEditWindow={showCurrentEditWindow}
                            item={criteria}
                            setShowEditWindow={setShowCurrentEditWindow}
                            setSelectedPages={setSelectedCriteria}
                            selectedPages={selectedCriteria}
                            selectedSections={selectedSections}
                            setSelectedSections={setSelectedSections}
                            setParams={setParams}
                          />
                        ))}
                        {showNewCriteria && (
                          <AddPage
                            type="criteria"
                            id={category.id}
                            setShowNewPage={setShowNewCriteria}
                            // pageIndex={category.pages.length + 1}
                            category={category}
                            dispatch={dispatch}
                            showPageAddingWindow={showCriteriaAddingWindow}
                            setShowPageAddingWindow={setShowCriteriaAddingWindow}
                            setSearchSections={setSearchConstructors}
                          />
                        )}
                      </ul>
                      <div className="btn-wrapper-in">
                        <PlusIcon onClick={() => setShowNewCriteria(true)} />
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {showCriteriaAddingWindow && (
                <AddCategory
                  dispatch={dispatch}
                  setShowCategoryAddingWindow={setShowCriteriaAddingWindow}
                  setSearchSections={setSearchConstructors}
                  type="criteria"
                />
              )}
              <div className="btn-wrapper">
                <PlusIcon onClick={showCategoryAdding} />
              </div>
            </ul>
          </div>
        </div>
        {selectedCriteria && (
          <div className="constructor__right">
            <label className="constructor__param-main">
              <div className="constructor__param-title">Параметр</div>
              <div style={{ display: 'flex' }}>
                <Select
                  className="selection"
                  bordered={false}
                  defaultValue="position"
                  dropdownStyle={dropDownStyles}
                  suffixIcon={<ArrowDown />}
                  onChange={(val) => setSelected(val)}
                >
                  <Option value="position">Должность содержит</Option>
                  <Option value="date">Определённая дата</Option>
                  <Option value="work_experience">Стаж</Option>
                  <Option value="department">Отдел</Option>
                  <Option value="random">Случайный выбор</Option>
                  <Option value="gender">Пол</Option>
                </Select>
                <Button className="save-btn" onClick={addNewParam}>
                  Добавить
                </Button>
              </div>
            </label>
            <div className="divider" style={{ margin: '15px 0', height: '3px' }}></div>
            <div style={{ height: '600px', overflow: 'scroll' }}>
              {params.map((param, idx) => (
                <ParameterItem
                  key={param.id || idx}
                  idx={idx}
                  setParams={setParams}
                  item={param}
                  params={params}
                  currentCriteria={currentCriteria}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {loading && <Spinner />}
    </div>
  );
};

export default CriteriaConstructorPage;
