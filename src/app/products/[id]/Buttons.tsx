"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

function Buttons({ productId }) {
  const router = useRouter();
  return (
    <div className="flex gap-x-2">
      <button
        className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        onClick={async () => {
          if (confirm("are you sure?")) {
            console.log("deleting");
            const result = await axios.delete("/api/products/" + productId);
            console.log(result);
            if (result.status === 200) {
              router.push("/products");
              router.refresh();
            }
          }
        }}
      >
        Delete
      </button>
      <button
        onClick={() => {
          router.push("/products/edit/" + productId);
          router.refresh();
        }}
        className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
      >
        Edit
      </button>
    </div>
  );
}
export default Buttons;
