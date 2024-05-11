import { NextResponse } from "next/server";
import { createApi } from "unsplash-js";

type TBodyRequest = {
  download_location: string;
};
export async function POST(req: Request): Promise<any> {
  const body: TBodyRequest = await req.json();
  const { download_location } = body;
  const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
  });
  try {
    const res = await unsplash.photos.trackDownload({
      downloadLocation: download_location,
    });
    return NextResponse.json({ status: res }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
