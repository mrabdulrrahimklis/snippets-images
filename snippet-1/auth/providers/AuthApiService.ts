import { apiService } from "../../../core/api/services/apiService";
import { tokenApiService } from "../../../core/api/token/TokenApiService";
import { tokenService } from "../../../core/api/token/TokenService";
import { ROUTES } from "../../../core/const/Routes";
import { clearLocalStorage } from "../../../core/utils";

class AuthApiService {
  async login(credentials: any): Promise<any> {
    const loginResponse: any = apiService.responseHandler(
      await apiService.post<any>("/login", credentials)
    );

    return loginResponse;
  }

  async refresh(): Promise<any> {
    const userRefreshToken = tokenService.token?.refresh_token;

    return tokenApiService
      .refreshToken(userRefreshToken)
      .then((token) => {
        tokenService.token = token;

        return token;
      })
      .catch(() => {
        clearLocalStorage();
        window.location.href = ROUTES.LOGIN;
      });
  }
}

export const authApiService = new AuthApiService();
