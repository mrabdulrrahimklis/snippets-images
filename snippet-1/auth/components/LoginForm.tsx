import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, IconButton, OutlinedInput } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLogin } from "../hooks/useLogin";
import { GSILogin } from "./GSILogin";

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(true);
  const { mutateAsync: login } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>();

  const submitEmailLogin = handleSubmit((data) => {
    login({
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      grant_type: "password",
      ...data,
    });
  });

  return (
    <form onSubmit={submitEmailLogin}>
      <Box mb="20px">
        <OutlinedInput
          placeholder="Username"
          required
          {...register("username")}
          fullWidth
        />
      </Box>
      <Box mb="20px">
        <OutlinedInput
          placeholder="Password"
          required
          type={!showPassword ? "text" : "password"}
          {...register("password")}
          fullWidth
          endAdornment={
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FontAwesomeIcon size="sm" icon={faEyeSlash} />
              ) : (
                <FontAwesomeIcon size="sm" icon={faEye} />
              )}
            </IconButton>
          }
        />
      </Box>
      <Box mb="20px">
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </Box>
      <Box
        display="flex"
        data-testid="google-login-element"
        justifyContent="space-around"
        mb="20px"
      >
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <GSILogin />
        </GoogleOAuthProvider>
      </Box>
    </form>
  );
};
