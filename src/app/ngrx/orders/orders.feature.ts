import { createFeature, createReducer, on } from "@ngrx/store"
import { httpError } from "../notification/notification.actions";
import { addExpressCheckoutItem, clearSingleOrder, createOrder, createOrderSuccess, deleteOrder, deleteOrderSuccess, loadOrders, loadOrdersSuccess, loadSingleOrder, loadSingleOrderSuccess, clearExpressCheckout, updateOrder, updateOrderSuccess, resetStatus } from "./orders.actions";

const initialState: OrdersState = {
  orders: null,
  singleOrder: null,
  newOrder: null,
  expressCheckoutItem: null,
  loadStatus: "pending",
  createStatus: "pending",
  updateStatus: "pending",
  deleteStatus: "pending"
}

export const ordersReducer = createReducer(
  initialState,
  on(
    loadOrders, 
    loadSingleOrder, 
    state => ({ ...state, loadStatus: "loading" as const })
  ),
  on(loadOrdersSuccess, (state, payload) => {
    return {
       ...state,
       loadStatus: "success" as const,
       orders: payload
    }
  }),
  on(loadSingleOrderSuccess, (state, payload) => {
    return {
      ...state,
      loadStatus: "success" as const,
      singleOrder: payload
    }
  }),
  on(clearSingleOrder, state => ({ ...state, singleOrder: null })),
  on(createOrder, state => {
    return {
       ...state,
       createStatus: "loading" as const
    }
  }),
  on(createOrderSuccess, (state, payload) => {
    return {
       ...state,
       createStatus: "success" as const,
       newOrder: payload
    }
  }),
  on(addExpressCheckoutItem, (state, payload) => {
    return {
      ...state,
      expressCheckoutItem: payload
    }
  }),
  on(clearExpressCheckout, state => {
    return {
      ...state,
      expressCheckoutItem: null
    }
  }),
  on(updateOrder, state => ({ ...state, updateStatus: "loading" as const })),
  on(updateOrderSuccess, (state, payload) => {
    return {
      ...state,
      updateStatus: "success" as const,
      singleOrder: payload
    }
  }),
  on(deleteOrder, state => ({ ...state, deleteStatus: "loading" as const })),
  on(deleteOrderSuccess, (state, payload) => {
    const filteredOrders = !state.orders ? [] 
      : state.orders.orders.length === 0 ? [] 
      : state.orders.orders.filter(order => order.id !== payload.deletedOrder.id);
    return {
      ...state,
      orders: { ...state.orders, orders: filteredOrders } as OrdersResponse,
      deleteStatus: "success" as const,
      singleOrder: payload.deletedOrder
    }
  }),
  on(resetStatus, state => ({ 
    ...state, 
    loadStatus: "pending" as const, 
    createStatus: "pending" as const,
    updateStatus: "pending" as const,
    deleteStatus: "pending" as const
  })),
  on(httpError, state => ({ 
    ...state, 
    loadStatus: "error" as const, 
    createStatus: "error" as const,
    updateStatus: "error" as const,
    deleteStatus: "error" as const
  }))
);

export const ordersFeature = createFeature({
  name: "orders",
  reducer: ordersReducer
});

export const {
  selectOrders,
  selectSingleOrder,
  selectNewOrder,
  selectExpressCheckoutItem,
  selectLoadStatus,
  selectCreateStatus,
  selectUpdateStatus,
  selectDeleteStatus
} = ordersFeature;