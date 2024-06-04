import { NextRequest, NextResponse } from "next/server";

import { productSchema } from "@/utils/types/product";
import { fileUploader, isNoAuth } from "@/utils/function";
import { prisma } from "@/utils/configs/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      cacheStrategy: { ttl: 60 },
    });

    const totalCount = await prisma.product.count();
    const totalPages = Math.ceil(totalCount / 10);

    return NextResponse.json({
      message: "Successfully get products",
      metadata: {
        total_count: totalCount,
        total_pages: totalPages,
      },
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Get products failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export const POST = auth(async function POST(request) {
  try {
    if (isNoAuth(request.auth)) {
      return NextResponse.json(
        {
          message: "You need to signin to access this endpoint",
          data: null,
          reason: "Not authenticated",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const image = formData.get("image") as File;
    const category_id = formData.get("category_id") as string;

    const validatedFields = productSchema.safeParse({
      name,
      description,
      price,
      image: image ?? undefined,
      category_id,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Add product failed, please check your input again",
          data: null,
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let imageUrl = null;
    if (image) {
      const uploadFile = await fileUploader(image, {
        folder: "hipotesa-product",
      });
      imageUrl = uploadFile.data;
    }

    const data = await prisma.product.create({
      data: {
        name,
        description,
        price,
        image: imageUrl,
        category_id: +category_id!,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully added product to database",
        data,
        reason: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Add product failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
});
