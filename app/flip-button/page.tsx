"use client";
import { useRouter } from "next/navigation";
import { ShimmerButton } from "@/components/ui/shimmer-button"
export default function contribution() {
  const router = useRouter();

  return (
<div className="mx-auto w-full h-full flex align-middle justify-center p-30">  

<ShimmerButton 
  flipContent="Flipped!"
  flipFrom="top"
  > Contribution</ShimmerButton>
  
</div> 
)
}