"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function ProductForm() {
  type Product = {
    name: string;
    description: string;
    price: number;
  };

  const [file, setFile] = useState();
  const [product, setProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
  });

  const params = useParams();

  useEffect(() => {
    if (params.id) {
      const result = axios.get("/api/products/" + params.id).then((res) => {
        setProduct({
          name: res.data.name,
          price: res.data.price,
          description: res.data.description,
        });
      });
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    // Log the value to the console
    console.log(value);

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" ? parseFloat(value) : value, // Parse price to a number
    }));
  };
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); // Typed ref for the form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if a file is provided
    const hasFile = !!file;
    const url = `/api/products${params.id ? `/${params.id}` : ""}`;
    const config = {
      headers: {
        "Content-Type": hasFile ? "multipart/form-data" : "application/json",
      },
    };

    // Initialize FormData if a file is provided or a new product is being created
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", product.price.toString());
    formData.append("description", product.description);

    // Append the file if it exists
    if (hasFile) {
      formData.append("file", file);
    }

    if (!params.id) {
      // Create new product
      const response = await axios.post(
        url,
        hasFile ? formData : product,
        config
      );
      console.log(response);
    } else {
      // Update existing product
      const response = await axios.put(
        url,
        hasFile ? formData : product,
        config
      );
      console.log(response);
    }

    formRef.current?.reset();
    router.refresh();
    router.push("/products");
  };

  return (
    <div className="flex ">
      <form
        className="space-y-4 p-4 max-w-md mx-auto bg-white shadow-md rounded text-gray-600"
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoFocus
            value={product.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description:
          </label>
          <textarea
            rows={3}
            value={product.description}
            id="description"
            name="description"
            required
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          ></textarea>
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price:
          </label>
          <input
            value={product.price}
            type="number"
            id="price"
            name="price"
            required
            step="0.01"
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
        </div>

        <label
          htmlFor="productImage"
          className="block text-sm font-medium text-gray-700"
        >
          Product Image
        </label>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          {params.id ? "Update Product" : "Create Product"}
        </button>
      </form>

      {file && (
        <img className="w-1/4 h-full" src={URL.createObjectURL(file)}></img>
      )}
    </div>
  );
}
export default ProductForm;
