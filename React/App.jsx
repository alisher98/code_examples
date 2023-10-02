import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import adminRoutes from './router/privateRoutes';
import './index.scss';
import contentCreatingRoutes from './router/subRoutes/contentCreatingRoutes';
import postLineRoutes from './router/subRoutes/postLineRoutes';
import Header from './components/Header/Header';
import {
  CONTENT_CREATING_PAGE_URL,
  CRITERIA_CONSTRUCTOR_PAGE_URL,
  LOGIN_PAGE_URL,
  POST_LINE_PAGE_URL,
  SECTION_PAGE_URL,
  SETTING_PAGE_URL,
} from './consts/routes';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from './redux/actions/categoriesAction/categoriesAction';
import useTokenExists from './hooks/useTokenExists';
import criteriaRoutes from './router/subRoutes/criteriaRoutes';
import settingsRoutes from './router/subRoutes/settingsRoutes';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.categories.user);
  useTokenExists();
  useEffect(() => {
    if (!Object.keys(user).length && localStorage.getItem('token')) {
      dispatch(getUser());
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate(LOGIN_PAGE_URL);
    } else if (token && [LOGIN_PAGE_URL, '/'].indexOf(location.pathname) !== -1) {
      navigate(CONTENT_CREATING_PAGE_URL + SECTION_PAGE_URL);
    }
  }, [navigate]);

  return (
    <div className="App">
      <div className="mailing">
        <div className="container">
          <Header />
          <Routes>
            {adminRoutes.map((route) => (
              <Route exact path={route.path} element={route.element} key={route.path}>
                {route.path === CONTENT_CREATING_PAGE_URL
                  ? contentCreatingRoutes.map((subRoute, idx) => (
                      <Route exact path={subRoute.path} element={subRoute.element} key={idx} />
                    ))
                  : route.path === POST_LINE_PAGE_URL
                  ? postLineRoutes.map((subRoute, idx) => (
                      <Route exact path={subRoute.path} element={subRoute.element} key={idx} />
                    ))
                  : route.path === CRITERIA_CONSTRUCTOR_PAGE_URL
                  ? criteriaRoutes.map((subRoute, idx) => (
                      <Route exact path={subRoute.path} element={subRoute.element} key={idx} />
                    ))
                  : route.path === SETTING_PAGE_URL
                  ? settingsRoutes.map((subRoute, idx) => (
                      <Route exact path={subRoute.path} element={subRoute.element} key={idx} />
                    ))
                  : null}
              </Route>
            ))}
          </Routes>
          <ToastContainer />
        </div>
      </div>
    </div>
  );
};

export default App;
