import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/utils/configs/db";

interface Params {
  params: { user_id: string };
}

export async function GET(request: NextRequest, context: Params) {
  try {
    // TODO: Protect this endpoint (admin only)
    const { user_id } = context.params;

    const data = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
      cacheStrategy: { ttl: 60 },
    });

    if (!data) {
      return NextResponse.json(
        {
          message: "Get user failed, data not found",
          reason:
            "The user you're trying to retrieve might not have been created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Successfully get user",
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Get user failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
