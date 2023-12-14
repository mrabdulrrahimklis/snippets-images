import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { tokenService } from "../../../core/api/token/TokenService";
import { ROUTES } from "../../../core/const/Routes";
import { ToastContext } from "../../../core/providers/ToastContext";
import { authApiService } from "../providers/AuthApiService";

export const useLogin = (): any => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  return useMutation(authApiService.login, {
    onSuccess: (data) => {
      tokenService.token = data;
      navigate(ROUTES.HOME);
    },
    onError: (err: any) => {
      toast.open(`${err.message}.`, {
        severity: "error",
      });
    },
  });
};

export const useRefreshToken = (): any => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);

  return useMutation(authApiService.refresh, {
    onSuccess: (data) => {
      navigate(ROUTES.HOME);
    },
    onError: (err: any) => {
      toast.open(`${err.message}.`, {
        severity: "error",
      });
    },
  });
};
