import { ReactNode } from "react";

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`relative z-10 w-full min-h-[150vh] flex flex-col justify-center px-8 md:px-24 ${className}`}>
      {children}
    </section>
  );
}
