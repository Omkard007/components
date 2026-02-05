"use client";
import { useRouter } from "next/navigation";
import { ShimmerButton } from "@/components/ui/shimmer-button"
import { MaskedAvatars } from "@/components/cli-footer/footer"
export default function contribution() {
  const router = useRouter();
    
  
  return (
<div className="mx-auto w-full h-full flex align-middle justify-center p-30">  

  

<ShimmerButton 
onClick={() => router.push("/contribution")}
  flipContent="Flipped!"
  flipFrom="top"
  > Contribution</ShimmerButton>
  <br/>
  <ShimmerButton 
  onClick={() => router.push("/flip-button")}
  flipContent="Flipped!"
  flipFrom="top"
  > Flip-button</ShimmerButton>
<br/>
<ShimmerButton 
  onClick={() => router.push("/footer")}
  flipContent="Flipped!"
  flipFrom="top"
  > Footer</ShimmerButton>
<br/>
<ShimmerButton 
  onClick={() => router.push("/testimonials")}
  flipContent="Flipped!"
  flipFrom="top"
  > terstimonials</ShimmerButton>
<br/>
<ShimmerButton 
  onClick={() => router.push("/cli-footer")}
  flipContent="Flipped!"
  flipFrom="top"
  > cli-footer</ShimmerButton>
<br/>


</div> 


)
}