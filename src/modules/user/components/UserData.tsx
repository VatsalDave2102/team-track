import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { uploadImage } from "../../../app/auth/authServices";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const UserData = ({
  handleOpen,
  isEditFormOpen,
}: {
  handleOpen: () => void;
  isEditFormOpen: boolean;
}) => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (currentUser) {
        dispatch(uploadImage({ file, uid: currentUser?.uid }));
      }
    }
  };
  return (
    <Stack p={2} spacing={2}>
      <Stack direction={"row"} spacing={2}>
        <IconButton color="primary" onClick={handleBackClick}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" color={"primary"} fontWeight={700}>
          My details
        </Typography>
      </Stack>
      <Stack
        spacing={2}
        alignItems={"stretch"}
        justifyContent={"center"}
        m={"auto"}
        p={2}
      >
        <Stack spacing={1} alignItems={"center"}>
          <label
            htmlFor="image"
            style={{ cursor: "pointer", borderRadius: "50%" }}
          >
            <Avatar
              sx={{
                width: { xs: 60, sm: 90, md: 150 },
                height: { xs: 60, sm: 90, md: 150 },
              }}
              alt={currentUser?.name}
              src={currentUser?.profileImage}
            />
          </label>
          <input
            type="file"
            id="image"
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
            onChange={handleImageChange}
          />
          <Box>
            <Typography variant="h6" textAlign={"center"}>
              {currentUser?.name}
            </Typography>
            <Typography variant="h6" textAlign={"center"}>
              {currentUser?.email}
            </Typography>
          </Box>
        </Stack>
        <Collapse in={!isEditFormOpen}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" mb={1} color={"primary"}>
                Bio
              </Typography>
              <Typography variant="body1">{currentUser?.bio}</Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="h6" mb={1} color={"primary"}>
                Phone number
              </Typography>
              <Typography variant="body1">{currentUser?.phone}</Typography>
            </Box>
            <Divider />
            <Box display={"flex"} justifyContent={"flex-end"}>
              <Button variant="contained" onClick={handleOpen}>
                Edit details
              </Button>
            </Box>
          </Stack>
        </Collapse>
      </Stack>
    </Stack>
  );
};

export default UserData;
