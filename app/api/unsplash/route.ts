import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";

export async function POST(req: Request): Promise<any> {
  const body = await req.json();
  const { page = 1, perPage = 12 } = body;
  const api = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
  });

  const data = await api.search
    .getPhotos({
      query: "nature",
      page: page,
      perPage: perPage,
      orientation: "landscape",
    })
    .then((result) => {
      const data = result!.response!.results;
      console.log("DATA_SERVER22", [...data]);
      return data;
    })
    .catch((err: any) => {
      return NextResponse.json({ message: "Error", err }, { status: 500 });
    });

  return NextResponse.json(data, { status: 200 });
}
