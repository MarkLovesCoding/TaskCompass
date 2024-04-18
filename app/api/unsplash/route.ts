import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
export async function POST(req: Request): Promise<any> {
  // const query = "nature";
  console.log(">>>>IN UNSPLASH API GET");
  //@ts-ignore
  const body = await req.json();
  // const query: { page: number; perPage: number } = body;
  const { page = 1, perPage = 12 } = body;
  console.log(">>>>BODYpagem perpage", page, perPage);
  try {
    console.log("TRY DATA ON SERVER");

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=nature&orientation=landscape&page=${page}&per_page=${perPage}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );

    const data = await response.json();
    console.log(">>>>>>>>>DATA ON SERVER", data);
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.log(">>>>ERR", err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
