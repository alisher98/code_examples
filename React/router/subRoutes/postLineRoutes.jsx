import React from 'react';
import Posts from '../../pages/PostLine/Posts';
import PostEditingPage from '../../pages/PostLine/PostEditingPage';
import PostAccessPage from '../../pages/PostLine/PostAccessPage';
import PostParametersPage from '../../pages/PostLine/PostParametersPage';
import PostPreviewPage from '../../pages/PostLine/PostPreviewPage';
import {
  POST_ACCESS_PAGE_URL,
  POST_CREATE_PAGE_URL,
  POST_PAGE_URL,
  POST_PARAMS_PAGE_URL,
  POST_PREVIEW_PAGE_URL,
} from '../../consts/routes';

const contentCreatingRoutes = [
  {
    path: POST_PAGE_URL,
    element: <Posts />,
  },
  {
    path: POST_CREATE_PAGE_URL,
    element: <PostEditingPage />,
  },
  {
    path: `${POST_CREATE_PAGE_URL}/:id`,
    element: <PostEditingPage />,
  },
  {
    path: POST_ACCESS_PAGE_URL,
    element: <PostAccessPage />,
  },
  {
    path: POST_PARAMS_PAGE_URL,
    element: <PostParametersPage />,
  },
  {
    path: POST_PREVIEW_PAGE_URL,
    element: <PostPreviewPage />,
  },
];

export default contentCreatingRoutes;
