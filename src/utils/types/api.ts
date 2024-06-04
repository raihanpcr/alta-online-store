import { Session } from "next-auth";
import { NextRequest } from "next/server";

export interface NextAuthRequest extends NextRequest {
      auth: Session | null
}