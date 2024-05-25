//route dianggap sebagai controller
import { NextResponse } from "next/server";

export async function GET() {
      //return response berupa json
      return NextResponse.json({message : "Success GET",data:[]});
}

//API with POST method
export async function POST() {
      return NextResponse.json({message: "Success POST",data:[]});
}