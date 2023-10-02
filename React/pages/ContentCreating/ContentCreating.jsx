import React, { useEffect, useState } from 'react';
import ContCreateNav from '../../components/ContCreateNav/ContCreateNav';
import { Outlet } from 'react-router-dom';
// import { useSelector } from 'react-redux';
import {
  ACCESS_PAGE_URL,
  CONTENT_CREATING_PAGE_URL,
  EDITING_PAGE_URL,
  PARAMETER_PAGE_URL,
  PREVIEW_PAGE_URL,
  SECTION_PAGE_URL,
} from '../../consts/routes';
import useCurrentPageExists from '../../hooks/useCurrentPageExists';
import { useSelector } from 'react-redux';

const ContCreating = () => {
  const [editorValue, setEditorValue] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const [checkedWorkers, setCheckedWorkers] = useState([]);
  const [selectedDeps, setSelectedDeps] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const currentPage = useSelector((s) => s.categories.currentPageContent);
  const [sendAll, setSendAll] = useState(currentPage.set_access?.all_users || false);
  const [signature, setSignature] = useState('');
  const [withoutLike, setWithoutLike] = useState(false);
  const [withoutComment, setWithoutComment] = useState(false);
  useEffect(() => {
    if (Object.keys(currentPage).length !== 0) {
      setPageTitle(currentPage.title);
      setEditorValue(currentPage.body);
      setCheckedWorkers(currentPage.set_access?.users || []);
      setSelectedDeps(currentPage.set_access?.departments || []);
      setSelectedCriteria(currentPage.set_access?.criterions || []);
      setSendAll(currentPage.set_access?.all_users || false);
      setSignature(currentPage?.signature?.id || null);
      setWithoutLike(currentPage?.is_like_active || false);
      setWithoutComment(currentPage?.is_comment_active || false);
    }
  }, [currentPage]);
  useCurrentPageExists();
  const navList = [
    {
      text: 'Раздел',
      route: CONTENT_CREATING_PAGE_URL + SECTION_PAGE_URL,
      keyWord: '/content/dep',
    },
    // {
    //   text: 'Редактор',
    //   route: CONTENT_CREATING_PAGE_URL + EDITING_PAGE_URL + `/${id || currentPage.id}`,
    //   keyWord: '/content/create',
    // },
    {
      text: 'Редактор',
      route: CONTENT_CREATING_PAGE_URL + EDITING_PAGE_URL + '/selectPage',
      keyWord: '/content/create',
    },
    {
      text: 'Доступ',
      route: CONTENT_CREATING_PAGE_URL + ACCESS_PAGE_URL,
      keyWord: '/content/access',
    },
    {
      text: 'Параметры',
      route: CONTENT_CREATING_PAGE_URL + PARAMETER_PAGE_URL,
      keyWord: '/content/parameter',
    },
    {
      text: 'Предпросмотр',
      route: CONTENT_CREATING_PAGE_URL + PREVIEW_PAGE_URL,
      keyWord: '/content/preview',
    },
  ];
  return (
    <>
      <ContCreateNav
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        navList={navList}
        pageTitle={pageTitle}
        signature={signature}
        withoutLike={withoutLike}
        withoutComment={withoutComment}
        {...{ selectedCriteria, selectedDeps, checkedWorkers, sendAll }}
      />
      <Outlet
        context={{
          signature: [signature, setSignature],
          withoutLike: [withoutLike, setWithoutLike],
          withoutComment: [withoutComment, setWithoutComment],
          edit: [editorValue, setEditorValue],
          checked: [checkedWorkers, setCheckedWorkers],
          deps: [selectedDeps, setSelectedDeps],
          sections: [selectedSections, setSelectedSections],
          pageTitle: [pageTitle, setPageTitle],
          criteria: [selectedCriteria, setSelectedCriteria],
          all_users: [sendAll, setSendAll],
        }}
      />
    </>
  );
};

export default ContCreating;
