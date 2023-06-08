import { People, PersonAddAlt } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  Stack,
  Tab,
  Typography,
} from "@mui/material";
import { useState } from "react";
import TaskContainer from "./TaskContainer";

const DashBoardContent = () => {
  const [value, setValue] = useState("1");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <Grid container>
      {/* project header */}
      <Grid item xs={12}>
        <Box p={1} border={"1px #ddd solid"} borderRadius={3}>
          <Typography variant="h4" mb={2}>
            Team Title
          </Typography>
          <Stack
            spacing={2}
            mb={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{xs:'start', sm:'center'}}
          >
            <Box display={'flex'} alignItems={'center'}>
              <People />
              <Typography variant="subtitle2" pr={1}>Members</Typography>
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar
                  alt="Trevor Henderson"
                  src="/static/images/avatar/5.jpg"
                />
              </AvatarGroup>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PersonAddAlt />}
              sx={{ borderRadius: "20px" }}
              disableElevation
            >
              Add members
            </Button>
          </Stack>
          <Box>
            <TabContext value={value}>
              <Box sx={{ borderTop: 1, borderColor: "divider" }}>
                <TabList aria-label="Tabs" onChange={handleTabChange}>
                  <Tab label="Overview" value="1" />
                  <Tab label="Tasks" value="2" />
                  <Tab label="Timeline" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1" sx={{ p: 1 }}>
                Overview
              </TabPanel>
              <TabPanel value="2" sx={{ p: 0, pt:2  }}>
                <TaskContainer />
              </TabPanel>
              <TabPanel value="3" sx={{ p: 2 }}>
                Timeline
              </TabPanel>
            </TabContext>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashBoardContent;
