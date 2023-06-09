import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  Group,
  Star,
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

const items: CustomListItem[] = [
  {
    info: { label: "Dashboard", link: "/dashboard", icon: <Dashboard /> },
  },
  {
    info: { label: "Teams", link: "", icon: <Group /> },
    children: [{ label: "Project1", link: "teams/1", icon: <Star /> }],
  },
];
const Sidebar = () => {
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
            item.children.map((childItem, childIndex) => (
              <React.Fragment key={`${item.info.label}-${childIndex}`}>
                <ListItemButton
                  key={item.info.label}
                  sx={{ borderRadius: "20px", p: 0 }}
                  onClick={handleClick}
                >
                  <ListItem>
                    <ListItemIcon sx={{ display: { xs: "none", md: "block" } }}>
                      {item.info.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.info.label} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                </ListItemButton>
                <Collapse in={open} timeout={"auto"} unmountOnExit>
                  <List>
                    <ListItemButton
                      key={childItem.label}
                      selected={
                        location.pathname === `/dashboard/${childItem.link}`
                      }
                      component={Link}
                      to={childItem.link}
                      sx={{ borderRadius: "20px", p: 0, pl: 3 }}
                    >
                      <ListItemIcon>{childItem.icon}</ListItemIcon>
                      <ListItemText primary={childItem.label} />
                    </ListItemButton>
                  </List>
                </Collapse>
              </React.Fragment>
            ))
          ) : (
            <ListItemButton
              key={item.info.label}
              selected={location.pathname === `/dashboard`}
              component={Link}
              to={item.info.link}
              sx={{ borderRadius: "20px", p: 0 }}
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
