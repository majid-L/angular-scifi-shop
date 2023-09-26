import { SocialUser } from "@abacritt/angularx-social-login"
import { HttpHeaders } from "@angular/common/http"
import { FormControl, FormGroup } from "@angular/forms"

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
    numOfTimesOrdered: number
    totalUnitsOrdered?: number | null
    numOfReviews: number
    averageRating: string | null
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
    name?: string
    email?: string
    username: string
    password: string
  }

  type OAuthCredentials = {
    name: string
    email: string
    authId: string
    provider: string
    thumbnail: string
  }

  type AddressEmitData = { 
    address: Address
    type: "billingAddress" | "shippingAddress" | undefined
    useExisting: boolean 
  }

  type AddressFormGroup = FormGroup<{
    addressLine1: FormControl<string | null>;
    addressLine2: FormControl<string | null>;
    city: FormControl<string | null>;
    county: FormControl<string | null>;
    postcode: FormControl<string | null>;
  }>

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
    paymentMethod: string
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
    orderId: number
    title: string
    body: string
    rating: Rating
    recommend?: boolean
  }

  type UpdateReviewRequest = {
    title?: string
    body?: string
    recommend?: boolean | null
    rating?: Rating
  }

  type UpdateCustomerRequest = {
    username?: string
    password?: string
    name?: string
    email?: string
    phone?: string | null
    avatar?: string | null
  }

  type Review = NewReviewRequest & {
    id: number
    recommend: boolean | null
    createdAt?: string
    addedAt?: string
    product?: Product
    customer?: {
      username: string
      avatar: string | null
    }
  }

  type ReviewsResponse = Pagination & {
    reviews: Review[] | []
  }

  type CustomerReviewsResponse = Pagination & {
    customer: Customer,
    reviews: Review[] | []
  }

  type FavoritesResponse = Pagination & {
    favorites: Review[] | []
  }

  type NewOrderResponse = Order & {
    billingAddress: Address
  }

  type CustomerNewAddress = {
    newAddress: Address,
    customer: Customer
  }

  type DeleteUserResponse = {
    msg: string,
    deletedUser: {
      id: number
      name: string
      username: string
      email: string
    }
  }

  type SingleOrderResponse = NewOrderResponse;

  type OrdersResponse = {
    id: number
    name: string
    username: string
    orders: Order[] | []
  }

  type Category = {
    id: number
    name: string
    description: string
    thumbnail: string
    products: number
  }

  type Supplier = Category & {
    location: string,
    establishYear: number
  }

  type ExpressCheckoutItem = {
    product: Product
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
    } | null,
    review: Review | null
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
    socialUser: SocialUser | null
  }

  type ApiError = {
    error?: {
      status: number
      info: string
      message?: string
      stack?: string
    }
  }

  type StacktraceError = {
    error: {
      message: string
      stack: string
    }
  }

  type DialogContent = ApiError & {
    title: string
    content?: string
    buttons?: {
      newOrder?: string
    },
    deletedUser?: {
      id: number
      name: string
      username: string
      email: string
    }
  }

  type NotificationState = {
    showDialog: boolean
    data: DialogContent | null
  }

  type Status = "pending" | "loading" | "success" | "error";
  type AddressId = "billingAddressId" | "shippingAddressId";

  type ProductsState = {
    pagination: Pagination
    products: Product[] | [] | null
    singleProduct: SingleProduct | null
    searchTerm: string | null
    orderSearchResult: OrderSearchResponse | null
    loadStatus: Status
    searchStatus: Status
  }

  type ProductsUrlParams = {
    page?: string | number
    limit?: string | number
    minPrice?: string | number
    maxPrice?: string | number
    category?: string
    supplier?: string
    product?: string
    hideOutOfStock?: boolean
    orderBy?: string
    order?: string
    avgRating?: string | number
  }

  type ReviewsState = {
    pagination: Pagination
    reviews: Review[] | [] | null
    customer: Customer | null
    favorites: Review[] | [] | null
    singleReview: Review | null
    activeId: number
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

  type WishlistItem = {
    productId: number
    customerId: number
  }

  type WishlistBasic = WishlistItem[] | []

  type Wishlist = {
    id: number
    name: string
    username: string
    wishlistItems: { product: Product }[] | []
  }

  type WishlistState = {
    loadStatus: Status
    updateStatus: Status
    activeId: number
    wishlist: Wishlist | null
  }

  type AccountActiveItem = "billingAddress" | "shippingAddress" | "password" | "account" | null;

  type AccountState = {
    account: Customer | null
    loadStatus: Status
    updateStatus: Status
    deleteStatus: Status
    activeItem: AccountActiveItem
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

  type CategoriesState = {
    categories: Category[] | null
    suppliers: Supplier[] | null
    categoriesLoadStatus: Status
    suppliersLoadStatus: Status
  }

  type AppState = {
    authSlice: AuthState
    accountSlice: AccountState
    categoriesSlice: CategoriesState
    cartSlice: CartState
    wishlistSlice: WishlistState
    productsSlice: ProductsState
    ordersSlice: OrdersState
    reviewsSlice: ReviewsState
    notificationSlice: NotificationState
  }
}