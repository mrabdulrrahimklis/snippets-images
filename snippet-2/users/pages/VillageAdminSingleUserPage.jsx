import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../../../core/styles/shared/layout";
import { DeleteButton } from "../../../core/styles/shared/villageAdmin/deleteButton";
import { EditExistingUserForm } from "../components/editExistingUserForm";
import { deleteUser, getSingleUser } from "../state/store/usersSlice";

export const VillageAdminSingleUserPage = () => {
  const dispatch = useDispatch();
  const { dorfID, id } = useParams();
  const [showDeleteButton, setShowDeleteButton] = useState(true);

  const page = useSelector((state) => state?.users?.listOfUsersAdmin?.page);
  const limit = useSelector((state) => state?.users?.listOfUsersAdmin?.limit);

  const handleDeleteUser = () => {
    dispatch(
      deleteUser({
        page: page || 1,
        limit: limit || 1,
        id,
        dorfId: dorfID,
      })
    );
  };

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [id]);

  return (
    <Layout isVillageAdmin={true} headerTitle={`Benutzer`} isSinglePage={true}>
      <Box
        bgcolor="background.paper"
        boxShadow="0px 10px 20px rgba(180, 180, 180, 0.4)"
        borderRadius="12px"
        mb={5}
      >
        <EditExistingUserForm
          handleShowDeleteButton={() => setShowDeleteButton(!showDeleteButton)}
        />
      </Box>
      {showDeleteButton && <DeleteButton handleDelete={handleDeleteUser} />}
    </Layout>
  );
};
