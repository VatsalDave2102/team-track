import {
  CalendarViewDayRounded,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Group,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { CustomListItem } from "../../../utils/types";
import React, { useState } from "react";
import { useAppSelector } from "../../../app/hooks";

const Sidebar = () => {
  const currentUserTeams = useAppSelector((state) => state.root.team.teamList);
  const items: CustomListItem[] = [
    {
      info: { label: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
    },
    {
      info: { label: "Teams", link: "", icon: <Group /> },
      children: [],
    },
  ];
  currentUserTeams.map((team) => {
    items[1].children?.push({
      label: team.teamName,
      link: `teams/${team.id}`,
      icon: <CalendarViewDayRounded />,
    });
  });

  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Box border={"1px #ddd solid"} borderRadius={3} height={"85vh"}>
      <List>
        {items.map((item) =>
          item.children ? (
            <React.Fragment key={`${item.info.label}`}>
              <ListItemButton
                key={item.info.label}
                sx={{ borderRadius: "20px" }}
                onClick={handleClick}
              >
                <ListItem>
                  <ListItemIcon>{item.info.icon}</ListItemIcon>
                  <ListItemText primary={item.info.label} />
                  {open ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
              </ListItemButton>

              <Collapse in={open} timeout={"auto"} unmountOnExit>
                <List>
                  {item.children?.map((childItem) => (
                    <ListItemButton
                      key={childItem.label}
                      selected={
                        location.pathname === `/dashboard/${childItem.link}`
                      }
                      component={Link}
                      to={childItem.link}
                      sx={{ borderRadius: "20px", pl: 5 }}
                    >
                      <ListItemIcon>{childItem.icon}</ListItemIcon>
                      <ListItemText primary={childItem.label} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </React.Fragment>
          ) : (
            <ListItemButton
              key={item.info.label}
              selected={location.pathname === `/dashboard`}
              component={Link}
              to={item.info.link}
              sx={{ borderRadius: "20px" }}
            >
              <ListItem>
                <ListItemIcon>{item.info.icon}</ListItemIcon>
                <ListItemText primary={item.info.label} />
              </ListItem>
            </ListItemButton>
          )
        )}
      </List>
    </Box>
  );
};

export default Sidebar;
