import { createAction, props } from "@ngrx/store";

export const loadOrders = createAction("[Orders Component] Load Orders");
export const loadOrdersSuccess = createAction(
  "[Orders Component] Orders Loaded - Success",
  props<OrdersResponse>()
);

export const loadSingleOrder = createAction(
  "[Single Order Component] Load Single Order",
  props<{ orderId: string }>()
);
export const loadSingleOrderSuccess = createAction(
  "[Single Order Component] Single Order Loaded - Success",
  props<SingleOrderResponse>()
);
export const clearSingleOrder = createAction("[Single Order Component] Clear Single Order");

export const createOrder = createAction(
  "[Checkout Component] Create Order - Loading",
  props<NewOrderRequest>()
);
export const createOrderSuccess = createAction(
  "[Checkout Component] Create Order - Success",
  props<NewOrderResponse>()
);

export const addExpressCheckoutItem = createAction(
  "[Checkout Component] Add Express Checkout Item",
  props<ExpressCheckoutItem>()
);
export const clearExpressCheckout = createAction("[Checkout Component] Remove Express Checkout Item");

export const deleteOrder = createAction(
  "[Orders Component] Delete Order - Loading",
  props<{ orderId: number }>()
);

export const deleteOrderSuccess = createAction(
  "[Orders Component] Delete Order - Success",
  props<{ deletedOrder: SingleOrderResponse }>()
);

export const updateOrder = createAction(
  "[New Order - Redirect Component] Update Order - Loading",
  props<{ 
    status: string, 
    orderId: number 
  }>()
);

export const updateOrderSuccess = createAction(
  "[New Order - Redirect Component] Update Order - Success",
  props<SingleOrderResponse>()
);