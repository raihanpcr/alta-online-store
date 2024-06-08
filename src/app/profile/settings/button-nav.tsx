"use server"

import React from 'react'
import { auth } from "@/auth"
import { Button, buttonVariants } from '@/components/ui/button';

import Link from 'next/link';
import { handleButton } from '@/utils/actions/handle';

export default function ButtonNav() {
  return (
      <form action={handleButton}>
        <Button type='submit'>Edit Profile</Button>
      </form>
  )
}
