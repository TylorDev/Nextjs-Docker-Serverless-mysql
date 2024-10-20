import Link from "next/link";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

function ProductCard({ product }) {
  return (
    <Link
      className="border rounded-md  shadow-md bg-black  hover:bg-gray-800"
      href={`/products/${product.id}`}
    >
      {product.image && (
        <img src={product.image} alt="image" className="w-full" />
      )}
      <h2 className="text-lg font-semibold">{product.name}</h2>
      <p className="text-gray-600">{product.description}</p>
      <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
    </Link>
  );
}
export default ProductCard;
