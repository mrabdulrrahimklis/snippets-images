import React, { createContext, FC } from "react";
import useToken from "../hooks/useToken";
import { IToken } from "../interfaces/IToken";

export type IAuthContext = {
  token: IToken | null;
  setToken: (token: IToken | null) => void;
};

export type IAuthProvider = {
  children: React.ReactNode;
};

export const AuthContext = createContext<IAuthContext>({
  token: null,
  setToken: (token: IToken | null) => {
    localStorage.setItem("token", JSON.stringify(token));
  },
});

export const AuthProvider: FC<IAuthProvider> = ({ children }) => {
  const { token, setToken } = useToken();

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
