import Axios from 'axios';
import {
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
  ORDER_SET_TYPE,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  SCREEN_SET_WIDTH,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  DISCOUNT_SET,
} from './constants';

export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    const urlCategory = 'https://localhost:44361/api/v1/categories?Status=0'
    var data;
    await Axios.get(urlCategory, {
      headers: {
        'Conttent-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status == 200)
          console.log(res)
        console.log(res.data)
        console.log(res.data.data)
        console.log(res.data.data.data)
        data = res.data.data.data
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    return dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listProducts = async (dispatch, categoryName = '') => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const shopId = localStorage.getItem("shopId");
    const urlProduct =
      `https://localhost:44361/api/v1/supplies/customer?shopId=${shopId}&CategoryName=${categoryName}`
    var data;
    await Axios.get(urlProduct, {
      headers: {
        'Conttent-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status == 200)
          console.log(res)
        console.log(res.data)
        console.log(res.data.data)
        console.log(res.data.data.data)
        data = res.data.data.data
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    return dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const setDiscountID = async (dispatch, discountId) => {
  return dispatch({
    type: DISCOUNT_SET,
    payload: discountId,
  });
};


export const createOrder = async (dispatch, order) => {
  dispatch({ type: ORDER_CREATE_REQUEST });
  try {
    var listOrder = []
    order.orderItems.map((item) => {
      var orderItem = {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      };
      listOrder.push(orderItem);
    })

    console.log("listOrder: " + listOrder);
    console.log("order: " + order.orderItems.map((item) => console.log(item)))
    // const { data } = await Axios.post('/api/orders', order);
    var data;
    const urlOrder = 'https://localhost:44361/api/v1/orders'
    const totalPriceBeforeDiscount = order.totalPrice;
    const discountId = order.discountId;
    const shopId = localStorage.getItem("shopId");
    const dataJson = {
      listOrder,
      shopId,
      discountId,
      totalPriceBeforeDiscount,
    }
    console.log(JSON.stringify(dataJson))
    // axios.post(urlUpdatePercent, JSON.stringify(obj), {
    //   headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //   },
    await Axios.post(urlOrder, JSON.stringify(dataJson), {
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => {
        if (response.status != 200) throw new Error(response.data);
        else {
          data = response.data.data.no;
          console.log(response);
          console.log(response.data.data);
          console.log(response.data.data.no);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message,
    });
  }
};

export const setOrderType = async (dispatch, orderType) => {
  return dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};

export const setPaymentType = async (dispatch, paymentType) => {
  return dispatch({
    type: ORDER_SET_PAYMENT_TYPE,
    payload: paymentType,
  });
};
export const clearOrder = async (dispatch) => {
  return dispatch({
    type: ORDER_CLEAR,
  });
};

export const addToOrder = async (dispatch, item) => {
  return dispatch({
    type: ORDER_ADD_ITEM,
    payload: item,
  });
};
export const removeFromOrder = async (dispatch, item) => {
  return dispatch({
    type: ORDER_REMOVE_ITEM,
    payload: item,
  });
};

export const listQueue = async (dispatch) => {
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/orders/queue`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_QUEUE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_QUEUE_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listOrders = async (dispatch) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const urlOrder = 'https://localhost:44361/api/v1/orders'
    var data;
    await Axios.get(urlOrder, {
      headers: {
        'Conttent-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status == 200)
          console.log(res)
        console.log(res.data)
        console.log(res.data.data)
        console.log(res.data.data.data)
        data = res.data.data.data
        console.log(data)
      }).catch((error) => {
        console.log(error)
      })
    // const { data } = await Axios.get(`/api/orders`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.message,
    });
  }
};
