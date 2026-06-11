import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, FaRegHeart, FaRegTrashAlt } from "@/components";
import { calculatePrice, formatPrice, ICON_SIZE, TAX_RATE } from "@/core";
import { useFirebaseContext } from "@/hooks";

export const CartView = () => {
  const { cart, removeFromCart, favorites, toggleFavorite, clearCart, completePurchase } = useFirebaseContext();
  const items = Array.from(cart.values());
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const navigate = useNavigate();
  const subtotal = items.reduce((sum, item) => sum + calculatePrice(item.airDate || item.releaseDate || ""), 0);

  return items.length === 0 ? (
    <section className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-white">Cart</h1>
      </div>
      <div className="rounded-xl border border-slate-700 bg-[#081325] p-10 text-center text-gray-400">Your cart is empty</div>
    </section>
  ) : (
    <section className="mx-auto w-full max-w-7xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-white">Cart</h1>

        <div className="flex gap-3">
          <button
            className="rounded-md bg-red-500 px-4 py-2 font-semibold text-sm text-white transition hover:bg-red-600"
            onClick={clearCart}
          >
            Empty Cart
          </button>

          <button
            className="rounded-md bg-[#bfcc94] px-4 py-2 font-semibold text-[#0D1821] text-sm transition hover:bg-[#e6aace]"
            onClick={() => setShowPurchaseModal(true)}
          >
            Purchase
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-[#081325]">
        <div className="grid grid-cols-[2.5fr_0.7fr_0.7fr_0.5fr] bg-[#1b2940] px-6 py-4 font-semibold text-sm text-white">
          <p>Items</p>
          <p>Type</p>
          <p>Price</p>
          <p className="text-right">Action</p>
        </div>

        {items.map((item) => {
          const price = calculatePrice(item.airDate || item.releaseDate || "");

          return (
            <div className="grid grid-cols-[2.5fr_0.7fr_0.7fr_0.5fr] items-center border-slate-700 border-t px-6 py-4" key={item.id}>
              <div className="flex items-center gap-4">
                <img alt={item.primaryText} className="h-24 w-16 rounded object-cover" src={item.imageUrl} />
                <p className="text-sm text-white">{item.primaryText}</p>
              </div>

              <p className="text-gray-300 text-sm">{item.media === "tv" ? "TV Show" : "Movie"}</p>
              <p className="font-semibold text-white">{formatPrice(price)}</p>

              <div className="flex justify-end gap-4 text-gray-300">
                <button
                  className="transition hover:text-red-400"
                  onClick={() => {
                    removeFromCart(item.id);
                    if (!favorites.has(item.id)) toggleFavorite(item);
                  }}
                >
                  <FaRegHeart size={ICON_SIZE} />
                </button>
                <button className="transition hover:text-red-400" onClick={() => removeFromCart(item.id)}>
                  <FaRegTrashAlt size={ICON_SIZE} />
                </button>
              </div>
            </div>
          );
        })}

        <div className="border-slate-700 border-t">
          <div className="grid grid-cols-2 px-6 py-4 text-white">
            <p className="text-center font-semibold">Subtotal</p>
            <p className="font-semibold">{formatPrice(subtotal)}</p>
          </div>

          <div className="grid grid-cols-2 border-slate-700 border-t px-6 py-4 text-white">
            <p className="text-center font-semibold">Taxes</p>
            <p className="font-semibold">{formatPrice(subtotal * TAX_RATE)}</p>
          </div>

          <div className="grid grid-cols-2 border-slate-700 border-t bg-[#1b2940] px-6 py-4 text-white">
            <p className="text-center font-bold text-lg">Total</p>
            <p className="font-bold text-[#e6aace] text-lg">{formatPrice(subtotal * (1 + TAX_RATE))}</p>
          </div>
        </div>
      </div>

      <Dialog
        cancelText="Cancel"
        confirmText="Confirm"
        onClose={() => setShowPurchaseModal(false)}
        onConfirm={async () => {
          await completePurchase({
            date: new Date().toISOString(),
            items,
            total: subtotal * (1 + TAX_RATE),
          });
          setShowPurchaseModal(false);
          navigate("/success");
        }}
        open={showPurchaseModal}
        title="Confirm Purchase"
      >
        <div className="space-y-4 text-lg">
          <div className="flex justify-between">
            <span className="text-gray-300">Items</span>
            <span className="text-white">{items.length}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Subtotal</span>
            <span className="text-white">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-300">Taxes</span>
            <span className="text-white">{formatPrice(subtotal * TAX_RATE)}</span>
          </div>

          <div className="border-gray-700 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-bold text-white text-xl">Total</span>
              <span className="font-bold text-[#4da3ff] text-xl">{formatPrice(subtotal * (1 + TAX_RATE))}</span>
            </div>
          </div>
        </div>
      </Dialog>
    </section>
  );
};
