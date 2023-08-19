import { HttpHeaders } from "@angular/common/http"

export {}

declare global {
  type Product = {
    id: number
    name: string
    description: string
    price: string
    stock: number
    categoryName: string
    supplierName: string
    thumbnail: string
    numOfTimesOrdered?: number
  }

  type Pagination = {
    page: number
    count: number
    totalResults: number
  }

  type ProductsResponse = Pagination & {
    products: Product[]
  }

  type Customer = {
    id: number
    name: string
    email: string
    username: string
    joinDate: string
    phone: string | null
    billingAddressId: number | null
    shippingAddressId: number | null
    password: string
    avatar: string | null
    billingAddress?: Address | null
    shippingAddress?: Address | null
  }

  type Address = {
    id: number
    addressLine1: string
    addressLine2: string | null
    city: string
    county: string | null
    postcode: string
  }

  type AuthCredentials = {
    name: string
    email: string
    username: string
    password: string
  }

  /* NgRx types for state management */
  type AuthState = {
    showOverlay: boolean
    currentUser: Customer | null
    loggedInUserId: number | string | null
    status: Status,
    logoutMsg: string | null
  }

  type ApiError = {
    error?: {
      status: number
      info: string
    }
  }

  type DialogContent = ApiError & {
    title: string
    content?: string
  }

  type NotificationState = {
    showDialog: boolean
    data: DialogContent | null
  }

  type Status = "pending" | "loading" | "success" | "error";

  type ProductsState = {
    page: number | null
    count: number | null
    totalResults: number | null
    products: Product[] | null
    status: Status
  }

  type Cart = {
    id: number
    name: string
    username: string
    cartItems: {
      quantity: number
      product: Product
    }[] | []
  }

  type CartItem = {
    productId: number
    customerId: number
    quantity: number
  }

  type CartStatus = {
    loadStatus: Status
    updateStatus: Status
  }

  type CartState = CartStatus & {
    cart: Cart | null
  }

  type AccountState = {
    account: Customer | null
    status: Status
  }

  type AppState = {
    authSlice: AuthState
    accountSlice: AccountState
    cartSlice: CartState
    productsSlice: ProductsState
    notificationSlice: NotificationState
  }
}