"use server"

import { redirect } from 'next/navigation';

export async function handleButton() {
      'use server'; //penggunaan server

      //server tidak bisa lansung ke client

      console.log("Test Raihan");
      redirect("/profile/settings")
}