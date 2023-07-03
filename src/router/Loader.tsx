import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  return (
    <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} />
  );
};

export default Loader;
