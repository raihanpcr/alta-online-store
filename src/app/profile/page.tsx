import React from 'react'

import ButtonNav from './button-nav';

import { auth } from "@/auth"
import { Button, buttonVariants } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import Link from 'next/link';


export default async function Page() {
  
      const session = await auth();

      async function handleButton() {
            'use server'; //penggunaan server

            console.log("Test Raihan");
            redirect("/profile/settings")
      }

      return <div>
            <p>{session?.user?.name}</p>
            <p>{session?.user?.email}</p>

            {/* <ButtonNav/> */}
            <form action={handleButton}>
                  <Button type='submit'>Edit Profile</Button>
            </form>

            {/* <a href=""></a> */}
            <Link className={buttonVariants({ variant: "outline" })} href="/profile/settings">
                  Coba Link
            </Link>
      </div>  
}
