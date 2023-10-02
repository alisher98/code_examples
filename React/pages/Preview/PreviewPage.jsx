import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { ConfigProvider, DatePicker, Select, Tabs, TimePicker } from 'antd';
import { ReactComponent as ArrowDown } from '../../assets/images/icon/contentCreateIcons/arrow-down-icon.svg';
import { dropDownStyles } from '../../styles/pageStyles/AntCustomStyles';
import { useSelector } from 'react-redux';
import { ReactComponent as Clock } from '../../assets/images/icon/parameters/clock.svg';
import { ReactComponent as Calendar } from '../../assets/images/icon/parameters/calendar.svg';
import AllowTag from '../../components/Tag/AllowTag';
import Switcher from '../../components/Switch/Switch';
import TagContainer from '../../components/TagContainer/TagContainer';
import InDeveloping from '../../components/InDeveloping/InDeveloping';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import moment from 'moment';
import 'moment/locale/ru';

const allowDep = [{ title: 'Сотрудники' }, { title: 'Отделы' }, { title: 'Критерии' }];

const PreviewPage = () => {
  const { TabPane } = Tabs;
  const { Option } = Select;
  const format = 'HH:mm';
  const currentPage = useSelector((s) => s.categories.currentPageContent);
  const {
    checked: [checkedWorkers, setCheckedWorkers],
    deps: [selectedDeps, setSelectedDeps],
    criteria: [selectedCriteria, setSelectedCriteria],
    sections: [selectedSections, setSelectedSections],
  } = useOutletContext();
  const removeWorkersFromAllowList = (name, type, id) => {
    if (type === 'worker') {
      setCheckedWorkers(checkedWorkers.filter((el) => el.id !== id));
    }
    if (type === 'department') {
      setSelectedDeps(selectedDeps.filter((el) => el.id !== id));
    }
    if (type === 'criteria') {
      setSelectedCriteria(selectedCriteria.filter((el) => el.id !== id));
    }
  };
  const removeSectionsFromAllowList = (name, type, id) => {
    if (type === 'page') {
      setSelectedSections(selectedSections.filter((el) => el.id !== id));
    }
  };
  return (
    <ConfigProvider locale={ruRU}>
      <div className="preview">
        <h3 className="preview__title">
          Предпросмотр <InDeveloping />
        </h3>
        <div className="preview__block">
          <div className="preview__block-message">
            <Tabs className="preview__block-message__tab" defaultActiveKey="1" animated={false}>
              <TabPane tab="Сообщение" key="1">
                <div className="preview__block-message__tab-wrapper ql-editor">
                  <div dangerouslySetInnerHTML={{ __html: currentPage.body }} />
                </div>
              </TabPane>
              <TabPane tab="Превью" key="2">
                <div className="preview__block-message__tab-wrapper"></div>
              </TabPane>
              <TabPane tab="Пуш" key="3">
                <div className="preview__block-message__tab-wrapper"></div>
              </TabPane>
            </Tabs>
          </div>
          <div className="preview__block-setting">
            <div className="preview__block-setting__wrapper">
              <h5 className="preview__block-setting__title top-title">Выбранные разделы</h5>
              <div className="preview__block-setting__deps">
                {selectedSections.map((tag, idx) => (
                  <AllowTag
                    key={idx}
                    idx={idx}
                    tag={tag.title}
                    id={tag.id}
                    removeItemFromAllowList={removeSectionsFromAllowList}
                    type="page"
                  />
                ))}
              </div>
            </div>
            <div className="preview__block-setting__wrapper">
              <h5 className="preview__block-setting__title">От имени</h5>
              <Select
                className="parameters__block-name__select"
                bordered={false}
                defaultValue="Команда ФСК 1"
                dropdownStyle={dropDownStyles}
                suffixIcon={<ArrowDown />}
              >
                <Option value="jack1">Команда ФСК 2</Option>
                <Option value="jack2">Команда ФСК 3</Option>
              </Select>
            </div>
            <div className="preview__block-setting__wrapper">
              <h5 className="preview__block-setting__title">Периодичность</h5>
              <Select
                className="parameters__block-name__select"
                bordered={false}
                defaultValue="Единоразово"
                dropdownStyle={dropDownStyles}
                suffixIcon={<ArrowDown />}
              >
                <Option value="jack1">Единоразово</Option>
                <Option value="jack2">Единоразово</Option>
              </Select>
            </div>
            <div className="preview__block-setting__wrapper">
              <h5 className="preview__block-setting__title">Дата публикации</h5>
              <div className="time-wrapper">
                <TimePicker
                  className="preview__block-setting__time"
                  defaultValue={moment('10:00', format)}
                  format={format}
                  suffixIcon={<Clock />}
                />
                <DatePicker className="preview__block-setting__date" suffixIcon={<Calendar />} />
              </div>
              <Switcher title="Тревожить во время совещания" />
              <Switcher title="Уведомлять руководителя" />
            </div>
            <div className="preview__block-setting__wrapper">
              <h5 className="preview__block-setting__title">Выбранные получатели</h5>
              <TagContainer
                allowDep={allowDep}
                removeItemFromAllowList={removeWorkersFromAllowList}
                checkedWorkers={checkedWorkers}
                selectedDeps={selectedDeps}
                selectedCriteria={selectedCriteria}
              />
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default PreviewPage;
