import { NextRequest, NextResponse } from "next/server";

import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { isNoAuth } from "@/utils/functions";
import { prisma } from "@/utils/configs/db";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  try {
    const data = await prisma.category.findMany({
      cacheStrategy: { ttl: 60 },
    });

    return NextResponse.json({
      message: "Successfully get categories",
      data,
      reason: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Get categories failed, please try again later",
        data: null,
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

    const { name } = (await request.json()) as CategorySchema;

    const validatedFields = categorySchema.safeParse({
      name,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Add category failed, please check your input again",
          data: null,
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = await prisma.category.create({
      data: {
        name,
      },
    });

    return NextResponse.json(
      {
        message: "Successfully added category to database",
        data,
        reason: null,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Add category failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
});
