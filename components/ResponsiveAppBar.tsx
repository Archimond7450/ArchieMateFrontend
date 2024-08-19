import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "next/link";
import HomeIcon from "@mui/icons-material/Home";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { useGlobalState } from "../context/GlobalStateContext";
import Cookies from "js-cookie";
import User from "../DTOs/User";
import useSWR, { Fetcher } from "swr";

interface LinkType {
  icon: JSX.Element;
  text: string;
  href: string;
  cy: string;
}

const iconStyles = {
  position: "relative",
  marginRight: 1,
  top: "6px",
};

const pages: LinkType[] = [
  {
    icon: <HomeIcon sx={iconStyles} />,
    text: "Home",
    href: "/",
    cy: "appbar-home",
  },
  {
    icon: <ArticleIcon sx={iconStyles} />,
    text: "Docs",
    href: "/docs",
    cy: "appbar-docs",
  },
];
const loggedSettings: LinkType[] = [
  {
    icon: <DashboardIcon sx={iconStyles} />,
    text: "Dashboard",
    href: "/dashboard",
    cy: "appbar-dashboard",
  },
  {
    icon: <LogoutIcon sx={iconStyles} />,
    text: "Logout",
    href: "/logout",
    cy: "appbar-logout",
  },
];

type ResponsiveAppBarState =
  | {
      loading: true;
    }
  | {
      loading: false;
      user?: User;
    };

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const { setState } = useGlobalState();
  const [appBarState, setAppBarState] = React.useState<ResponsiveAppBarState>({
    loading: true,
  });

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const fetcher: Fetcher<User, string> = async (url: string) => {
    const cookie = Cookies.get("sessionId");
    if (!cookie) {
      throw new Error("No sessionId found");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: cookie,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return (await response.json()) as User;
  };

  const { data: user, error } = useSWR<User, Error>(
    "/api/v1/twitch/user",
    fetcher,
    {
      shouldRetryOnError: false,
    }
  );

  React.useEffect(() => {
    if (user && !error) {
      setState((prevState) => ({
        ...prevState,
        loggedUser: user,
      }));
    }
    setAppBarState({
      loading: false,
      user: user,
    });
  }, [error, user, setState]);

  const elementWithTestCy = (element: JSX.Element, cy: string): JSX.Element => {
    return React.cloneElement(element, {
      "data-testid": cy,
    });
  };

  const loggedOutMenu = !appBarState.loading &&
    appBarState.user === undefined && (
      <MenuItem onClick={handleCloseNavMenu}>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          href="/login"
          passHref
        >
          <Typography
            sx={{
              my: 2,
              display: "block",
              width: "100%",
            }}
          >
            <LoginIcon sx={iconStyles} data-testid="appbar-login" />
            Login
          </Typography>
        </Link>
      </MenuItem>
    );

  const loggedInMenu = !appBarState.loading &&
    appBarState.user !== undefined && (
      <React.Fragment>
        <Tooltip title="User menu">
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
            <Avatar
              data-testid="avatar"
              alt={appBarState.user?.displayName}
              src={appBarState.user?.profileImageURL}
            />
          </IconButton>
        </Tooltip>
        <Menu
          sx={{ mt: "45px" }}
          id="menu-appbar"
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
        >
          {loggedSettings.map((setting) => (
            <MenuItem key={setting.href} onClick={handleCloseUserMenu}>
              <Link
                style={{ textDecoration: "none", color: "black" }}
                href={setting.href}
                passHref
              >
                <Typography
                  sx={{
                    my: 2,
                    display: "block",
                    width: "100%",
                  }}
                >
                  {elementWithTestCy(setting.icon, setting.cy)}
                  {setting.text}
                </Typography>
              </Link>
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );

  return (
    <React.Fragment>
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
            <Link
              href="/"
              passHref
              data-testid="appbar-logo"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                }}
              >
                Archie|Mate
              </Typography>
            </Link>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                data-testid="nav-menu-icon"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {
                  // Map mobile friendly menu
                  pages.map((page) => (
                    <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                      <Link
                        style={{ color: "black", textDecoration: "none" }}
                        href={page.href}
                        passHref
                      >
                        <Typography
                          sx={{
                            display: "block",
                            width: "100%",
                          }}
                        >
                          {elementWithTestCy(page.icon, `${page.cy}-mobile`)}
                          {page.text}
                        </Typography>
                      </Link>
                    </MenuItem>
                  ))
                }
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
            <Link
              style={{ color: "white", textDecoration: "none" }}
              href="/"
              passHref
              data-testid="appbar-logo-mobile"
            >
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                }}
              >
                Archie|Mate
              </Typography>
            </Link>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {
                // Map normal menu
                pages.map((page) => (
                  <MenuItem key={page.href} onClick={handleCloseNavMenu}>
                    <Link
                      style={{ color: "white", textDecoration: "none" }}
                      href={page.href}
                      passHref
                    >
                      <Typography
                        sx={{
                          my: 2,
                          display: "block",
                          width: "100%",
                        }}
                      >
                        {elementWithTestCy(page.icon, page.cy)}
                        {page.text}
                      </Typography>
                    </Link>
                  </MenuItem>
                ))
              }
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              {loggedOutMenu}
              {loggedInMenu}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
};

export default ResponsiveAppBar;
