import React from 'react';
import EditorPage from '../../pages/Editor/EditorPage';
import SectionPage from '../../pages/SectionPage/SectionPage';
import AccessPage from '../../pages/Access/AccessPage';
import PreviewPage from '../../pages/Preview/PreviewPage';
import ParameterPage from '../../pages/ParametersPage/ParametersPage';
import EditorSelectPage from '../../pages/EditorSelectPage/EditorSelectPage';
import {
  ACCESS_PAGE_URL,
  EDITING_PAGE_URL,
  PARAMETER_PAGE_URL,
  PREVIEW_PAGE_URL,
  SECTION_PAGE_URL,
} from '../../consts/routes';

const contentCreatingRoutes = [
  {
    path: `${EDITING_PAGE_URL}/:id`,
    element: <EditorPage />,
  },
  {
    path: `${EDITING_PAGE_URL}/selectPage`,
    element: <EditorSelectPage />,
  },
  {
    path: SECTION_PAGE_URL,
    element: <SectionPage />,
  },
  {
    path: ACCESS_PAGE_URL,
    element: <AccessPage />,
  },
  {
    path: PREVIEW_PAGE_URL,
    element: <PreviewPage />,
  },
  {
    path: PARAMETER_PAGE_URL,
    element: <ParameterPage />,
  },
];

export default contentCreatingRoutes;
