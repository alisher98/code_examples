import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import ContCreateNav from '../../components/ContCreateNav/ContCreateNav';
import {
  SETTING_REF_PAGE,
  SETTING_PAGE_URL,
  SETTING_TAGS_PAGE,
  SETTING_SIGNATURES_PAGE,
} from '../../consts/routes';

const SettingNav = () => {
  const currentSettingCriteria = useSelector((s) => s.settings.currentCriteriaPage);
  const [params, setParams] = useState([]);
  const [file, setFile] = useState(null);
  const [specialist, setSpecialist] = useState(false);
  const navigate = useNavigate();
  const navList = [
    {
      text: 'Справки',
      route: SETTING_PAGE_URL + SETTING_REF_PAGE,
      keyWord: '/settings/references',
    },
    {
      text: 'Тэги',
      route: SETTING_PAGE_URL + SETTING_TAGS_PAGE,
      keyWord: '/settings/tags',
    },
    {
      text: 'Подписи',
      route: SETTING_PAGE_URL + SETTING_SIGNATURES_PAGE,
      keyWord: '/settings/signatures',
    },
  ];
  useEffect(() => {
    navigate(SETTING_PAGE_URL + SETTING_REF_PAGE);
  }, []);

  useEffect(() => {
    setSpecialist(currentSettingCriteria?.is_prepared_specialist);
  }, [currentSettingCriteria]);

  const setInputFile = (e) => {
    setFile(e?.target?.files[0]);
  };

  return (
    <div className="settings">
      <ContCreateNav navList={navList} params={params} file={file} specialist={specialist} />
      <Outlet
        context={{
          paramsSet: [params, setParams],
          fileSet: [file, setInputFile],
          specialist: [specialist, setSpecialist],
        }}
      />
    </div>
  );
};

export default SettingNav;
