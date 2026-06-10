import { useNavigate } from "react-router-dom";

export const SuccessView = () => {
  const navigate = useNavigate();

  return (
    <section className="flex min-h-screen items-center justify-center bg-[#081325]">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-900/50">
            <span className="text-5xl text-green-400">✓</span>
          </div>
        </div>

        <h1 className="mb-8 font-bold text-5xl text-white">
          Purchase Successful
        </h1>

        <p className="mb-12 text-xl text-gray-400">
          Your order has been processed and added to your account.
        </p>

        <div className="space-y-5 text-lg text-white">
          <p>You can view your purchase history in Settings.</p>
          <p>Thank you for your purchase.</p>
        </div>

        <button
          className="mt-12 rounded-lg bg-blue-600 px-8 py-4 font-semibold text-lg text-white transition hover:bg-blue-700"
          onClick={() => navigate("/settings?menu=purchases")}
        >
          View Orders
        </button>
      </div>
    </section>
  );
};