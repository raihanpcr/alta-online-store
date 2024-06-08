import { NextResponse, NextRequest } from "next/server";

import { CartSchema, cartSchema } from "@/utils/types/carts";
import { nullIfError } from "@/utils/functions";
import { prisma } from "@/utils/configs/db";

interface Params {
  params: { item_id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint

    const { quantity } = (await request.json()) as CartSchema;
    const { item_id } = params;

    const validatedFields = cartSchema.safeParse({
      quantity,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Update item failed, please check your input again",
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = await nullIfError(prisma.cartItem.update)({
      where: {
        id: +item_id,
      },
      data: { quantity },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Update item failed, data not found",
          reason:
            "The item you're trying to update might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully updated item",
      data: null,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Update item failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    // TODO: Protect this endpoint

    const { item_id } = params;

    const data = await nullIfError(prisma.cartItem.delete)({
      where: {
        id: +item_id,
      },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Delete item failed, data not found",
          reason:
            "The item you're trying to delete might not have been added to cart yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully deleted item from cart",
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Delete item failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
