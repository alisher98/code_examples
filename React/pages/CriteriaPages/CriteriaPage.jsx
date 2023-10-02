import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import ContCreateNav from '../../components/ContCreateNav/ContCreateNav';
import { ANALYTICS_URL, CONSTRUCTOR_URL, CRITERIA_CONSTRUCTOR_PAGE_URL } from '../../consts/routes';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CriteriaPage = () => {
  const [params, setParams] = useState([]);
  const currentCriteria = useSelector((s) => s.criteria.currentCriteria);
  useEffect(() => {
    if (currentCriteria.criterions && currentCriteria.criterions.length) {
      setParams(currentCriteria.criterions.map((item, i) => ({ ...item, id: Date.now() - i })));
    } else {
      setParams([]);
    }
  }, [currentCriteria]);
  const navList = [
    {
      text: 'Конструктор критериев',
      route: CRITERIA_CONSTRUCTOR_PAGE_URL + CONSTRUCTOR_URL,
      keyWord: '/criteria/constructor',
    },
    {
      text: 'Анализ критериев',
      route: CRITERIA_CONSTRUCTOR_PAGE_URL + ANALYTICS_URL,
      keyWord: '/criteria/analytics',
    },
  ];
  return (
    <div className="criteria">
      <ContCreateNav navList={navList} params={params} setParams={setParams} />
      <Outlet context={{ paramSet: [params, setParams] }} />
    </div>
  );
};

export default CriteriaPage;
