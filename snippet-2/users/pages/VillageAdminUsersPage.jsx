import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserAdminCard } from "../../../core/styles/shared/cards/admin/userAdminCard";
import { CustomPagination } from "../../../core/styles/shared/customPagination";
import Layout from "../../../core/styles/shared/layout";
import { CreateNewUserForm } from "../components/createNewUserForm";
import { getUsersAdmin } from "../state/store/usersSlice";

const useStyles = makeStyles({
  greenColor: {
    color: "#009e65",
  },
  greyColor: {
    color: "#454545",
  },
});

export const VillageAdminUsersPage = () => {
  const { dorfID } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [nameDown, setNameDown] = useState(true);
  const [nameUp, setNameUp] = useState(false);
  const [dateDown, setDateDown] = useState(false);
  const [dateUp, setDateUp] = useState(false);

  const [filter, setFilter] = useState({ orderBy: null, type: true });

  const [addPost, setAddPost] = useState(false);

  const handleHeaderButton = () => {
    setAddPost(!addPost);
  };

  useEffect(() => {
    dispatch(
      getUsersAdmin({
        page: 1,
        limit: 10,
        dorfId: dorfID,
        orderBy: filter.orderBy ? filter.orderBy : "firstName",
        type: filter.type === true ? "ascending" : "descending",
      })
    );
  }, [nameDown, nameUp, dateDown, dateUp, filter, setFilter]);

  const [page, setPage] = useState(1);

  const pages = useSelector((state) => state?.users?.listOfUsersAdmin?.pages);

  const totalUsers = useSelector(
    (state) => state?.users?.listOfUsersAdmin?.total
  );

  const adminUsers = useSelector((state) => state?.users?.listOfUsersAdmin);

  const handleChangePage = (event, page) => {
    setPage(page);
    dispatch(
      getUsersAdmin({
        page,
        limit: 10,
        dorfId: dorfID,
        orderBy: filter.orderBy,
        type: filter.type === true ? "ascending" : "descending",
      })
    );
  };

  return (
    <Layout
      isVillageAdmin={true}
      headerTitle={addPost ? `Benutzer erstellen` : `Benutzer`}
      hasAdminsHeaderButton={addPost ? false : true}
      handleHeaderButton={handleHeaderButton}
      isSinglePage={addPost ? true : false}
    >
      <Box
        px={{ xs: 2, nd: 0 }}
        bgcolor={addPost && "background.paper"}
        boxShadow={addPost && "0px 10px 20px rgba(180, 180, 180, 0.4)"}
        borderRadius={addPost && "12px"}
        mb={addPost && 5}
      >
        {addPost ? (
          <CreateNewUserForm handleClose={() => setAddPost(false)} />
        ) : (
          <>
            <Box display="flex" px={2} py={0.5}>
              <Box>
                <Typography variant="h6">Sortieren:</Typography>
              </Box>
              <Box px={4} display="flex">
                <Typography
                  variant="h6"
                  className={
                    nameDown || nameUp ? classes.greenColor : classes.greyColor
                  }
                >
                  Name
                </Typography>
                <ArrowDropDownIcon
                  sx={{ mr: -1 }}
                  className={
                    nameDown ? `${classes.greenColor}` : `${classes.greyColor}`
                  }
                  onClick={() => {
                    setNameDown(true);
                    setNameUp(false);
                    setDateDown(false);
                    setDateUp(false);
                    setFilter({ orderBy: "firstName", type: true });
                  }}
                />
                <ArrowDropUpIcon
                  className={
                    nameUp ? `${classes.greenColor}` : `${classes.greyColor}`
                  }
                  onClick={() => {
                    setNameUp(true);
                    setNameDown(false);
                    setDateDown(false);
                    setDateUp(false);
                    setFilter({ orderBy: "firstName", type: false });
                  }}
                />
              </Box>
              <Box display="flex">
                <Typography
                  variant="h6"
                  className={
                    dateDown || dateUp ? classes.greenColor : classes.greyColor
                  }
                >
                  Anmeldedatum
                </Typography>
                <ArrowDropDownIcon
                  className={
                    dateDown ? `${classes.greenColor}` : `${classes.greyColor}`
                  }
                  onClick={() => {
                    setDateDown(true);
                    setDateUp(false);
                    setNameUp(false);
                    setNameDown(false);
                    setFilter({ orderBy: "date", type: true });
                  }}
                  sx={{ mr: -1 }}
                />
                <ArrowDropUpIcon
                  className={
                    dateUp ? `${classes.greenColor}` : `${classes.greyColor}`
                  }
                  onClick={() => {
                    setDateUp(true);
                    setDateDown(false);
                    setNameUp(false);
                    setNameDown(false);
                    setFilter({ orderBy: "date", type: false });
                  }}
                />
              </Box>
            </Box>

            {adminUsers?.results?.map((item, key) => (
              <UserAdminCard key={key} items={item} page={page} />
            ))}
            {adminUsers?.results?.length !== 0 && (
              <CustomPagination
                page={page}
                pages={pages}
                paginationItems={handleChangePage}
                xsMarginTop={0}
                mdMarginTop={0}
                isVillageAdmin={true}
                total={totalUsers}
              />
            )}
          </>
        )}
      </Box>
    </Layout>
  );
};
