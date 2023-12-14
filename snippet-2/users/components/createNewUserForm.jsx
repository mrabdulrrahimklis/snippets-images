import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Input, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { newPathGenerator } from "../../../core/helpers/pathGenerator";
import { ROUTES } from "../../../core/navigation/routes.enum";
import { CloseButton } from "../../../core/styles/custom/CloseButton";
import { EditProfilePictureBox } from "../../../core/styles/custom/EditProfilePictureBox";
import { SaveButton } from "../../../core/styles/custom/SaveButton";
import { CustomTextField } from "../../../core/styles/shared/customTextField";
import {
  getRegister,
  getRegisterUser,
} from "../../login/state/store/registrationSlice";

const createNewUserSchema = yup.object().shape({
  email: yup
    .string()
    .email("Sie müssen eine gültige E-Mail eingeben!")
    .required("Dieses Feld muss ausgefüllt sein."),
  password: yup
    .string()
    .required("Dieses Feld muss ausgefüllt sein.")
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein!"),
  firstName: yup.string().required("Dieses Feld muss ausgefüllt sein."),
  lastName: yup.string().required("Dieses Feld muss ausgefüllt sein."),
});

export const CreateNewUserForm = ({
  userData,
  handleClose,
  isSuperAdmin = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dorfID } = useParams();

  const page = useSelector((state) => state?.users?.listOfUsersAdmin?.page);

  const limit = useSelector((state) => state?.users?.listOfUsersAdmin?.limit);

  const [fileImage, setFileImage] = useState([]);
  const [image, setImage] = useState([]);

  const {
    handleSubmit,
    reset,
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createNewUserSchema),
    defaultValues: {
      profileImage: [],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmitCreateNewUser = async () => {
    setValue("profileImage", image);
    const values = getValues();
    const { profileImage, firstName, lastName, email, phone, password } =
      values;

    const formData = new FormData();
    formData.append("role", "User");
    formData.append("dorfName", "Bischleben Stedten");
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("password2", password);
    formData.append("profileImage", profileImage);

    // await dispatch(
    //   getRegister({
    //     formData,
    //     page,
    //     limit,
    //     dorfId: dorfID,
    //     orderBy: "date",
    //     type: "descending",
    //     isVillageAdmin: true,
    //   })
    // );

    await dispatch(
      getRegisterUser({
        formData,
        page,
        limit,
        dorfId: dorfID,
        orderBy: "date",
        type: "descending",
        isVillageAdmin: true,
      })
    );

    isSuperAdmin
      ? navigate(newPathGenerator(ROUTES.SUPER_ADMIN_VILLAGE_USERS, { dorfID }))
      : navigate(newPathGenerator(ROUTES.VILLAGE_ADMIN_USERS, { dorfID }));
    handleClose();
    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitCreateNewUser)}>
        <Box display="flex" justifyContent="center" py={5}>
          <Controller
            name="profileImage"
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                id="profileImage"
                type="file"
                style={{ display: "none" }}
                {...register("profileImage")}
                onChange={(e) => {
                  setFileImage(URL.createObjectURL(e.target.files[0]));
                  setImage(e.target.files[0]);
                }}
              />
            )}
          />
          <label htmlFor="profileImage">
            <Button
              sx={{
                background:
                  fileImage && image
                    ? `url(${fileImage}) no-repeat center, linear-gradient(#565656, #565656)`
                    : "#565656",
                backgroundSize: "cover",
                height: 130,
                width: 130,
                borderRadius: "50%",
                "&:hover": {
                  background:
                    fileImage && image
                      ? `url(${fileImage}) no-repeat center, linear-gradient(#565656, #565656)`
                      : "#565656",
                  backgroundSize: "cover",
                },
              }}
              component="span"
            >
              <AddPhotoAlternateOutlinedIcon
                sx={{ color: "white", marginBottom: 2 }}
              />
              <EditProfilePictureBox>
                <Typography variant="subtitle1" fontWeight="bold" color="white">
                  Bearb.
                </Typography>
              </EditProfilePictureBox>
            </Button>
          </label>
        </Box>
        <CustomTextField
          control={control}
          label="Vorname"
          htmlFor="firstName"
          error={Boolean(errors.firstName)}
          name="firstName"
          isBearbVisible={false}
          id="firstName"
          helperText={errors?.firstName?.message}
          pb={0}
          inputProps={register("firstName")}
        />
        <CustomTextField
          control={control}
          label="Nachname"
          htmlFor="lastName"
          error={Boolean(errors.lastName)}
          name="lastName"
          isBearbVisible={false}
          id="lastName"
          helperText={errors?.lastName?.message}
          pb={0}
          inputProps={register("lastName")}
        />
        <CustomTextField
          control={control}
          label="E-mail"
          htmlFor="email"
          error={Boolean(errors.email)}
          name="email"
          isBearbVisible={false}
          id="email"
          helperText={errors?.email?.message}
          pb={0}
          inputProps={register("email")}
        />
        <CustomTextField
          control={control}
          label="Telefon"
          htmlFor="phone"
          error={Boolean(errors.phone)}
          name="phone"
          isBearbVisible={false}
          id="phone"
          helperText={errors?.phone?.message}
          pb={0}
          inputProps={register("phone")}
        />
        <CustomTextField
          control={control}
          label="Passwort"
          htmlFor="password"
          isPasswordField={true}
          error={Boolean(errors.password)}
          name="password"
          isBearbVisible={true}
          id="password"
          helperText={errors?.password?.message}
          inputProps={register("password")}
        />
        <Box display="flex">
          <CloseButton
            onClick={handleClose}
            sx={{ borderRadius: "0px 0px 0px 12px" }}
          >
            Abbrechen
          </CloseButton>
          <SaveButton type="submit" sx={{ borderRadius: "0px 0px 12px 0px" }}>
            Speichern
          </SaveButton>
        </Box>
      </form>
    </>
  );
};
