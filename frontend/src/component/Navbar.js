import {
  AppBar,
  Toolbar,
  Box,
  Link,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "transparent  !important"
  },
  toolBar: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  root: {
    flexGrow: 1,
  },
  menuToolLink: {
    marginRight: theme.spacing(2),
  },
  title: {
    color: theme.palette.text.primary,
  },
}));

const LinkButton = (props) => (
  <Link 
    {...props}
    variant="body1"
    underline="none"
    sx={{ 
      color: "#006699",
      fontWeight: "bold",
      "&:hover": {
        opacity: 0.8
      },
      padding: "5px 15px",
      margin: "0 5px",
      ...props.sx,
    }} />
);

const Container = (props) => (
  <Box sx={{ justifyContent: "flex-end", display: "flex", ...props.sx, flex: 1 }} {...props} />
);

const Navbar = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();

  const handleClick = (location) => {
    console.log(location);
    navigate(location);
  };

  const recruiterToolBar = () => (
    <Container>
      <LinkButton onClick={() => handleClick("/home")}>
        Trang chủ
      </LinkButton>
      <LinkButton onClick={() => handleClick("/addjob")}>
        Thêm
      </LinkButton>
      <LinkButton onClick={() => handleClick("/myjobs")}>
        Việc làm của tôi
      </LinkButton>
      <LinkButton onClick={() => handleClick("/employees")}>
        Ứng viên
      </LinkButton>
      <LinkButton onClick={() => handleClick("/profile")}>
        Hồ sơ
      </LinkButton>
      <LinkButton onClick={() => handleClick("/logout")}>
        Đăng xuất
      </LinkButton>
    </Container>
  );

  const applicantToolBar = () => (
    <Container>
      <LinkButton onClick={() => handleClick("/home")}>
        Trang chủ
      </LinkButton>
      <LinkButton onClick={() => handleClick("/applications")}>
        Ứng tuyển
      </LinkButton>
      <LinkButton onClick={() => handleClick("/profile")}>
        Hồ sơ
      </LinkButton>
      <LinkButton onClick={() => handleClick("/logout")}>
        Đăng xuất
      </LinkButton>
    </Container>
  );

  const publicToolBar = () => (
    <Container>
      <LinkButton onClick={() => handleClick("/login")}>Đăng nhập</LinkButton>
      <LinkButton 
        sx={{
          color: "white",
          backgroundColor: "#006699",
          borderRadius: "5px",
        }}
        onClick={() => handleClick("/signup")}>Đăng ký</LinkButton>
    </Container>
  );

  return (
    <AppBar position="static" elevation={0} className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        <Container />
        <img src="logo.png" width={150} />
        {isAuth() ? (
          userType() === "recruiter" ? recruiterToolBar() : applicantToolBar()
        ) : publicToolBar()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
