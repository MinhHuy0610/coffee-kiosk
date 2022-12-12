import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
export default function HomeScreen(props) {
  const styles = useStyles();
  const handleClickLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("shopId");
    window.location.reload();
  };
  return (
    <Card>
      <CardActionArea onClick={() => props.history.push('/order')}>
        {/* <Box className={[styles.root, styles.red]}>
          <Box className={[styles.main, styles.center]}>
            <Typography variant="h6" component="h6">
              Fast & Easy
            </Typography>
            <Typography variant="h1" component="h1" className={styles.bold}>
              Order <br />
              & pay
              <br />
              here
            </Typography>
            <TouchAppIcon fontSize="large"></TouchAppIcon>
          </Box>
          <Box className={[styles.center, styles.green]}>
            <Logo large /> */}
        <Typography variant="h5" component="h5" className={styles.footer}>
          Chạm để bắt đầu
        </Typography>
        {/* </Box>
        </Box> */}
      </CardActionArea>
      <CardActionArea onClick={handleClickLogout}>
        <Typography variant="h5" component="h5" className={styles.footer}>
          Thoát
        </Typography>
      </CardActionArea>
    </Card>
  );
}
