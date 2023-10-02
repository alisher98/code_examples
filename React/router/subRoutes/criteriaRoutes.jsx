import React from 'react';
import CriteriaConstructorPage from '../../pages/CriteriaPages/CriteriaConstructorPage';
import CriteriaAnalyticsPage from '../../pages/CriteriaPages/CriteriaAnalyticsPage';

const criteriaRoutes = [
  {
    path: 'constructor',
    element: <CriteriaConstructorPage />,
  },
  {
    path: 'analytics',
    element: <CriteriaAnalyticsPage />,
  },
];

export default criteriaRoutes;
