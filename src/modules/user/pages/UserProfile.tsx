import { Box, Container } from "@mui/material";
import { Suspense, lazy, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { User } from "../../../utils/types";
import useColorMode from "../../theme/useColorMode";

const UserData = lazy(() => import("../components/UserData"));
const UserEdit = lazy(() => import("../components/UserEdit"));

const UserProfile = () => {
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const { colorMode } = useColorMode();
  const handleEditFormOpen = () => {
    setIsEditFormOpen(true);
  };
  const handleEditFormClose = () => {
    setIsEditFormOpen(false);
  };
  return (
    <Suspense fallback={null}>
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box minHeight={"90vh"}>
          <Box
            bgcolor={colorMode === "dark" ? "#222" : "rgba(240, 212, 187,0.4)"}
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
              currentUser={currentUser as User}
            />
          </Box>
        </Box>
      </Container>
    </Suspense>
  );
};

export default UserProfile;
