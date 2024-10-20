import axios from "axios";
import Buttons from "./Buttons";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

async function loadProduct(id) {
  const { data } = await axios.get("http://localhost:3000/api/products/" + id);

  return data;
}

async function page({ params }) {
  const product: Product = await loadProduct(params.id);

  return (
    <div className={""}>
      <div className="border rounded-md p-10 shadow-md bg-black  hover:bg-gray-800">
        {product.image && <img src={product.image} alt="" className="w-64" />}
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
        <Buttons productId={product.id} />
      </div>
    </div>
  );
}
export default page;
