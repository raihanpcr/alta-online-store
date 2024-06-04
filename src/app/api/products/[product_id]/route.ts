import { NextRequest, NextResponse } from "next/server";

import { productSchema } from "@/utils/types/product";
import { prisma } from "@/utils/configs/db";
import { fileUploader, nullIfError } from "@/utils/function";

interface Params {
  params: { product_id: string };
}
interface DataToUpdate {
  name: string;
  description: string;
  price: string;
  category_id: number;
  image?: string;
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { product_id } = params;

    const data = await prisma.product.findFirst({
      where: {
        id: product_id,
      },
      include: {
        category: {
          select: { name: true },
        },
      },
      cacheStrategy: { ttl: 60 },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Get product failed, data not found",
          reason:
            "The product you're trying to retrieve might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully get product",
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Get product failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint (admin only)
    const { product_id } = params;
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = formData.get("price") as string;
    const checkImage = formData.get("image") as File;
    const category_id = formData.get("category_id") as string;
    let image: File | undefined;

    if (checkImage.size !== 0) {
      image = checkImage;
    }

    const validatedFields = productSchema.safeParse({
      name,
      description,
      price,
      image: image,
      category_id,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Edit product failed, please check your input again",
          data: null,
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let dataToUpdate: DataToUpdate = {
      name,
      description,
      price,
      category_id: +category_id!,
    };

    if (image) {
      const uploadFile = await fileUploader(image, {
        folder: "hipotesa-product",
      });
      dataToUpdate.image = uploadFile.data;
    }

    const data = await nullIfError(prisma.product.update)({
      where: {
        id: product_id,
      },
      data: dataToUpdate,
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Edit product failed, data not found",
          reason:
            "The product you're trying to update might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully edited product",
      data,
      reason: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Edit product failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint (admin only)

    const { product_id } = params;

    const data = await nullIfError(prisma.product.delete)({
      where: {
        id: product_id,
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Delete product failed, data not found",
          reason:
            "The product you're trying to delete might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully deleted product",
      data,
      reason: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Delete product failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
