import { Autocomplete, TextField, debounce } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { TeamMemberData } from "../../utils/types";

const AutoCompleteField = ({
  setFieldValue,
}: {
  setFieldValue: (field: string, value: unknown, shouldValidate?: boolean) => void;
}) => {
  const [searchResults, setSearchResults] = useState<TeamMemberData[]>([]);
  const currentUser = useAppSelector((state) => state.root.auth.user);
  const handleSearch = debounce(async (searchQuery) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", ">=", searchQuery));
      const querySnaphot = await getDocs(q);

      const results: TeamMemberData[] = [];
      querySnaphot.forEach((doc) => {
        if (currentUser?.email !== doc.data().email)
          results.push({ name: doc.data().name, email: doc.data().email });
      });
      setSearchResults(results);
    } catch (error) {
      console.log("Error");
    }
  }, 300);

  const handleChange = (value: TeamMemberData[]) => {
    const selectedUsers = value.map((user) => user);
    setFieldValue("members", selectedUsers);
  };
  return (
    <Autocomplete
      multiple
      fullWidth
      isOptionEqualToValue={(option, value) => option.email === value.email}
      options={searchResults}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) => handleChange(value)}
      onInputChange={(event, value) => handleSearch(value)}
      renderInput={(params) => (
        <TextField {...params} name="members" label="Search to add members" />
      )}
    />
  );
};

export default AutoCompleteField;
