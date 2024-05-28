import { CategorySchema, categorySchema } from "@/utils/types/categories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

      return NextResponse.json({message : "Success GET",data:[]});
}

export async function POST(request: NextRequest) {
      

      try {
            // TODO : protect admin only

            const {name} = (await request.json()) as CategorySchema;

            const validatedFields  = categorySchema.safeParse({
                  name,
            });

            if (!validatedFields.success) {
                  return NextResponse.json({
                        message : "Add category failed, please check you input again",
                        reason : validatedFields.error.flatten().fieldErrors, 
                  }, 
                  {status : 400}
            );
            }

            // TODO : Create new record
            
            return NextResponse.json({
                  message : "Successfully added category to database",
                  data:[], 
                  reason:null
            });

      } catch (error) {

            console.error(error);
            
            return NextResponse.json({
                        message : "Add category failed, please try again later",
                        data: null,
                        reason : (error as Error).message, 
            },{status:500});
      }
}