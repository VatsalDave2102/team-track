import {
  Avatar,
  Box,
  Button,
  Collapse,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { uploadImage } from "../../../app/auth/authServices";

const UserData = ({
  handleOpen,
  isEditFormOpen,
}: {
  handleOpen: () => void;
  isEditFormOpen: boolean;
}) => {
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const dispatch = useAppDispatch();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image changed");
    if (event.target.files) {
      const file = event.target.files[0];
      console.log(file);
      if (currentUser) {
        dispatch(uploadImage({ file, uid: currentUser?.uid }));
      }
    }
  };
  return (
    <Stack p={2} spacing={2}>
      <Typography variant="h4" color={"primary"} fontWeight={700}>
        My details
      </Typography>
      <Collapse in={!isEditFormOpen}>
        <Stack
          spacing={2}
          alignItems={"stretch"}
          justifyContent={"center"}
          m={"auto"}
          p={2}
        >
          <Stack spacing={1} alignItems={"center"}>
            <label htmlFor="image">
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
          <Box>
            <Typography variant="h6" mb={1} color={"primary"}>
              Bio
            </Typography>
            <Typography variant="body1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor
              reiciendis provident perspiciatis, vel quibusdam laboriosam
              consequuntur dolorem impedit error eos quasi nam in praesentium
              quam earum aliquam corporis ipsum! Hic!
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" mb={1} color={"primary"}>
              Phone number
            </Typography>
            <Typography variant="body1">1234567890</Typography>
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
  );
};

export default UserData;
