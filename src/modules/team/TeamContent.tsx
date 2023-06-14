import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import TaskContainer from "../task/TaskContainer";
import TeamHeader from "./TeamHeader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setActiveTeam } from "../../app/team/teamSlice";
import { useLocation } from "react-router-dom";
import useTeam from "../../custom-hook/useTeam";

const TeamContent = () => {
  const [value, setValue] = useState("1");
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const url = location.pathname;
  const endpoints = url.split("/");
  const teamId = endpoints[endpoints.length - 1];
  const activeTeam = useTeam(activeTeamId as string)
  useEffect(() => {
    dispatch(setActiveTeam(teamId));
    return () => {
      dispatch(setActiveTeam(null));
    };
  }, [location, dispatch, teamId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {/* project header */}
      <Box p={2} border={"1px #ddd solid"} borderRadius={3}>
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
              {activeTeam?.overview}
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
