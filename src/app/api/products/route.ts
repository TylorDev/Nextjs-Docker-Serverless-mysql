import cloudinary from "@/libs/cloudinary";
import { conn } from "@/libs/mysql";
import { processImage } from "@/libs/processImage";
import { unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

type ProductRequest = {
  name: string;
  description: string;
  price: number;
  insertId?: number;
};
export async function GET() {
  try {
    const products = await conn.query("SELECT * FROM products");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return NextResponse.json("Error retrieving products", { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    const price = parseFloat(data.get("price") as string);
    const image = data.get("file");

    console.log(image);

    if (!image) {
      return NextResponse.json(
        {
          message: "IMAGE IS REQUIRED",
        },
        {
          status: 400,
        }
      );
    }

    const filePath = await processImage(image);
    const res = await cloudinary.uploader.upload(filePath);
    console.log(res);
    if (res) {
      await unlink(filePath);
    }

    const result: ProductRequest = await conn.query(
      "INSERT INTO products (name, description, price, image) VALUES (?, ?, ?,?)",
      [name, description, price, res.secure_url]
    );

    // Get the ID of the newly created product
    const createdProductId = result.insertId;

    // Prepare the response object with the created product details
    const createdProduct = {
      id: createdProductId,
      name,
      description,
      price,
    };

    return NextResponse.json(createdProduct, { status: 201 });
  } catch (error) {
    console.error("Error inserting product:", error);
    return NextResponse.json("Error creating product", { status: 500 });
  }
}
