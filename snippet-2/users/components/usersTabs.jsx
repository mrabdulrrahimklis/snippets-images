import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useCallback, useState } from "react";

const useStyles = makeStyles({
  greenColor: {
    color: "#009e65",
  },
  greyColor: {
    color: "#454545",
  },
});

export const UsersTabs = ({ handleFilter = "" }) => {
  const classes = useStyles();
  const [nameDown, setNameDown] = useState(false);
  const [nameUp, setNameUp] = useState(false);
  const [dateDown, setDateDown] = useState(false);
  const [dateUp, setDateUp] = useState(false);

  const [filter, setFilter] = useState({ orderBy: "", type: "" });

  const handleSort = useCallback(() => {
    handleFilter(filter);
  }, [setNameDown, setNameUp, setDateDown, setDateUp]);

  return (
    <Box display="flex" px={2} py={0.5}>
      <Box>
        <Typography variant="h6">Sortieren:</Typography>
      </Box>
      <Box px={4} display="flex">
        <Typography
          variant="h6"
          className={
            nameDown || nameUp ? classes.greenColor : classes.greyColor
          }
        >
          Name
        </Typography>
        <ArrowDropDownIcon
          sx={{ mr: -1 }}
          className={
            nameDown ? `${classes.greenColor}` : `${classes.greyColor}`
          }
          onClick={() => {
            setNameDown(!nameDown);
            setNameUp(false);

            setFilter({
              orderBy: "descending",
              type: "firstName",
            });

            handleFilter(filter);
          }}
        />
        <ArrowDropUpIcon
          className={nameUp ? `${classes.greenColor}` : `${classes.greyColor}`}
          onClick={() => {
            setNameUp(!nameUp);
            setNameDown(false);

            setFilter({
              orderBy: "ascending",
              type: "firstName",
            });

            handleFilter(filter);
          }}
        />
      </Box>
      <Box display="flex">
        <Typography
          variant="h6"
          className={
            dateDown || dateUp ? classes.greenColor : classes.greyColor
          }
        >
          Anmeldedatum
        </Typography>
        <ArrowDropDownIcon
          className={
            dateDown ? `${classes.greenColor}` : `${classes.greyColor}`
          }
          onClick={() => {
            setDateDown(!dateDown);
            setDateUp(false);

            setFilter({
              orderBy: "ascending",
              type: "date",
            });

            handleFilter(filter);
          }}
          sx={{ mr: -1 }}
        />
        <ArrowDropUpIcon
          className={dateUp ? `${classes.greenColor}` : `${classes.greyColor}`}
          onClick={() => {
            setDateUp(!dateUp);
            setDateDown(false);

            setFilter({
              orderBy: "descending",
              type: "date",
            });

            handleFilter(filter);
          }}
        />
      </Box>
    </Box>
  );
};
