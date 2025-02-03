import Image from "@/components/Image";
import { Cart, useUser } from "@/hooks/useUser";
import { Trash2 } from "lucide-react";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | undefined>(undefined);
  const { user, setUser } = useUser();

  useEffect(() => {
    setCart(user?.cart);
  }, [user])

  async function handleQuantityChange(productId: string, quantity: string) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart/update-cart`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        return enqueueSnackbar(data.message, {
          variant: "error"
        });
      }

      setCart(data.cart);
      if (user && data.cart) {
        setUser({ ...user, cart: data.cart });
      }
      enqueueSnackbar(data.message, {
        variant: "success"
      })
    } catch (error) {
      if (error instanceof Error) {
        return enqueueSnackbar(error.message, {
          variant: "error"
        });
      }
      console.error(error);
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 min-h-screen">
      {cart && cart.cartProducts.length === 0 ? (
        <p className="text-xl text-center space-y-4 text-black">Your Shophub Cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart?.cartProducts.map((cp) => (
            <div
              key={cp.productId}
              className="flex flex-col md:flex-row lg:flex-row gap-4 items-center p-4 rounded-lg shadow-sm border"
            >
              <Image
                src={cp.product.imageUrl || ""}
                alt={cp.product.name}
                className="rounded-md object-cover w-full lg:w-48"
              />
              <div className="flex-1 flex gap-3 items-center justify-between">
                <div className="flex flex-col">
                  <h2 className="text-base lg:text-lg font-medium">{cp.product.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{cp.product.description}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold">₹{(cp.price * cp.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 line-through">
                      ₹{(cp.product.price * cp.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-green-600">
                      {cp.product.discount}% off
                    </p>
                  </div>

                  <div className="mt-2">
                    <label htmlFor={`quantity-${cp.productId}`} className="text-sm text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id={`quantity-${cp.productId}`}
                      value={cp.quantity}
                      onChange={(e) => handleQuantityChange(cp.productId, e.target.value)}
                      className="ml-2 p-1 border border-gray-300 rounded-md"
                    >
                      {Array.from({ length: 11 }, (_, i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => handleQuantityChange(cp.productId, "0")}
                  className="p-2 text-red-600 hover:bg-gray-200 rounded "
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <div className="mt-6 text-right">
            <p className="text-xl">
              Subtotal({(cart?.cartProducts.length! > 1) ? `${cart?.cartProducts.length} items` : `${cart?.cartProducts.length} item`}): <span className="font-semibold">₹{cart?.totalPrice.toFixed(2)}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
