import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Education } from "@/components/sections/education";
import { Contact } from "@/components/sections/contact";
import Summary from "@/components/sections/summary";
import Social from "@/components/ui/social";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="space-y-10 container mx-auto">
      <Hero />
      <Social />
      <Separator className="mt-20! sm:mt-50!"/>
      <Summary />
      <Separator />
      <About />
      <Separator />
      <Experience />
      <Separator />
      <Projects />
      <Separator />
      <Education />
      <Separator />
      <Skills />
      <Separator />
      <Contact />
    </main>
  );
}
