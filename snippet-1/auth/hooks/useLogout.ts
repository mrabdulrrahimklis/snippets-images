import { useNavigate } from "react-router";
import { tokenService } from "../../../core/api/token/TokenService";
import { ROUTES } from "../../../core/const/Routes";

interface IUseLogout {
  logout: () => void;
}

export const useLogout = (): IUseLogout => {
  const navigate = useNavigate();

  const logout = () => {
    tokenService.clear();
    navigate(ROUTES.LOGIN);
  };

  return {
    logout,
  };
};
