import React from 'react';
import { SETTING_REF_PAGE, SETTING_SIGNATURES_PAGE, SETTING_TAGS_PAGE } from '../../consts/routes';
import SettingPage from '../../pages/SettingPage/SettingPage';
import SettingTagsPage from '../../pages/SettingPage/SettingTagsPage';
import SettingSignaturesPage from '../../pages/SettingPage/SettingSignaturesPage';
const settingsRoutes = [
  {
    path: SETTING_REF_PAGE,
    element: <SettingPage />,
  },
  {
    path: SETTING_TAGS_PAGE,
    element: <SettingTagsPage />,
  },
  {
    path: SETTING_SIGNATURES_PAGE,
    element: <SettingSignaturesPage />,
  },
];

export default settingsRoutes;
