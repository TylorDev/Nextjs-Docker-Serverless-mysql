import cloudinary from "@/libs/cloudinary";
import { conn } from "@/libs/mysql";
import { processImage } from "@/libs/processImage";
import { unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
type ProductRequest = {
  name: string;
  description: string;
  price: number;
  insertId?: number;
};

export async function GET(request: NextRequest, { params }) {
  try {
    const productId = params.id;

    // Query to get the product by ID
    const result = await conn.query("SELECT * FROM products WHERE id = ?", [
      productId,
    ]);

    // Check if the product exists
    if (result.length === 0) {
      return NextResponse.json("Producto no encontrado", { status: 404 });
    }

    return NextResponse.json(result[0]); // Return the first product found
  } catch (error) {
    console.error("Error retrieving product:", error);
    return NextResponse.json("Error retrieving product", { status: 500 });
  }
}
export async function DELETE(request: NextRequest, { params }) {
  try {
    const productId = params.id;

    // Execute delete query
    const result = await conn.query("DELETE FROM products WHERE id = ?", [
      productId,
    ]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return NextResponse.json("Product not found", { status: 404 });
    }

    return NextResponse.json("Product deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json("Error deleting product", { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let updateData: any = {};
    const contentType = request.headers.get("Content-Type");

    if (contentType?.includes("multipart/form-data")) {
      const data = await request.formData();
      const image = data.get("file"); // Cambié "image" a "file" para coincidir con el código anterior.

      updateData = {
        name: data.get("name"),
        price: parseFloat(data.get("price") as string),
        description: data.get("description"),
      };

      // Validar campos obligatorios
      if (!updateData.name) {
        return NextResponse.json(
          {
            message: "Name is required",
          },
          {
            status: 400,
          }
        );
      }

      // Manejar la carga de imagen si se proporciona
      if (image) {
        const buffer = await processImage(image); // Suponiendo que processImage está definido
        const res = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                resource_type: "image",
              },
              (err, result) => {
                if (err) {
                  console.log(err);
                  reject(err);
                }
                resolve(result);
              }
            )
            .end(buffer);
        });

        updateData.image = res.secure_url; // Agregar la URL de la imagen a updateData
      }
    } else if (contentType?.includes("application/json")) {
      const jsonData = await request.json();
      updateData = {
        name: jsonData.name,
        price: parseFloat(jsonData.price),
        description: jsonData.description,
      };

      // Validar campos obligatorios
      if (!updateData.name) {
        return NextResponse.json(
          {
            message: "Name is required",
          },
          {
            status: 400,
          }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Unsupported Content-Type",
        },
        {
          status: 415,
        }
      );
    }

    // Actualizar el producto en la base de datos
    const result = await conn.query("UPDATE products SET ? WHERE id = ?", [
      updateData,
      params.id,
    ]);

    // Comprobar si se afectaron filas
    if (result.affectedRows === 0) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        {
          status: 404,
        }
      );
    }

    // Consulta para obtener el producto actualizado
    const [updatedProduct] = await conn.query(
      "SELECT * FROM products WHERE id = ?",
      [params.id]
    );

    // Devolver el producto actualizado
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: 500 }
    );
  }
}
