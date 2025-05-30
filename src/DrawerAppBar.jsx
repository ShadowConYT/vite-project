import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOutUser } from "./actions/userAction";
// import axios from 'axios';

const drawerWidth = 240;

function DrawerAppBar(props) {
  const dispatch = useDispatch();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { isAuthenticated, access_token, user } = useSelector(
    (state) => state.auth
  ); // Access the token from Redux

  const logOut = () => {
    dispatch(logOutUser());
    // localStorage.removeItem('access_token');
    // delete axios.defaults.headers.common['Authorization'];
    // store.dispatch(logOutRequest());
  };

  const isAdmin = user && user.isAdmin;
  // Dynamically generate nav items based on authentication state
  const navItems = React.useMemo(() => {
    const baseItems = [{ label: "Home", path: "/" }];

    if (isAuthenticated) {
      return [
        ...baseItems,
        { label: "Live Status", path: "/live" },
        { label: "Uploads", path: "/uploads" },
        { label: "Material", path: "/material" },
        { label: "Delivered", path: "/delivered" },
        ...(isAdmin ? [{ label: "Admin Panel", path: "/admin" }] : []), // Show Admin Panel if user is admin
        // { label: 'Logout', path: '/logout' },
      ];
    } else {
      return [
        ...baseItems,
        { label: "Login", path: "/login" },
        { label: "Register", path: "/register" },
      ];
    }
  }, [isAuthenticated, isAdmin]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        GrundFos
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ label, path }) => (
          <ListItem key={label} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              sx={{ textAlign: "center" }}
            >
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem disablePadding>
            <ListItemButton onClick={logOut} sx={{ textAlign: "center" }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav" className="!bg-[#10497a]">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <img
              src="/Grundfos_Logo-White.png"
              alt="Grundfos Logo"
              className="h-10"
            />
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{ color: "#fff" }}
              >
                {label}
              </Button>
            ))}
            {isAuthenticated && (
              <Button onClick={logOut} sx={{ color: "#fff" }}>
                Logout
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {/* Display user information */}
        {isAuthenticated && (
          <Box>
            <Typography variant="h6">
              Welcome, {user && user.username}
            </Typography>
            <Typography variant="body1">Email: {user && user.email}</Typography>
            <Typography variant="body1">
              User ID: {user && user.username}
            </Typography>
            {user && user.isAdmin && (
              <Typography variant="body1">Role: Admin</Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  window: PropTypes.func,
};

export default DrawerAppBar;
