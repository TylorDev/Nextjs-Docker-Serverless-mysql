import ProductCard from "@/components/ProductCard";
import axios from "axios";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

async function loadProducts(): Promise<Product[]> {
  const { data } = await axios.get("http://localhost:3000/api/products");
  return data;
}
async function Products() {
  const products = await loadProducts();
  // console.log(products);
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Products Page</h1>
      <div className="grid grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </div>
  );
}

export default Products;
