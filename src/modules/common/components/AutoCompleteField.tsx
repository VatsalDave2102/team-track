import {
  Autocomplete,
  CircularProgress,
  TextField,
  debounce,
} from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";
import { TeamMemberData } from "../../../utils/types";
import useTeam from "../../../custom-hook/useTeam";

const AutoCompleteField = ({
  setFieldValue,
  mode,
  fieldName,
  value,
}: {
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
  mode: "team-create" | "team-edit" | "task-assign";
  fieldName: string;
  value?: TeamMemberData[];
}) => {
  const [searchResults, setSearchResults] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);

  const handleSearch = debounce(async (searchQuery) => {
    try {
      setIsLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", ">=", searchQuery));
      const results: TeamMemberData[] = [];

      if (mode == "team-create") {
        const querySnaphot = await getDocs(q);

        querySnaphot.forEach((doc) => {
          if (currentUser?.email !== doc.data().email)
            results.push({ name: doc.data().name, email: doc.data().email });
        });
        setSearchResults(results);
        setIsLoading(false);
      }
      if (mode == "team-edit") {
        const querySnaphot = await getDocs(q);
        querySnaphot.forEach((doc) => {
          if (
            currentUser?.email !== doc.data().email &&
            !value?.some((member) => member.email === doc.data().email)
          )
            results.push({ name: doc.data().name, email: doc.data().email });
        });
        setSearchResults(results);
        setIsLoading(false);
      }
      if (mode == "task-assign") {
        activeTeam?.members.forEach((member) => {
          results.push({ name: member.name, email: member.email });
        });
        setSearchResults(results);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error");
    }
  }, 300);

  const handleChange = (value: TeamMemberData[]) => {
    const selectedUsers = value.map((user) => user);
    setFieldValue(fieldName, selectedUsers);
  };
  return (
    <Autocomplete
      multiple
      isOptionEqualToValue={(option, value) => option.email === value.email}
      options={searchResults}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => handleChange(value)}
      onInputChange={(event, value) => handleSearch(value)}
      value={value}
      renderInput={(params) => (
        <TextField
          {...params}
          name="members"
          label="Search to add members"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {isLoading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default AutoCompleteField;
