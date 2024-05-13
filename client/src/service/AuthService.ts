import { IUserLogin, IUserSignUp } from "@/commons/interfaces";
import { api } from "@/lib/axios";
import { AxiosResponse } from 'axios';

const signup = async (user: IUserSignUp): Promise<[AxiosResponse<any, any> | undefined, any | unknown]> => {
  let response, error;
  try {
    response = await api.post("/users", user)
  } catch (err) {
    error = err
  }
  return [response, error]
};


const login = (user: IUserLogin) => {
  return api.post("/login", user);
};

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${JSON.parse(
      token
    )}`;
  }

  return token ? true : false;
};

const logout = () => {
  localStorage.removeItem("token");
};

const AuthService = {
  signup,
  login,
  isAuthenticated,
  logout,
};
export default AuthService;
