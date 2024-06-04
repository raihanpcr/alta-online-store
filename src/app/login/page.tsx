import React from "react";

import { Button } from "@/components/ui/button";

import { signIn, providerMap } from "@/auth";

export default function Page() {
      return (
            <div className="flex flex-col space-y-2">
                  
                  {Object.values(providerMap).map((provider) =>(
                        <form
                        key={provider.id} 
                        action={async () => {
                        "use server"
                        await signIn(provider.id);
                  }}
                  >
                        <Button key={provider.id}>Sign In With {provider.name}</Button>
                  </form>
                  ))}
            </div>
      )
      
}