"use client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { Fragment } from "react";

const AlignItemsList = ({ data }) => {

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ my: 2 }}>
        Productos más vendidos
      </Typography>
      <List
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          overflowY: "scroll",
          maxHeight: "340px",
        }}
      >
        {data.map((data) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemAvatar>
                  <Avatar
                    alt={"producto"}
                    title={data.name}
                    src={data.image}
                    variant="rounded"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={data.name}
                  title={data.description}
                  secondary={
                    <Fragment>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        maxHeight={40}
                        sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                      >
                        {data.description}
                      </Typography>
                    </Fragment>
                  }
                  sx={{ flex: 1 }}
                />
                <Typography
                  component="div"
                  variant="subtitle1"
                  color="text.primary"
                  sx={{ paddingLeft: 2, fontWeight: "bold" }}
                >
                  {`Bs ${data.price}`}
                </Typography>
              </ListItem>
              <Divider variant="inset" component="li" />
            </>
          );
        })}
      </List>
    </>
  );
};

export default AlignItemsList;
