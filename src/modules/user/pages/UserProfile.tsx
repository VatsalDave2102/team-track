import { Box, Container } from "@mui/material";
import UserData from "../components/UserData";
import { useState } from "react";
import UserEdit from "../components/UserEdit";

const UserProfile = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const handleEditFormOpen = () => {
    setIsEditFormOpen(true);
  };
  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };
  return (
    <>
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box minHeight={"90vh"}>
          <Box
            bgcolor={"rgba(240, 212, 187,0.4)"}
            borderRadius={"50%"}
            sx={{
              position: "absolute",
              top: "-300px",
              width: "95%",
              height: { xs: "420px", sm: "470px", md: "500px" },
              zIndex: "-10",
            }}
          />
          <Box>
            <UserData
              handleOpen={handleEditFormOpen}
              isEditFormOpen={isEditFormOpen}
            />
          </Box>
          <Box>
            <UserEdit
              handleClose={handleEditFormClose}
              isEditFormOpen={isEditFormOpen}
            />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default UserProfile;
