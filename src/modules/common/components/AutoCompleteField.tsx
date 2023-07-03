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
  existingValue,
}: {
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
  mode: "team-create" | "team-edit" | "task-assign";
  fieldName: string;
  existingValue?: TeamMemberData[];
}) => {
  const [searchResults, setSearchResults] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<TeamMemberData[]>(
    existingValue || []
  );
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);

  const handleSearch = debounce(async (searchQuery: string) => {
    try {
      if (searchQuery.length > 0) {
        const results: TeamMemberData[] = [];
        setIsLoading(true);
        const usersRef = collection(db, "users");
        const q = query(
          usersRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
        );
        const querySnaphot = await getDocs(q);

        if (mode == "team-create") {
          querySnaphot.forEach((doc) => {
            if (currentUser?.email !== doc.data().email)
              results.push({
                name: doc.data().name,
                email: doc.data().email,
                uid: doc.data().uid,
              });
          });

          setSearchResults(results);
          setIsLoading(false);
        }
        if (mode == "team-edit") {
          const querySnaphot = await getDocs(q);
          querySnaphot.forEach((doc) => {
            if (
              currentUser?.email !== doc.data().email &&
              !existingValue?.some(
                (member) => member.email === doc.data().email
              )
            )
              results.push({
                name: doc.data().name,
                email: doc.data().email,
                uid: doc.data().uid,
              });
          });

          setSearchResults(results);
          setIsLoading(false);
        }
        if (mode == "task-assign") {
          const querySnaphot = await getDocs(q);
          querySnaphot.forEach((doc) => {
            if (
              currentUser?.email === doc.data().email ||
              activeTeam?.members.some((member) => member == doc.data().uid)
            ) {
              results.push({
                name: doc.data().name,
                email: doc.data().email,
                uid: doc.data().uid,
              });
            }
          });

          setSearchResults(results);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Error");
    }
  }, 300);

  const handleChange = (value: TeamMemberData[]) => {
    setSelectedValue(value);
    const selectedUsers = value.map((user) => user.uid);
    setFieldValue(fieldName, selectedUsers);
  };

  return (
    <Autocomplete
      multiple
      isOptionEqualToValue={(option, value) => option.email === value.email}
      options={searchResults}
      getOptionLabel={(option) => option.name}
      value={selectedValue}
      onChange={(_event, value) => handleChange(value)}
      onInputChange={(_event, value) => handleSearch(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          name="members"
          label="Search members"
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
