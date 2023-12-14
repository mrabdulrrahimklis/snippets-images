import { yupResolver } from "@hookform/resolvers/yup";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { checkPublicPagesType } from "../../../core/helpers/checkPublicPagesType";
import { newPathGenerator } from "../../../core/helpers/pathGenerator";
import { useDebounce } from "../../../core/hooks/useDebounce";
import { apiService } from "../../../core/services/apiService";
import { CloseButton } from "../../../core/styles/custom/CloseButton";
import { EditProfilePictureBox } from "../../../core/styles/custom/EditProfilePictureBox";
import { SaveButton } from "../../../core/styles/custom/SaveButton";
import { SingleSchoolAdminCard } from "../../../core/styles/shared/cards/admin/singleSchoolAdminCard";
import { CustomEditButton } from "../../../core/styles/shared/customEditButton";
import { CustomTextField } from "../../../core/styles/shared/customTextField";
import {
  updateUserProfileImage,
  updateUserProfileImageByDorfAdmin,
} from "../../login/state/store/loginSlice";
import { editUser, getSingleUser } from "../state/store/usersSlice";
import { GenerateNewPassword } from "./generateNewPassword";

const useStyles = makeStyles({
  generatePassword: {
    height: "56px",
    borderRadius: "5px",
    background: "#f2f2f2",
    boxShadow: "none",
    color: "#454545",
    "&:hover": {
      background: "#454545",
      color: "#f2f2f2",
    },
  },
  input: {
    height: "36px",
    borderRadius: "12px",
    color: "#fff",
  },
  listBox: {
    margin: 0,
    padding: 0,
    "& .MuiAutocomplete-option": {
      padding: "4px 8px",
      "&:nth-child(1)": {
        paddingTop: "8px",
      },
      "&:nth-last-child(1)": {
        paddingBottom: "8px",
      },
    },
  },
  paper: {
    boxShadow: "0px 10px 20px #B4B4B466;",
  },
  searchHeader: {
    "& label.Mui-focused": {
      color: "#b4b4b4",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#b4b4b4",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#b4b4b4",
      },
      "&:hover fieldset": {
        borderColor: "#b4b4b4",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#b4b4b4",
      },
    },
  },
});

const EditExistingUserSchema = yup.object().shape({
  firstName: yup.string().required("Dieses Feld muss ausgefüllt sein."),
  lastName: yup.string().required("Dieses Feld muss ausgefüllt sein."),
});

