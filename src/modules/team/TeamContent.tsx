import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import TaskContainer from "../task/TaskContainer";
import TeamHeader from "./TeamHeader";

const TeamContent = () => {
  const [value, setValue] = useState("1");
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  return (
    <>
      {/* project header */}
        <Box p={1} border={"1px #ddd solid"} borderRadius={3}>
          <TeamHeader />
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
              <TabPanel value="2" sx={{ p: 0, pt: 2 }}>
                <TaskContainer />
              </TabPanel>
              <TabPanel value="3" sx={{ p: 2 }}>
                Timeline
              </TabPanel>
            </TabContext>
          </Box>
        </Box>
    </>
  );
};

export default TeamContent;
