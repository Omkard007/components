"use client";
import { useRouter } from "next/navigation";
import { FlipButton } from "@/components/flip-button/flip-button"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/accordion/accordion";
import FallingText from "@/components/ui/falling-text";
export default function contribution() {
  const router = useRouter();


  return (
    <>
      <div className="mx-auto w-full h-full flex align-middle justify-center p-30">



        <FlipButton
          onClick={() => router.push("/contribution")}
          flipContent="Flipped!"
          flipFrom="top"
        > Contribution</FlipButton>
        <br />
        <FlipButton
          onClick={() => router.push("/flip-button")}
          flipContent="Flipped!"
          flipFrom="top"
        > Flip-button</FlipButton>
        <br />
        <FlipButton
          onClick={() => router.push("/footer")}
          flipContent="Flipped!"
          flipFrom="top"
        > Footer</FlipButton>
        <br />
        <FlipButton
          onClick={() => router.push("/testimonials")}
          flipContent="Flipped!"
          flipFrom="top"
        > terstimonials</FlipButton>
        <br />
        <FlipButton
          onClick={() => router.push("/cli-footer")}
          flipContent="Flipped!"
          flipFrom="top"
        > cli-footer</FlipButton>
        <br />
        <br />
        <FlipButton
          onClick={() => router.push("/catchme-button")}
          flipContent="Flipped!"
          flipFrom="top"
        > catch-me button </FlipButton>
        <FlipButton
          onClick={() => router.push("/accordion")}
          flipContent="Flipped!"
          flipFrom="top"
        > accordion </FlipButton>
        <br />






      </div>

      <div className="flex min-h-[400px] w-full items-center justify-center">
        <FallingText
          text="Welcome to FolioKit, the ultimate playground for UI components!"
          highlightWords={["FolioKit", "playground", "UI", "components!"]}
          trigger="auto"
          fontSize="3rem"
          enableShadows={true}
          shadowIntensity={0.7}
        />
      </div>
    </>
  )
}