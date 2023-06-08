import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

interface CustomListProps {
  items: { label: string; link: string; icon: JSX.Element }[];
}

const CustomList: React.FC<CustomListProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const handleListItemClick = (label: string) => {
    setSelectedIndex(label);
  };
  return (
    <List>
      {items.map((item, index) => (
        <ListItemButton
          key={index}
          selected={selectedIndex === item.label}
          onClick={() => handleListItemClick(item.label)}
          component={Link}
          to={item.link}
          sx={{ borderRadius: "20px", p: 0 }}
        >
          <ListItem>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        </ListItemButton>
      ))}
    </List>
  );
};

export default CustomList;
