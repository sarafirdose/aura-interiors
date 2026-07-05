import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ProductSummary {
  id: string
  name: string
  price: number
  salePrice: number | null
  heroImage: string
  sku: string
}

export interface CartItem {
  product: ProductSummary
  variantId?: string
  color?: string
  quantity: number
}

interface AppState {
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void

  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void

  wishlist: ProductSummary[]
  toggleWishlist: (product: ProductSummary) => void

  compareList: ProductSummary[]
  toggleCompare: (product: ProductSummary) => void

  ambientMode: 'day' | 'night'
  toggleAmbientMode: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      ambientMode: 'night',
      toggleAmbientMode: () =>
        set((state) => ({
          ambientMode: state.ambientMode === 'day' ? 'night' : 'day',
        })),

      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) => i.product.id === item.product.id && i.variantId === item.variantId
          )
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.product.id === item.product.id && i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { cart: [...state.cart, item], isCartOpen: true }
        }),
      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.product.id === productId && i.variantId === variantId)
          ),
        })),
      updateQuantity: (productId, quantity, variantId) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.product.id === productId && i.variantId === variantId
              ? { ...i, quantity }
              : i
          ),
        })),
      clearCart: () => set({ cart: [] }),

      wishlist: [],
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id)
          if (exists) {
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) }
          }
          return { wishlist: [...state.wishlist, product] }
        }),

      compareList: [],
      toggleCompare: (product) =>
        set((state) => {
          const exists = state.compareList.some((p) => p.id === product.id)
          if (exists) {
            return { compareList: state.compareList.filter((p) => p.id !== product.id) }
          }
          if (state.compareList.length >= 4) return state; // Max 4 to compare
          return { compareList: [...state.compareList, product] }
        }),
    }),
    {
      name: 'aura-storage',
    }
  )
)
