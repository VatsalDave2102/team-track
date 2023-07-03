import { useAppSelector } from "../app/hooks";

const useTeam = (teamId: string) => {
  const teamList = useAppSelector((state) => state.root.team.teamList);

  // finding team data using id of team
  const team = teamList.find((team) => team.id === teamId);

  // returning team data
  return team;
};

export default useTeam;
