"use client";

import type { ComponentProps, JSXElementConstructor, ReactNode } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Sidebar } from "./sidebar";

export default function Page() {
  return (
    <div className="grid h-full grid-cols-[auto_1fr]">
      <Sidebar />
      <div className="mx-auto w-2xl p-8 py-16">
        <div className="mb-16 flex w-full flex-col items-center">
          <Avatar className="mb-6 size-24">
            <AvatarFallback className="font-medium text-4xl">GG</AvatarFallback>
          </Avatar>
          <div className="mb-2 font-bold text-4xl">Grayson Graham</div>
          <div className="font-medium text-muted-foreground text-xl">
            University of Tennessee
          </div>
          <div className="text-muted-foreground">Business ⋅ Class of 2030</div>
        </div>
        <div className="flex flex-col gap-4">
          <ContactFieldGroup>
            <ContactField title="phone">(123) 456-7890</ContactField>
            <ContactField
              as="a"
              href="mailto:john.doe@example.com"
              title="email"
            >
              john.doe@example.com
            </ContactField>
          </ContactFieldGroup>
          <ContactFieldGroup>
            <ContactField
              as="a"
              href="https://www.instagram.com/grayson_graham01/"
              title="Instagram"
            >
              grayson_graham01
            </ContactField>
          </ContactFieldGroup>
        </div>
      </div>
    </div>
  );
}

function ContactFieldGroup({ children }: { children?: ReactNode }) {
  return <Card className="flex flex-col gap-4 p-4">{children}</Card>;
}
function ContactField<
  // biome-ignore lint/suspicious/noExplicitAny: That's what we're trying to do here
  T extends JSXElementConstructor<any> | keyof React.JSX.IntrinsicElements,
>({
  title,
  children,
  as,
  ...props
}: {
  title: string;
  children: ReactNode;
  as?: T;
} & ComponentProps<T>) {
  if (!children) {
    return null;
  }
  const Component = as ?? "div";
  return (
    <Component {...props}>
      <div className="select-auto text-muted-foreground text-sm">{title}</div>
      {children}
    </Component>
  );
}
