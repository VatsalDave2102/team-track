import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Skeleton, Tab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import TaskContainer from "../task/TaskContainer";
import TeamHeader from "./TeamHeader";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearTeamMembers, setActiveTeam } from "../../app/team/teamSlice";
import { useParams } from "react-router-dom";
import useTeam from "../../custom-hook/useTeam";
import { fetchMembers } from "../../app/team/teamServices";
import NoTeamExist from "./NoTeamExist";

const TeamContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("2");
  const [teamExists, setTeamExists] = useState(true);
  const teamList = useAppSelector((state) => state.root.team.teamList);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const { teamId } = useParams();
  const dispatch = useAppDispatch();

  const activeTeam = useTeam(activeTeamId as string);
  useEffect(() => {
    const uidArray = [activeTeam?.owner, ...(activeTeam?.members || [])];
    dispatch(setActiveTeam(teamId));
    dispatch(fetchMembers(uidArray as string[]));

    return () => {
      dispatch(setActiveTeam(null));
      dispatch(clearTeamMembers());
    };
  }, [dispatch, teamId, activeTeam?.members, activeTeam?.owner, teamList]);

  useEffect(() => {
    if (teamList.length === 0) {
      setIsLoading(true);
    }
    if (teamList.length > 0) {
      setIsLoading(false);
      const teamIndex = teamList.findIndex((team) => team.id === teamId);

      if (teamIndex === -1) {
        setTeamExists(false);
      }
    }
  }, [teamId, teamList]);
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  if (isLoading) {
    return (
      <Box border={"1px #ddd solid"} borderRadius={3}>
        <Skeleton width={"100%"} height={200} />
      </Box>
    );
  }
  return (
    <>
      {/* project header */}
      <Box p={2} border={"1px #ddd solid"} borderRadius={3}>
        {teamExists ? (
          <>
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
          </>
        ) : (
          <NoTeamExist />
        )}
      </Box>
    </>
  );
};

export default TeamContent;
