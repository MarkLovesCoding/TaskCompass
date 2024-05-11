import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";
import { TImageCategories } from "@/app/dashboard/[id]/BackgroundImageMenu";
type TBodyRequest = {
  category: TImageCategories;
  page: number;
  perPage: number;
};
export async function POST(req: Request): Promise<any> {
  const body: TBodyRequest = await req.json();
  const { category = "nature", page = 1, perPage = 12 } = body;
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
  });

  const data = await unsplash.search
    .getPhotos({
      query: category,
      page: page,
      perPage: perPage,
      orientation: "landscape",
    })
    .then((result) => {
      const data = result!.response!.results;
      return data;
    })
    .catch((err: any) => {
      return NextResponse.json({ message: "Error", err }, { status: 500 });
    });

  return NextResponse.json(data, { status: 200 });
}
