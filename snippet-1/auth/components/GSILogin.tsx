import { useGoogleLogin } from "@react-oauth/google";
import { useLogin } from "../hooks/useLogin";
import IconButton from "@mui/material/IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export const GSILogin = () => {
  const { mutateAsync: login } = useLogin();

  const loginFunc = useGoogleLogin({
    onSuccess: (tokenResponse) => googleLogin(tokenResponse),
  });

  const googleLogin = async (credential: any) => {
    await login({
      grant_type: import.meta.env.VITE_GOOGLE_GRANT_TYPE,
      subject_token_type: import.meta.env.VITE_GOOGLE_SUBJECT_TOKEN,
      client_id: import.meta.env.VITE_CLIENT_ID,
      client_secret: import.meta.env.VITE_CLIENT_SECRET,
      subject_issuer: import.meta.env.VITE_SUBJECT_ISSUER,
      subject_token: credential.access_token,
    });
  };

  return (
    <IconButton onClick={() => loginFunc()}>
      <FontAwesomeIcon icon={faGoogle} />
    </IconButton>
  );
};
