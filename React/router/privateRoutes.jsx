import React from 'react';
import NewsletterViewPage from '../pages/NewsletterViewPage/NewsletterViewPage';
import LoginForm from '../pages/LoginForm/LoginForm';
import ContCreating from '../pages/ContentCreating/ContentCreating';
import PostLine from '../pages/PostLine/PostLine';
import {
  CONTENT_CREATING_PAGE_URL,
  CRITERIA_CONSTRUCTOR_PAGE_URL,
  LOGIN_PAGE_URL,
  NEWSLETTER_PAGE_URL,
  POST_LINE_PAGE_URL,
  SETTING_PAGE_URL,
  PAGE_NOT_FOUND,
} from '../consts/routes';
import PageNotFound from '../pages/PageNotFound/PageNotFound';
import CriteriaPage from '../pages/CriteriaPages/CriteriaPage';
import SettingNav from '../pages/SettingPage/SettingNav';

const privateRoutes = [
  {
    path: POST_LINE_PAGE_URL,
    element: <PostLine />,
  },
  {
    path: CONTENT_CREATING_PAGE_URL,
    element: <ContCreating />,
  },
  {
    path: NEWSLETTER_PAGE_URL,
    element: <NewsletterViewPage />,
  },
  {
    path: CRITERIA_CONSTRUCTOR_PAGE_URL,
    element: <CriteriaPage />,
  },
  {
    path: SETTING_PAGE_URL,
    element: <SettingNav />,
  },
  {
    path: LOGIN_PAGE_URL,
    element: <LoginForm />,
  },
  {
    path: PAGE_NOT_FOUND,
    element: <PageNotFound />,
  },
];

export default privateRoutes;
