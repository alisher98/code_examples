import React, { useState } from 'react';
import 'antd/dist/antd.css';
import '../../styles/componentsStyles/LoginForm.scss';
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/actions/categoriesAction/categoriesAction';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as CompanyLogo } from '../../assets/images/icon/logo.svg';
import { CONTENT_CREATING_PAGE_URL, SECTION_PAGE_URL } from '../../consts/routes';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);

  const login = (e) => {
    e.preventDefault();
    const admin = {
      [e.target[0].name]: e.target[0].value,
      [e.target[1].name]: e.target[1].value,
    };
    dispatch(loginAction(admin))
      .then((res) => {
        if (res.key) {
          navigate(CONTENT_CREATING_PAGE_URL + SECTION_PAGE_URL);
        }
      })
      .catch((e) => {
        toast.error(e.message || 'Ошибка запроса на сервер');
        setLoginError(true);
      });
  };

  return (
    <div className="login__bg">
      <ToastContainer />
      <header className="login__header">
        <CompanyLogo />
      </header>
      <form className="login" onSubmit={login}>
        <h3 className="login__title">Вход в систему</h3>
        <label className="login__username">
          <input
            required
            name="username"
            type="text"
            className={`login__username-input ${loginError && 'error-input'}`}
            placeholder="Логин"
          />
        </label>
        <label className="login__password">
          <input
            required
            name="password"
            type="password"
            className={`login__password-input ${loginError && 'error-input'}`}
            placeholder="Пароль"
          />
        </label>
        <button type="submit" className="login__btn">
          Войти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
