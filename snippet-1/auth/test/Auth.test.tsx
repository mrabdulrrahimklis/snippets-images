import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { apiService } from "../../../core/api/services/apiService";
import { LoginPage } from "../pages/LoginPage";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const LOGIN_CREDENTIALS = {
  client_id: "mana-admin-shop-client",
  client_secret: "tcVWGqDsIyBvxmQgW8Pm7Qvmn7gqtyDp",
  grant_type: "password",
  username: "emmanuel@mana.app",
  password: "mana@Strong10",
};

export const loginRequest = async (requestData: any) => {
  return await apiService.post("/login", requestData);
};

export const loginPageSetup = () => {
  const loginPage = render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
  const username = loginPage.container.querySelector(`input[name="username"]`);
  const password = loginPage.container.querySelector(`input[name="password"]`);
  const submitButton = loginPage.container.querySelector('[type="submit"]');

  if (
    !(username instanceof HTMLInputElement) ||
    !(password instanceof HTMLInputElement) ||
    !(submitButton instanceof HTMLButtonElement)
  ) {
    throw new Error("Issue during test setup.");
  }

  return { username, password, submitButton };
};

describe("Test visibility of each component in Login Page: ", () => {
  beforeEach(() => {
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </QueryClientProvider>
    );
  });

  it("should have Logo ", () => {
    expect(screen.getByTestId("logo-element")).toBeInTheDocument();
  });

  it("should have Email Input Field ", () => {
    const { username } = loginPageSetup();

    expect(username).toBeInTheDocument();
  });

  it("should have Password Input Field ", () => {
    const { password } = loginPageSetup();

    expect(password).toBeInTheDocument();
  });

  it("should have Form Submit Button", () => {
    const { submitButton } = loginPageSetup();

    expect(submitButton).toBeInTheDocument();
  });

  it("should get access_token and refresh_token: ", async () => {
    const { status } = await loginRequest(LOGIN_CREDENTIALS);

    expect(status).toBe(201);
  });
});
