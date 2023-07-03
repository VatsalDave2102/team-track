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
interface AutoCompleteFieldProps {
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void;
  mode: "team-create" | "team-edit" | "task-assign";
  fieldName: string;
  existingValue?: TeamMemberData[];
}
const AutoCompleteField: React.FC<AutoCompleteFieldProps> = ({
  setFieldValue,
  mode,
  fieldName,
  existingValue,
}) => {
  const [searchResults, setSearchResults] = useState<TeamMemberData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // local state to store selected values
  const [selectedValue, setSelectedValue] = useState<TeamMemberData[]>(
    existingValue || []
  );
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const activeTeamId = useAppSelector((state) => state.root.team.activeTeam);
  const activeTeam = useTeam(activeTeamId as string);

  // function to handle search
  const handleSearch = debounce(async (searchQuery: string) => {
    try {
      // not searching for empty string
      if (searchQuery.length > 0) {
        const results: TeamMemberData[] = [];
        setIsLoading(true);

        // getting users collection reference
        const usersRef = collection(db, "users");

        // finding user from collection
        const q = query(
          usersRef,
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
        );
        const querySnaphot = await getDocs(q);

        // for team create mode
        if (mode == "team-create") {
          //  setting results that doesn't contain the current user
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

        // for team edit mode
        if (mode == "team-edit") {
          const querySnaphot = await getDocs(q);
          // setting results such that it is not current user and not in team already
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

        // for task assign mode
        if (mode == "task-assign") {
          const querySnaphot = await getDocs(q);

          // setting results such that it is not current user and is in team
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

  // function to handle change, when user selects from option in autocomplete or removes anyone
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
