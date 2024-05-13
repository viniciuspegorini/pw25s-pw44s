import React, { ChangeEvent, useState } from 'react'
import { IUserLogin } from '@/commons/interfaces'
import { ButtonWithProgress } from '@/components/ButtonWithProgress'
import AuthService from '@/service/AuthService'
import { Input } from '@/components/Input'
import { Link, useNavigate } from 'react-router-dom'
import './style.scss'

export function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  })

  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);

  const [apiError, setApiError] = useState('')  
  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target;
    setForm((previousForm) => {
      return {
        ...previousForm,
        [name]: value,
      };
    });
    if (form.username === "" || form.password === "") {
      setDisableSubmit(true);
    } else {
      setDisableSubmit(false);
    }
    setApiError('');
  };

  const onClickLogin = () => {
    setPendingApiCall(true);

    const userLogin: IUserLogin = {
      username: form.username,
      password: form.password,
    };
    AuthService.login(userLogin)
      .then((response) => {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setPendingApiCall(false);
        navigate("/home");
      })
      .catch((errorResponse) => {
        setApiError('Falha ao autenticar no sistema, verifique os dados informados')
        setPendingApiCall(false)
      })
  }

  return (
    <>
      <main className="form-signin w-100 m-auto">
        <form>
          <div className="text-center">
            <h1 className="h3 mb-3 fw-normal">Autenticação</h1>
          </div>
          <div className="form-floating">
            <Input
              label="Usuário"
              className="form-control"
              type="text"
              placeholder="username"
              value={form.username}
              onChange={onChange}
              name="username"
              hasError={false}
              error=""
            />
          </div>
          <div className="form-floating">
            <Input
              label="Senha"
              className="form-control"
              type="password"
              placeholder="Your password"
              value={form.password}
              onChange={onChange}
              name="password"
              hasError={false}
              error=""
            />
          </div>

          <div className="checkbox mb-3">
            <label>
              <input type="checkbox" value="remember-me" /> Lembrar
            </label>
          </div>
          {apiError && (
            <div className="col-12 mb-3">
              <div className="alert alert-danger">{apiError}</div>
            </div>
          )}
          <ButtonWithProgress
            className="w-100 btn btn-lg btn-primary mb-3"
            onClick={onClickLogin}
            disabled={pendingApiCall || disableSubmit}
            text="Autenticar"
            pendingApiCall={pendingApiCall}
          />
          <div className="text-center">
            Não possui cadastro? <br />
            <Link className="link-primary" to="/signup">
              Cadastrar-se
            </Link>
          </div>

          <p className="mt-5 mb-3 text-muted">UTFPR &copy; 2010–2024</p>
        </form>
      </main>
    </>
  );
}
