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

  type SingleProduct = Product & { 
    totalRatings: number
    averageRating?: string
  }

  type Pagination = {
    page: number
    count: number
    totalResults: number
  }

  type ProductsResponse = Pagination & {
    products: Product[] | []
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
    id?: number
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

  type AddressEmitData = { 
    address: Address
    type: "billingAddress" | "shippingAddress" | undefined
    useExisting: boolean 
  }

  type NewOrderRequest = {
    billingAddress: Address
    shippingAddress: Address
    item?: {
      productId: number
      quantity: number
    }
  }

  type Order = {
    id: number,
    customerId: number
    billingAddressId: number
    shippingAddressId: number
    status: string
    paymentMethoid: string
    total: string
    createdAt: string
    shippingAddress: Address
    orderItems: {
      quantity: number
      product: Product
    }[]
  }

  type Rating = 0 | 1 | 2 | 3 | 4 | 5;

  type NewReviewRequest = {
    customerId: number
    productId: number
    title: string
    body: string
    rating: Rating
  }

  type UpdateReviewRequest = {
    title?: string
    body?: string
    recommend?: boolean | null
    rating?: Rating
  }

  type Review = NewReviewRequest & {
    id: number
    recommend: boolean | null
    createdAt: string
  }

  type ReviewsResponse = Pagination & {
    reviews: Review[] | []
  }

  type NewOrderResponse = Order & {
    billingAddress: Address
  }

  type SingleOrderResponse = NewOrderResponse;

  type OrdersResponse = {
    id: number
    name: string
    username: string
    orders: Order[] | []
  }

  type ExpressCheckoutItem = {
    productId: number
    price: number
    quantity: number
  }

  type PaymentEvent = { 
    status: "completed" | "pending"
    paymentMethod: "Card" | "Klarna" | "PayPal"
    total: number
  }

  // Response returned from searching order history for a specific product id
  type OrderSearchResponse = {
    productId: number
    lastOrdered: {
      orderId: number
      orderDate: string
    } | null
  }

  /* NgRx types for state management */
  type AuthState = {
    showOverlay: boolean
    currentUser: Customer | null
    loggedInUserId: number | string | null
    loginStatus: Status
    logoutStatus: Status
    signupStatus: Status
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
    buttons?: {
      newOrder?: string
    }
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
    singleProduct: SingleProduct | null
    orderSearchResult: OrderSearchResponse | null
    loadStatus: Status
    searchStatus: Status
  }

  type ReviewsState = {
    page: number | null
    count: number | null
    totalResults: number | null
    reviews: Review[] | null
    singleReview: Review | null
    loadStatus: Status
    createStatus: Status
    updateStatus: Status
    deleteStatus: Status
  }

  type CartItemDetail = {
    quantity: number
    product: Product
  }

  type Cart = {
    id: number
    name: string
    username: string
    cartItems: CartItemDetail[] | []
  }

  type CartItem = {
    productId: number
    customerId: number
    quantity: number
  }

  type CartState = {
    loadStatus: Status
    updateStatus: Status
    activeId: number
    cart: Cart | null
  }

  type AccountState = {
    account: Customer | null
    status: Status
  }

  type OrdersState = {
    orders: OrdersResponse | null
    singleOrder: SingleOrderResponse | null
    expressCheckoutItem: ExpressCheckoutItem | null
    newOrder: NewOrderResponse | null
    loadStatus: Status
    createStatus: Status
    updateStatus: Status
    deleteStatus: Status
  }

  type AppState = {
    authSlice: AuthState
    accountSlice: AccountState
    cartSlice: CartState
    productsSlice: ProductsState
    ordersSlice: OrdersState
    reviewsSlice: ReviewsState
    notificationSlice: NotificationState
  }
}