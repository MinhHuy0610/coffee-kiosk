import React from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import QRCode from 'qrcode.react';
export default function CompleteOrderScreen(props) {
  const styles = useStyles();

  return (
    <Box className={[styles.root]}>
      <Box className={[styles.main, styles.center]}>
        <Box>
          {/* <Logo large></Logo> */}
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Thanh Toán
          </Typography>
          <Typography
            gutterBottom
            className={styles.warning}
          >
            Quét mã QR để thanh toán
          </Typography>
          <QRCode
            id='qrcode'
            value='test'
            size={290}
            level={'H'}
            includeMargin={true}
          />
          {/* <CircularProgress /> */}
        </Box>
      </Box>
      <Box className={[styles.center, styles.space]}>
        <Button
          onClick={() => props.history.push('/complete')}
          variant="contained"
          color="primary"
          className={styles.largeButton}
        >
          Hoàn thành
        </Button>
      </Box>
    </Box>
  );
}
