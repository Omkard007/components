//note - use inside layout.tsx at bottom after <children> and other attributes
"use client";

import { MaskedAvatars } from "@/components/cta-footer/footer";


export default function MaskedAvatarsDemo() {
const avatars = [
  { avatar: "https://avatars.githubusercontent.com/u/140585267?v=4", name: "Founder_Shubham" },
  { avatar: "https://avatars.githubusercontent.com/u/175608647?v=4", name: "Founder_Omkar" },
  { avatar: "https://avatars.githubusercontent.com/u/23276437?v=4", name: "Manu Paaji" },
  { avatar: "https://yt3.googleusercontent.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s900-c-k-c0x00ffffff-no-rj", name: "Harkirat" },
  { avatar: "https://avatars.githubusercontent.com/u/124599?v=4", name: "Shadcn" },
];

return (
  <div className="relative flex pt-[100px] w-full items-center justify-center overflow-hidden bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-neutral-800">
    <MaskedAvatars avatars={avatars} />
  </div>
);
}