import { conn } from "@/libs/mysql";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await conn.query("SELECT NOW()");
  if (result) {
    console.log(result);
    return NextResponse.json({ message: result[0]["NOW()"] });
  }
}
