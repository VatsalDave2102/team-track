import {
  CalendarViewDayRounded,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Group,
} from "@mui/icons-material";
import { useAppSelector } from "../../../app/hooks";
import { CustomListItem } from "../../../utils/types";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

const NavList = () => {
  const currentUserTeams = useAppSelector((state) => state.root.team.teamList);

  // sidebar items to navigate
  const items: CustomListItem[] = [
    {
      info: { label: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
    },
    {
      info: { label: "Teams", link: "", icon: <Group /> },
      children: [],
    },
  ];

  // adding total teams to Team label
  currentUserTeams.map((team) => {
    items[1].children?.push({
      label: team.teamName,
      link: `/dashboard/teams/${team.id}`,
      icon: <CalendarViewDayRounded />,
    });
  });

  const [open, setOpen] = useState(true);
  const location = useLocation();

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <List>
      {items.map((item) =>
        // if list item has children then render children also
        item.children ? (
          <React.Fragment key={`${item.info.label}`}>
            {/* Item button */}
            <ListItemButton
              key={item.info.label}
              sx={{ borderRadius: "20px" }}
              onClick={handleClick}
            >
              {/* Item */}
              <ListItem>
                {/* Item icon */}
                <ListItemIcon>{item.info.icon}</ListItemIcon>
                {/* Item text */}
                <ListItemText primary={item.info.label} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </ListItemButton>

            <Collapse in={open} timeout={"auto"} unmountOnExit>
              <List>
                {/* Children of above item */}
                {item.children?.map((childItem) => (
                  // Item button
                  <ListItemButton
                    key={childItem.label}
                    // making it selected using location pathaname
                    selected={location.pathname === `${childItem.link}`}
                    component={Link}
                    to={childItem.link}
                    sx={{ borderRadius: "20px", pl: 5 }}
                  >
                    {/* Child Item icon */}
                    <ListItemIcon>{childItem.icon}</ListItemIcon>
                    {/* Child Item tect */}
                    <ListItemText primary={childItem.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ) : (
          // else render item without children
          <ListItemButton
            key={item.info.label}
            selected={location.pathname === `/dashboard`}
            component={Link}
            to={item.info.link}
            sx={{ borderRadius: "20px" }}
          >
            {/* item */}
            <ListItem>
              {/* icon */}
              <ListItemIcon>{item.info.icon}</ListItemIcon>
              {/* text */}
              <ListItemText primary={item.info.label} />
            </ListItem>
          </ListItemButton>
        )
      )}
    </List>
  );
};

export default NavList;
