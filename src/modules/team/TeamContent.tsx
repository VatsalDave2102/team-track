import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TaskContainer from "../task/TaskContainer";
import TeamHeader from "./TeamHeader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearTeamMembers, setActiveTeam } from "../../app/team/teamSlice";
import { useLocation } from "react-router-dom";
import useTeam from "../../custom-hook/useTeam";
import { fetchMembers } from "../../app/team/teamServices";

const TeamContent = () => {
  const [value, setValue] = useState("2");
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const url = location.pathname;
  const endpoints = url.split("/");
  const teamId = endpoints[endpoints.length - 1];
  const activeTeam = useTeam(activeTeamId as string);
  useEffect(() => {
    const uidArray = [activeTeam?.owner, ...(activeTeam?.members || [])];
    dispatch(setActiveTeam(teamId));
    dispatch(fetchMembers(uidArray as string[]));
    return () => {
      dispatch(setActiveTeam(null));
      dispatch(clearTeamMembers());
    };
  }, [location, dispatch, teamId, activeTeam?.members, activeTeam?.owner]);

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
            <Box>
              <TabList aria-label="Tabs" onChange={handleTabChange}>
                <Tab label="Overview" value="1" />
                <Tab label="Tasks" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ p: 1 }}>
              <Box>
                <Typography
                  variant="h5"
                  color={"GrayText"}
                  textAlign={"center"}
                  sx={{
                    wordWrap: "break-word",
                  }}
                >
                  {activeTeam?.overview}
                </Typography>
              </Box>
            </TabPanel>
            <TabPanel value="2" sx={{ p: 0, pt: 1 }}>
              <TaskContainer />
            </TabPanel>
          </TabContext>
        </Box>
      </Box>
    </>
  );
};

export default TeamContent;
