import { AnimatedTestimonials } from "@/components/cli-footer/testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Gitfolio has transformed our team's workflow. It's a game-changer for productivity.",
      name: "Shubham Bhilare",
      designation: "Founder of Gitfolio | FolioKit ",
      src: "https://avatars.githubusercontent.com/u/140585267?v=4",
    },
    {
      quote:
        "Not here to showcase but only to code.",
      name: "Omkar Dhumal",
      designation: "Founder of Foliokit | Co-founder of Gitfolio",
      src: "https://avatars.githubusercontent.com/u/175608647?v=4",
    },
    {
      quote:
        "The inspiration for youth to design and animate Ui of nextlevel",
      name: "Manu Paaji",
      designation: "Founder of Aceternity UI",
      src: "https://avatars.githubusercontent.com/u/23276437?v=4",
    },
    {
      quote:
        "The man, the myth, the legend himself of the indian Coding industry ",
      name: "Harkirat Singh",
      designation: "Founder of 100xSchool",
      src: "https://yt3.googleusercontent.com/C25u3DcSguL-wd3GaO110Q1fyO5ClTraTjtF72kJhZtpQwuAv3zLmb7K-ZLJecQQJBVvP1McmA=s900-c-k-c0x00ffffff-no-rj",
    },
    {
      quote:
        "the one who owns the computer",
      name: "Shadcn",
      designation: "founder of Shadcn Ui",
      src: "https://avatars.githubusercontent.com/u/124599?v=4",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
