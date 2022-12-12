import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { addToOrder, removeFromOrder, setDiscountID } from '../actions';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
import Select from "react-dropdown-select";
import axios from 'axios'
export default function ReviewScreen(props) {
  const shopId = localStorage.getItem("shopId");
  var [discountOption, setDiscountOption] = useState([]);
  var [isClicked, setIsClicked] = useState(false);
  const [discountId, setDiscountId] = useState();
  const fetchData = async () => {
    const total = totalPrice;
    const urlDiscount = `https://localhost:44361/api/v1/discounts/listSuitableDiscount?shopId=${shopId}&price=${total}`
    axios.get(urlDiscount, {
      headers: {
        'Conttent-Type': 'application/json',
      },
    })
      .then((res) => {
        console.log(res)
        console.log(res.data.data.data)
        setDiscountOption(
          res.data.data.map((data) => {
            var option = {
              value: data.id,
              label: " Giảm : " + parseFloat(data.discountValue).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) + " áp dụng cho đơn hàng từ " + parseFloat(data.requiredValue).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
            };
            return option;
          })
        )
      }).catch((error) => {
        console.log(error)
      })
  }

  const styles = useStyles();
  const chooseDiscount = (discountId) => {
    setDiscountID(dispatch, discountId);
  };
  const { state, dispatch } = useContext(Store);
  const {
    orderItems,
    itemsCount,
    totalPrice,
    orderType,
  } = state.order;
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const closeHandler = () => {
    setIsOpen(false);
  };
  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };
  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };
  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };
  useEffect(() => { }, []);
  const loadDiscount = () => {
    setIsClicked(true)
    fetchData()
  }
  const procedToCheckoutHandler = () => {
    // procedToCheckout(dispatch);
    props.history.push('/payment');
  };
  useEffect(() => { }, []);

  return (
    <Box className={[styles.root]}>
      <Box className={[styles.main, styles.navy, styles.center]}>
        <Dialog
          onClose={closeHandler}
          aria-labelledby="max-width-dialog-title"
          open={isOpen}
          fullWidth={true}
          maxWidth="sm"
        >
          <DialogTitle className={styles.center}>
            Thêm {product.name}
          </DialogTitle>
          <Box className={[styles.row, styles.center]}>
            <Button
              variant="contained"
              color="primary"
              disabled={quantity === 1}
              onClick={(e) => quantity > 1 && setQuantity(quantity - 1)}
            >
              <RemoveIcon />
            </Button>
            <TextField
              inputProps={{ className: styles.largeInput }}
              className={styles.largeNumber}
              type="number"
              min={1}
              variant="filled"
              value={quantity}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => setQuantity(quantity + 1)}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={cancelOrRemoveFromOrder}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              {orderItems.find((x) => x.id === product.id)
                ? 'Xóa khỏi Order'
                : 'Hủy'}
            </Button>

            <Button
              onClick={addToOrderHandler}
              variant="contained"
              color="primary"
              size="large"
              className={styles.largeButton}
            >
              Thêm vào đơn hàng
            </Button>
          </Box>
        </Dialog>
        <Box className={[styles.center, styles.column]}>
          <Logo large></Logo>
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Xem lại loại {orderType} order
          </Typography>
        </Box>

        <Grid container>
          {orderItems.map((orderItem) => (
            <Grid item md={12} key={orderItem.id}>
              <Card
                className={styles.card}
                onClick={() => productClickHandler(orderItem)}
              >
                <CardActionArea>
                  <CardContent>
                    <Box className={[styles.row, styles.between]}>
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textPrimary"
                        component="p"
                      >
                        {orderItem.productName}
                      </Typography>
                      <Button variant="contained">Chỉnh sửa</Button>
                    </Box>

                    <Box className={[styles.row, styles.between]}>
                      <Typography
                        variant="body2"
                        color="textPrimary"
                        component="p"
                      >
                        {orderItem.quantity} x {orderItem.price}VNĐ
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Box>
          <Box className={[styles.row, styles.around]} >
            <Button
              onClick={loadDiscount}
              variant="contained"
              color="secondary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Lấy Khuyến mãi
            </Button>
          </Box>
          <Box className={[styles.bordered]}>
            <Select
              options={discountOption}
              style={{
                // border: "none",
                fontSize: "16px",
                borderBottom: "1px solid #0000004a",
                // color: "#191919",
                // textAlign: "center",
                marginBottom: "6%"
              }}
              placeholder="Vui lòng nhấn khuyến mãi trước khi chọn khuyến mãi || Chọn Khuyến mãi tại đây"
              onChange={(e) => chooseDiscount(e[0].value)}
            />
          </Box>
          <Box className={[styles.bordered, styles.space]}>
            Order của tôi | Tổng cộng: {parseFloat(totalPrice).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })} | Số lượng: {itemsCount}
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={() => {
                props.history.push(`/order`);
              }}
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Trở về
            </Button>

            <Button
              onClick={procedToCheckoutHandler}
              variant="contained"
              color="secondary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Thanh toán
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
