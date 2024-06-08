/* eslint-disable react-hooks/rules-of-hooks */
"use client"; // akan dirender disisi client

import  React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

export default function Page() {

      //Deklarasinya harus sama urutannya
      const [count, setCount] = useState(0);
      const [word, setWord] = useState("")
      // const router = useRouter()

      return (
            <div> 
                  <Button 
                  onClick={()=>{
                        setCount(count + 1) 
                  }}>Click Me</Button>
                 
                  <input type="text" onChange={(e) => {setWord(e.target.value)}} />
                  <p>{word}</p>
                  <p>{count} time</p>
            </div>
      
      )
}
