/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type CartItemInput = {
  productId: string;
  quantity: number;
  size: string;
};

export type CartLineUnavailableReason =
  | 'OUT_OF_STOCK'
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_UNAVAILABLE'
  | 'SIZE_NOT_FOUND';

export type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

export type CheckoutInput = {
  /** Correo para el recibo; puede no ser el de la cuenta */
  email: string;
  shippingAddress: ShippingAddressInput;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginWithGoogleInput = {
  code: string;
};

export type OrderStatus =
  | 'CANCELLED'
  | 'PAID'
  | 'PENDING_PAYMENT';

/** Categoría principal del producto */
export type ProductCategory =
  | 'ACCESSORIES'
  | 'MEN'
  | 'WOMEN';

export type ProductFilterInput = {
  category?: ProductCategory | null | undefined;
  /** Nombre del color, p. ej. Camel */
  color?: string | null | undefined;
  /** Solo productos destacados */
  featured?: boolean | null | undefined;
  /** Precio máximo en céntimos (incluido) */
  maxPrice?: number | null | undefined;
  /** Valoración mínima (incluida), de 0 a 5 */
  minRating?: number | null | undefined;
  /** Solo productos rebajados */
  onSale?: boolean | null | undefined;
  /** Texto del buscador: nombre, tipo, color o detalles (sin distinguir tildes) */
  search?: string | null | undefined;
  /** Talla, p. ej. M: solo productos con stock en esa talla */
  size?: string | null | undefined;
};

/** Orden del catálogo */
export type ProductSort =
  | 'FEATURED'
  | 'NEWEST'
  | 'PRICE_ASC'
  | 'PRICE_DESC'
  | 'RATING';

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
};

export type RequestPasswordResetInput = {
  email: string;
};

export type ResetPasswordInput = {
  newPassword: string;
  /** Token del enlace del correo */
  token: string;
};

export type ShippingAddressInput = {
  /** Ciudad elegida del listado (searchCities) */
  city: string;
  /** Código ISO del país (shippingCountries) */
  country: string;
  fullName: string;
  /** Calle, número, piso... */
  line1: string;
  /** Número nacional o internacional; solo cifras */
  phone: string;
};

export type UpdateCartItemInput = {
  productId: string;
  /** 0 elimina la línea */
  quantity: number;
  size: string;
};

export type UpdateProfileInput = {
  name: string;
};

export type LoginWithGoogleMutationVariables = Exact<{
  input: LoginWithGoogleInput;
}>;


export type LoginWithGoogleMutation = { loginWithGoogle: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } };

export type RefreshTokensMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokensMutation = { refreshTokens: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } } };

export type SessionUserFieldsFragment = { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { login: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: boolean };

export type RequestPasswordResetMutationVariables = Exact<{
  input: RequestPasswordResetInput;
}>;


export type RequestPasswordResetMutation = { requestPasswordReset: boolean };

export type ResetPasswordMutationVariables = Exact<{
  input: ResetPasswordInput;
}>;


export type ResetPasswordMutation = { resetPassword: boolean };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { updateProfile: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } };

export type ChangePasswordMutationVariables = Exact<{
  input: ChangePasswordInput;
}>;


export type ChangePasswordMutation = { changePassword: boolean };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { register: { __typename: 'AuthPayload', accessToken: string, user: { __typename: 'User', id: string, name: string, email: string, roles: Array<string>, avatarUrl: string | null, hasPassword: boolean, createdAt: string } } };

export type CartFieldsFragment = { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> };

export type AddToCartMutationVariables = Exact<{
  input: CartItemInput;
}>;


export type AddToCartMutation = { addToCart: { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> } };

export type UpdateCartItemMutationVariables = Exact<{
  input: UpdateCartItemInput;
}>;


export type UpdateCartItemMutation = { updateCartItem: { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> } };

export type MergeCartMutationVariables = Exact<{
  items: Array<CartItemInput> | CartItemInput;
}>;


export type MergeCartMutation = { mergeCart: { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> } };

export type CartQuoteQueryVariables = Exact<{
  items: Array<CartItemInput> | CartItemInput;
}>;


export type CartQuoteQuery = { cartQuote: { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> } };

export type MyCartQueryVariables = Exact<{ [key: string]: never; }>;


export type MyCartQuery = { myCart: { __typename: 'Cart', itemCount: number, subtotal: number, savings: number, shipping: number, total: number, amountToFreeShipping: number, lines: Array<{ __typename: 'CartLine', productId: string, size: string, quantity: number, unitPrice: number, lineTotal: number, maxQuantity: number, unavailableReason: CartLineUnavailableReason | null, product: { __typename: 'Product', id: string, slug: string, name: string, color: { __typename: 'ProductColor', name: string }, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null } | null }> } };

export type ToggleFavoriteMutationVariables = Exact<{
  productId: string | number;
}>;


export type ToggleFavoriteMutation = { toggleFavorite: Array<string> };

export type MergeFavoritesMutationVariables = Exact<{
  productIds: Array<string | number> | string | number;
}>;


export type MergeFavoritesMutation = { mergeFavorites: Array<string> };

export type MyFavoriteIdsQueryVariables = Exact<{ [key: string]: never; }>;


export type MyFavoriteIdsQuery = { myFavoriteIds: Array<string> };

export type ProductsByIdsQueryVariables = Exact<{
  ids: Array<string | number> | string | number;
}>;


export type ProductsByIdsQuery = { productsByIds: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> };

export type ShippingCountriesQueryVariables = Exact<{ [key: string]: never; }>;


