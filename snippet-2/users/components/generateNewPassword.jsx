import { Box, Typography } from "@mui/material";
import { CloseButton } from "../../../core/styles/custom/CloseButton";
import { SaveButton } from "../../../core/styles/custom/SaveButton";

export const GenerateNewPassword = ({ close, handleGeneratePassword }) => {
  return (
    <>
      <Box
        minHeight="300px"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box display="flex" justifyContent="center" maxWidth="400px">
          <Typography variant="h3" fontWeight="bold" textAlign="center">
            Möchtest Du für diesen Benutzer ein neues Passwort generieren
            lassen?
          </Typography>
        </Box>
      </Box>
      <Box display="flex">
        <CloseButton onClick={close} sx={{ borderRadius: "0px 0px 0px 12px" }}>
          Abbrechen
        </CloseButton>
        <SaveButton
          onClick={handleGeneratePassword}
          type="submit"
          sx={{ borderRadius: "0px 0px 12px 0px" }}
        >
          Neu generieren
        </SaveButton>
      </Box>
    </>
  );
};
