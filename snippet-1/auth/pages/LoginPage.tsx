import { Box } from "@mui/material";
import { FC } from "react";
import logo from "../../../assets/manalogocrystal.png";
import { LoginForm } from "../components/LoginForm";

export const LoginPage: FC = () => (
  <Box
    width="400px"
    m="auto"
    display="flex"
    alignContent="center"
    alignItems="center"
    height="100vh"
  >
    <Box mb="120px">
      <Box mb="20px">
        <img data-testid="logo-element" src={logo} alt="logo" width="100%" />
      </Box>
      <LoginForm />
    </Box>
  </Box>
);