export type ShippingCountriesQuery = { shippingCountries: Array<{ __typename: 'ShippingCountry', code: string, name: string, dialCode: string }> };

export type SearchCitiesQueryVariables = Exact<{
  countryCode: string;
  search: string;
  limit?: number | null | undefined;
}>;


export type SearchCitiesQuery = { searchCities: Array<{ __typename: 'City', name: string }> };

export type OrderFieldsFragment = { __typename: 'Order', id: string, number: string, email: string, status: OrderStatus, subtotal: number, shipping: number, total: number, createdAt: string, expiresAt: string, paidAt: string | null, lines: Array<{ __typename: 'OrderLine', productId: string, slug: string, name: string, colorName: string, size: string, imagePublicId: string | null, unitPrice: number, quantity: number, lineTotal: number }>, shippingAddress: { __typename: 'ShippingAddress', fullName: string, phone: string, line1: string, city: string, country: string } };

export type StartCheckoutMutationVariables = Exact<{
  input: CheckoutInput;
}>;


export type StartCheckoutMutation = { startCheckout: { __typename: 'CheckoutSession', clientSecret: string, order: { __typename: 'Order', id: string, number: string, email: string, status: OrderStatus, subtotal: number, shipping: number, total: number, createdAt: string, expiresAt: string, paidAt: string | null, lines: Array<{ __typename: 'OrderLine', productId: string, slug: string, name: string, colorName: string, size: string, imagePublicId: string | null, unitPrice: number, quantity: number, lineTotal: number }>, shippingAddress: { __typename: 'ShippingAddress', fullName: string, phone: string, line1: string, city: string, country: string } } } };

export type ConfirmOrderPaymentMutationVariables = Exact<{
  orderId: string | number;
}>;


export type ConfirmOrderPaymentMutation = { confirmOrderPayment: { __typename: 'Order', id: string, number: string, email: string, status: OrderStatus, subtotal: number, shipping: number, total: number, createdAt: string, expiresAt: string, paidAt: string | null, lines: Array<{ __typename: 'OrderLine', productId: string, slug: string, name: string, colorName: string, size: string, imagePublicId: string | null, unitPrice: number, quantity: number, lineTotal: number }>, shippingAddress: { __typename: 'ShippingAddress', fullName: string, phone: string, line1: string, city: string, country: string } } };

export type MyOrdersQueryVariables = Exact<{
  page?: number | null | undefined;
  pageSize?: number | null | undefined;
}>;


export type MyOrdersQuery = { myOrders: { __typename: 'OrderPage', totalCount: number, page: number, totalPages: number, items: Array<{ __typename: 'Order', id: string, number: string, email: string, status: OrderStatus, subtotal: number, shipping: number, total: number, createdAt: string, expiresAt: string, paidAt: string | null, lines: Array<{ __typename: 'OrderLine', productId: string, slug: string, name: string, colorName: string, size: string, imagePublicId: string | null, unitPrice: number, quantity: number, lineTotal: number }>, shippingAddress: { __typename: 'ShippingAddress', fullName: string, phone: string, line1: string, city: string, country: string } }> } };

export type OrderQueryVariables = Exact<{
  id: string | number;
}>;


export type OrderQuery = { order: { __typename: 'Order', id: string, number: string, email: string, status: OrderStatus, subtotal: number, shipping: number, total: number, createdAt: string, expiresAt: string, paidAt: string | null, lines: Array<{ __typename: 'OrderLine', productId: string, slug: string, name: string, colorName: string, size: string, imagePublicId: string | null, unitPrice: number, quantity: number, lineTotal: number }>, shippingAddress: { __typename: 'ShippingAddress', fullName: string, phone: string, line1: string, city: string, country: string } } };

export type ProductCardFieldsFragment = { __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null };

export type CatalogQueryVariables = Exact<{
  filter?: ProductFilterInput | null | undefined;
  sort: ProductSort;
  page: number;
  pageSize: number;
}>;


export type CatalogQuery = { products: { __typename: 'ProductPage', totalCount: number, page: number, totalPages: number, items: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> }, productFacets: { __typename: 'ProductFacets', sizes: Array<string>, minPrice: number, maxPrice: number, colors: Array<{ __typename: 'ProductColor', name: string, hex: string }> } };

export type HomeProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type HomeProductsQuery = { featured: { __typename: 'ProductPage', items: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> }, newArrivals: { __typename: 'ProductPage', items: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> } };

export type ProductDetailQueryVariables = Exact<{
  slug: string;
}>;


export type ProductDetailQuery = { product: { __typename: 'Product', id: string, slug: string, name: string, description: string, details: Array<string>, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, category: ProductCategory, type: string, inStock: boolean, rating: number, reviewsCount: number, color: { __typename: 'ProductColor', name: string, hex: string }, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, images: Array<{ __typename: 'ProductImage', publicId: string, alt: string, width: number, height: number }> } | null, relatedProducts: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, discountPercentage: number | null, isNew: boolean, rating: number, inStock: boolean, sizes: Array<{ __typename: 'ProductSize', size: string, inStock: boolean }>, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> };

export type SearchSuggestionsQueryVariables = Exact<{
  search: string;
  limit: number;
}>;


export type SearchSuggestionsQuery = { products: { __typename: 'ProductPage', totalCount: number, items: Array<{ __typename: 'Product', id: string, slug: string, name: string, price: number, compareAtPrice: number | null, mainImage: { __typename: 'ProductImage', publicId: string, alt: string } | null }> } };
