import { NextRequest, NextResponse } from "next/server";

import { userBaseSchema } from "@/utils/types/users";
import { prisma } from "@/utils/configs/db";

interface DataToUpdate {
  name: string;
  address: string;
  image?: string;
}

export const GET = async (request: NextRequest) => {
  try {
    // TODO: Protect this endpoint (admin only)
    const data = await prisma.user.findMany({
      cacheStrategy: { ttl: 60 },
    });

    const totalCount = await prisma.user.count();
    const totalPages = Math.ceil(totalCount / 10);

    return NextResponse.json({
      message: "Successfully get users",
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
        message: "Get users failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
};

export const PUT = async (request: NextRequest) => {
  try {
    // TODO: Protect this endpoint
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const checkImage = formData.get("image") as File;
    let image: File | undefined;

    if (checkImage.size !== 0) {
      image = checkImage;
    }

    const validatedFields = userBaseSchema.safeParse({
      name,
      address,
      image,
    });

    if (!validatedFields.success) {
      return NextResponse.json(
        {
          message: "Edit profile failed, please check your input again",
          reason: validatedFields.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    let dataToUpdate: DataToUpdate = {
      name,
      address,
    };

    if (image) {
      // TODO: Upload image to cloudinary
    }

    const data = await prisma.user.update({
      where: {
        id: "", // TODO: Get user ID from auth
      },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Successfully edited profile",
      data,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        message: "Edit profile failed, please try again later",
        reason: (error as Error).message,
      },
      { status: 500 }
    );
  }
};
