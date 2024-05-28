//route dianggap sebagai controller
import { ProductSchema } from "@/utils/types/product";
import { request } from "http";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

      // TODO : Create reusable function to handle query params
      const seacrhParams = request.nextUrl.searchParams;

      console.log(seacrhParams.get('page'))
      //return response berupa json
      return NextResponse.json({ message: "Success GET", data: [] });
}

//API with POST method
export async function POST(request: NextRequest) {
      try {
            // TODO : protect admin only

            const formData = await request.formData();

            const name = formData.get("name") as string

            const description = formData.get("description") as string

            const price = formData.get("price") as string

            const image = formData.get("image") as File

            const category_id = formData.get("category_id") as string


            const validatedFields = ProductSchema.safeParse({
                  name,
                  description,
                  price,
                  image: image ?? undefined,
                  category_id
            });

            if (!validatedFields.success) {
                  return NextResponse.json({
                        message: "Add product failed, please check you input again",
                        reason: validatedFields.error.flatten().fieldErrors,
                  },
                        { status: 400 }
                  )
            }

            let imageUrl = null

            if (image) {
                  // TODO : Upload image to cloudinary
            }


            // TODO : Create new record on databases

            return NextResponse.json({
                  message: "Successfully added product to database",
                  data: [],
                  reason: null
            });

      } catch (error) {

            return NextResponse.json({
                  message: "Add product failed, please try again later",
                  data: null,
                  reason: (error as Error).message,
            }, { status: 500 });
      }
}