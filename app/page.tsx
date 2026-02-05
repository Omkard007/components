"use client";
import { useRouter } from "next/navigation";
import { ShimmerButton } from "@/components/flip-button/flip-button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/accordion/accordion";
export default function contribution() {
  const router = useRouter();
    
  
  return (
    <>
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
<br/>
<ShimmerButton 
  onClick={() => router.push("/catchme-button")}
  flipContent="Flipped!"
  flipFrom="top"
  > catch-me button </ShimmerButton>
  <ShimmerButton 
  onClick={() => router.push("/accordion")}
  flipContent="Flipped!"
  flipFrom="top"
  > accordion </ShimmerButton>
<br/>
 
</div>
</>
)
}