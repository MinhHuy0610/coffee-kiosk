import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import {
  addToOrder,
  clearOrder,
  listCategories,
  listProducts,
  removeFromOrder,
} from '../actions';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Dialog,
  DialogTitle,
  Grid,
  List,
  ListItem,
  Slide,
  TextField,
  Typography,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { Alert } from '@material-ui/lab';
import { useStyles } from '../styles';
import Logo from '../components/Logo';
export default function OrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { categories, loading, error } = state.categoryList;
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;
  const {
    orderItems,
    itemsCount,
    totalPrice,
    orderType,
  } = state.order;

  const [categoryName, setCategoryName] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const closeHandler = () => {
    setIsOpen(false);
  };
  const productClickHandler = (p) => {
    setProduct(p);
    console.log("p: " + p)
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
  const previewOrderHandler = () => {
    props.history.push(`/review`);
  };
  useEffect(() => {
    if (!categories) {
      listCategories(dispatch);
    } else {
      listProducts(dispatch, categoryName);
    }
  }, [categories, categoryName]);

  const categoryClickHandler = (name) => {
    setCategoryName(name);
    listProducts(dispatch, categoryName);
  };

  return (
    <Box className={styles.root}>
      <Box className={styles.main}>
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
              InputProps={{
                bar: true,
                inputProps: {
                  className: styles.largeInput,
                },
              }}
              className={styles.largeNumber}
              type="number"
              variant="filled"
              min={1}
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
                ? 'Remove From Order'
                : 'Cancel'}
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

        <Grid container>
          <Grid item md={2}>
            <List>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Alert severity="error">{error}</Alert>
              ) : (
                <>
                  <ListItem button onClick={() => categoryClickHandler('')}>
                    <Logo></Logo>
                  </ListItem>
                  {categories.map((category) => (
                    <ListItem
                      key={category.name}
                      button
                      onClick={() => categoryClickHandler(category.name)}
                    >
                      {/* <Avatar alt={category.name} src={category.image} /> */}
                      {/* <Typography
                        variant="body2"
                        color="textPrimary"
                      >
                        {product.name}
                      </Typography> */}
                      <Typography
                        gutterBottom
                        variant="body2"
                        color="textPrimary"
                      >
                        {category.name}
                      </Typography>
                    </ListItem>
                  ))}
                </>
              )}
            </List>
          </Grid>
          <Grid item md={10}>
            <Typography
              gutterBottom
              className={styles.title}
              variant="h2"
              component="h2"
            >
              {categoryName || 'Menu Chính'}
            </Typography>

            <Grid container spacing={1}>
              {loadingProducts ? (
                <CircularProgress />
              ) : errorProducts ? (
                <Alert severity="error">{errorProducts}</Alert>
              ) : (
                products.map((product) => (
                  <Slide key={product.name} direction="up" in={true}>
                    <Grid item md={3} onClick={() => {
                      // var productId = product.id;
                      productClickHandler(product);
                    }}>
                      <Card
                        className={styles.card}
                      >
                        <CardActionArea>
                          {product.listImage.map((image) => (
                            <CardMedia
                              component="img"
                              alt={product.name}
                              image={image.link}
                              className={styles.media}
                            />
                          ))}
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="body2"
                              color="textPrimary"
                              component="p"
                            >
                              {product.productName}
                            </Typography>
                            <Box className={styles.cardFooter}>
                              <Typography
                                variant="body2"
                                color="textSecondary"
                                component="p"
                              >
                                {product.description}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="textPrimary"
                                component="p"
                              >
                                {parseFloat(product.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                              </Typography>
                            </Box>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  </Slide>
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box>
          <Box className={[styles.bordered, styles.space]}>
            Đơn hàng của tôi - {orderType} | Tổng cộng: {totalPrice} VNĐ |
            Số lượng: {itemsCount}
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={() => {
                clearOrder(dispatch);
                props.history.push(`/`);
              }}
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Hủy Đơn hàng
            </Button>

            <Button
              onClick={previewOrderHandler}
              variant="contained"
              color="primary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Hoàn thành
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
