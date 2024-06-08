import { NextRequest, NextResponse } from "next/server";

import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { nullIfError, isNoAuth } from "@/utils/functions";
import { NextAuthRequest } from "@/utils/types/api";
import { prisma } from "@/utils/configs/db";
import { auth } from "@/auth";

interface Params {
  params: { category_id: string };
}

export async function GET(request: NextRequest, context: Params) {
  try {
    const { category_id } = context.params;

    const data = await prisma.category.findUnique({
      where: {
        id: +category_id,
      },
      cacheStrategy: { ttl: 60 },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Get category failed, data not found",
          data: null,
          reason:
            "The category you're trying to retrieve might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully get category",
      data,
      reason: null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Get category failed, please try again later",
        data: null,
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextAuthRequest, context: Params) {
  return auth(async () => {
    try {
      if (isNoAuth(request.auth, true)) {
        return NextResponse.json(
          {
            message: "You need to signin to access this endpoint",
            data: null,
            reason: "Not authenticated",
          },
          { status: 401 }
        );
      }

      const { category_id } = context.params;
      const { name } = (await request.json()) as CategorySchema;

      const validatedFields = categorySchema.safeParse({
        name,
      });

      if (!validatedFields.success) {
        return NextResponse.json(
          {
            message: "Edit category failed, please check your input again",
            data: null,
            reason: validatedFields.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }

      const data = await nullIfError(prisma.category.update)({
        where: {
          id: +category_id,
        },
        data: {
          name,
        },
      });

      if (!data) {
        return NextResponse.json(
          {
            message: "Edit category failed, data not found",
            reason:
              "The category you're trying to update might not have been created yet",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Successfully edited category",
        data,
        reason: null,
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        {
          message: "Edit category failed, please try again later",
          data: null,
          reason: (error as Error).message,
        },
        { status: 500 }
      );
    }
  })(request, context);
}

export async function DELETE(request: NextAuthRequest, context: Params) {
  return auth(async () => {
    try {
      if (isNoAuth(request.auth, true)) {
        return NextResponse.json(
          {
            message: "You need to signin to access this endpoint",
            data: null,
            reason: "Not authenticated",
          },
          { status: 401 }
        );
      }

      const { category_id } = context.params;

      const data = await nullIfError(prisma.category.delete)({
        where: {
          id: +category_id,
        },
      });

      if (!data) {
        return NextResponse.json(
          {
            message: "Delete category failed, data not found",
            reason:
              "The category you're trying to delete might not have been created yet",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Successfully deleted category",
        data,
        reason: null,
      });
    } catch (error) {
      console.error(error);

      return NextResponse.json(
        {
          message: "Delete category failed, please try again later",
          data: null,
          reason: (error as Error).message,
        },
        { status: 500 }
      );
    }
  })(request, context);
}