export const EditExistingUserForm = ({
  userData,
  handleShowDeleteButton,
  isSuperAdmin = false,
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const { id, dorfID } = useParams();

  const [isAddOpen, setIsAddOpen] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [showAutoComplete, setShowAutoComplete] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      apiService
        .get(`/village-public_pages/${dorfID}?title=${searchTerm}`)
        .then(({ data }) => {
          setIsSearching(false);

          setResults(data);
        });
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  const [generatePassword, setGeneratePassword] = useState(false);

  const singleUser = useSelector((state) => state.users?.singleUser);

  const {
    publicPages,
    email,
    lastName,
    firstName,
    phone,
    profileImage,
    currentProfile,
  } = singleUser || {};

  useEffect(() => {
    if (debouncedSearchTerm) {
      apiService
        .get(`/village-public_pages/${dorfID}?title=${searchTerm}`)
        .then(({ data }) => {
          setIsSearching(false);

          setResults(data);
        });
    } else {
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const {
    handleSubmit,
    reset,
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(EditExistingUserSchema),
    defaultValues: useMemo(() => {
      return {
        firstName,
        lastName,
        email,
        phone,
        publicPages,
      };
    }, [firstName, lastName, email, phone, publicPages]),
  });

  useEffect(() => {
    reset({
      firstName,
      lastName,
      email,
      phone,
      publicPages,
    });
  }, [firstName, lastName, email, phone, publicPages]);

  const onSubmitEditExistingUser = async (data) => {
    const values = getValues();
    const { firstName, lastName, email, phone } = values;

    dispatch(editUser({ formData: values, id }));
    reset();
    navigate(-1);
  };

  const addAdminOnPublicPage = (e, publicPageId) => {
    apiService
      .put(`/public-page/set-admins/${publicPageId.id}`, {
        admins: [id],
      })
      .then(() => {
        dispatch(getSingleUser(id));
      });
  };

  const deletePublicPageAdmin = (publicPageId) => {
    apiService
      .delete(`/public-page/delete-admins/${publicPageId._id}/${id}`)
      .then(() => {
        dispatch(getSingleUser(id));
      });
  };

  useEffect(() => {
    if (selectedProfileImage) {
      setProfileImageUrl(URL.createObjectURL(selectedProfileImage));
    } else {
      setProfileImageUrl(userData?.profileImage?.url);
    }
  }, [selectedProfileImage, userData]);

  const handleGeneratePassword = () => {
    apiService.post("/auth/reset-password", { email: email });
    setGeneratePassword(false);
    handleShowDeleteButton();
  };

  const editPublicPage = (item) => {
    isSuperAdmin
      ? navigate(
          newPathGenerator(
            `/superadmin/village/dorfinfo/:dorfID/${checkPublicPagesType(
              item.pageType
            )}/:id`,
            {
              dorfID,
              id: item._id,
            }
          )
        )
      : navigate(
          newPathGenerator(
            `/admin/dorfinfo/${checkPublicPagesType(
              item.pageType
            )}/:dorfID/:id`,
            {
              dorfID,
              id: item._id,
            }
          )
        );
  };

  return (
    <>
      {generatePassword ? (
        <GenerateNewPassword
          close={() => {
            setGeneratePassword(false);
            handleShowDeleteButton();
          }}
          handleGeneratePassword={handleGeneratePassword}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmitEditExistingUser)}>
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
                    onChange(e.target.files[0]);
                    const formData = new FormData();
                    formData.append("profileImage", e.target.files[0]);
                    if (currentProfile?.role !== "DorfAdmin") {
                      dispatch(
                        updateUserProfileImageByDorfAdmin({
                          id,
                          formData,
                        })
                      );
                    }
                    if (currentProfile?.role === "DorfAdmin") {
                      dispatch(updateUserProfileImage(formData));
                    }

                    // dispatch(updateUserProfileImage(formData));
                    setSelectedProfileImage(e.target.files[0]);
                  }}
                />
              )}
            />
            <label htmlFor="profileImage">
              <Button
                sx={{
                  background:
                    profileImageUrl && selectedProfileImage
                      ? `url(${profileImageUrl}) no-repeat center, linear-gradient(#565656, #565656)`
                      : profileImage
                      ? `url(${profileImage?.url}) no-repeat center, linear-gradient(#565656, #565656)`
                      : "#565656",
                  backgroundSize: "cover",
                  height: 130,
                  width: 130,
                  borderRadius: "50%",
                  "&:hover": {
                    background:
                      profileImageUrl && selectedProfileImage
                        ? `url(${profileImageUrl}) no-repeat center, linear-gradient(#565656, #565656)`
                        : profileImage
                        ? `url(${profileImage?.url}) no-repeat center, linear-gradient(#565656, #565656)`
                        : "#565656",
                    backgroundSize: "cover",
                  },
                }}
                component="span"
              >
                {!profileImage?.url && firstName && lastName && (
                  <Typography variant="h1" fontWeight="bold" color="white">
                    {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
                  </Typography>
                )}
                <EditProfilePictureBox>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="white"
                  >
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
          <Box display="flex" alignItems="center" px={2}>
            <Box width="95%">
              <CustomTextField
                control={control}
                label="E-mail"
                htmlFor="email"
                error={Boolean(errors.email)}
                name="email"
                isBearbVisible={false}
                id="email"
                helperText={errors?.email?.message}
                px={0}
                inputProps={register("email")}
                disabled={true}
              />
            </Box>
            <IconButton disableRipple href={`mailto:${email}`}>
              <EmailOutlinedIcon sx={{ color: "#454545" }} />
            </IconButton>
          </Box>
          <CustomTextField
            control={control}
            label="Telefon"
            htmlFor="phone"
            error={Boolean(errors.phone)}
            name="phone"
            isBearbVisible={false}
            id="phone"
            pt={0}
            helperText={errors?.phone?.message}
            inputProps={register("phone")}
          />
          <Box
            display="flex"
            alignItems="center"
            mr={2}
            justifyContent="space-between"
            mb={4}
          >
            <Box width="83%">
              <CustomEditButton isAdminEditUserPage={true} label={`Passwort`} />
            </Box>
            <Button
              variant="contained"
              className={classes.generatePassword}
              onClick={() => {
                setGeneratePassword(true);
                handleShowDeleteButton();
              }}
            >
              Neu generieren
            </Button>
          </Box>
          <Box
            borderTop={1}
            borderColor="primary.light"
            mx={2}
            mt={1}
            mb={2.5}
            pt={3}
          >
            <Box pl={2} pb={3}>
              <Typography variant="h5" fontWeight="bold">
                Nutzer verwaltet:
              </Typography>
            </Box>
            {publicPages && publicPages?.length ? (
              publicPages?.map((item, index) => (
                <Fragment key={index}>
                  <SingleSchoolAdminCard
                    hasGreenColor={true}
                    id={item._id}
                    hasCloseIcon={true}
                    letters={
                      item?.title
                        ? item?.title[0].toUpperCase()
                        : item?.name
                        ? item?.name[0].toUpperCase()
                        : ""
                    }
                    user={{ name: item?.title }}
                    email={item?.email}
                    deleteAdmin={() => deletePublicPageAdmin(item)}
                    edit={() => editPublicPage(item)}
                  />
                </Fragment>
              ))
            ) : (
              <></>
            )}

            {!showAutoComplete ? (
              <Box
                minHeight={72}
                bgcolor="background.default"
                borderRadius="12px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                onClick={() => setShowAutoComplete(true)}
                sx={{ cursor: "pointer" }}
              >
                <IconButton disableRipple>
                  <AddOutlinedIcon sx={{ color: "#454545" }} />
                </IconButton>
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                width="100%"
                borderRadius="12px"
                bgcolor="text.disabled"
                height={36}
              >
                <Autocomplete
                  fullWidth
                  freeSolo
                  getOptionLabel={(option) => option?.title}
                  options={results.map((resultItem, key) => {
                    return {
                      id: resultItem._id,
                      label: `${resultItem.title}`,
                      title: resultItem?.title,
                      letters: resultItem?.title
                        ? resultItem?.title[0].toUpperCase()
                        : resultItem?.name
                        ? resultItem?.name[0].toUpperCase()
                        : "",
                      key,
                    };
                  })}
                  onChange={(e, obj) => {
                    addAdminOnPublicPage(e, obj);
                  }}
                  classes={{
                    listbox: classes.listBox,
                    paper: classes.paper,
                  }}
                  disableClearable
                  renderOption={(props, option) => (
                    <Box {...props} width="100%" padding="0">
                      {/* {JSON.stringify(option, null, 2)} */}
                      <SingleSchoolAdminCard
                        hasGreenColor={true}
                        hasCloseIcon={false}
                        hasEmailIcon={true}
                        isAutocomplete={true}
                        id={option._id}
                        letters={
                          option?.title
                            ? option?.title[0].toUpperCase()
                            : option?.name
                            ? option?.name[0].toUpperCase()
                            : ""
                        }
                        user={{
                          name: option?.title,
                        }}
                        email={option?.email}
                      />
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      className={classes.searchHeader}
                      {...params}
                      placeholder="Search"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            sx={{
                              color: "#fff",
                            }}
                          >
                            <SearchIcon />
                          </InputAdornment>
                        ),
                        className: classes.input,
                      }}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  )}
                />
              </Box>
            )}
          </Box>
          <Box display="flex">
            <CloseButton
              onClick={() => navigate(-1)}
              sx={{ borderRadius: "0px 0px 0px 12px" }}
            >
              Abbrechen
            </CloseButton>
            <SaveButton type="submit" sx={{ borderRadius: "0px 0px 12px 0px" }}>
              Speichern
            </SaveButton>
          </Box>
        </form>
      )}
    </>
  );
};
