import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
      return NextResponse.json({message : "Success GET",data:[]});
}

export async function POST(request: NextRequest) {
      const body = await request.json();

      console.log(body);
      return NextResponse.json({message : "Success POST",data:[]});
}