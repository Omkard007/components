"use client";
import { FlipButton } from "@/components/flip-button/flip-button"
export default function contribution() {
  return (
<div className="mx-auto w-full h-full flex align-middle justify-center p-30">  

<FlipButton 
  flipContent="Flipped!"
  flipFrom="top"
  > Contribution</FlipButton>
  
</div> 
)
}
