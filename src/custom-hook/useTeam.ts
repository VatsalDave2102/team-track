import { useAppSelector } from "../app/hooks"

const useTeam = (teamId:string) => {
    const teamList = useAppSelector(state=> state.root.team.teamList)
    const team = teamList.find((team)=> team.id === teamId)
    return team
}

export default useTeam