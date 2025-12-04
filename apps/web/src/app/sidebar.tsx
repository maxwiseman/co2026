"use client";

import { IconSearch, type ReactNode } from "@tabler/icons-react";
import { groupBy } from "lodash";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { fuzzySearch } from "@/lib/search";

const data: { name: string; school: string; major: string }[] = [
  { name: "Jawad Tabaja", school: "Dartmouth", major: "Biochemistry" },
  { name: "Jawad Tabaja", school: "Dartmouth", major: "Biochemistry" },
  { name: "Jawad Tabaja", school: "Dartmouth", major: "Biochemistry" },
  { name: "Grayson Graham", school: "University of TN", major: "Business" },
  { name: "Grayson Graham", school: "University of TN", major: "Business" },
  { name: "Grayson Graham", school: "University of TN", major: "Business" },
];

export function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredStudents = fuzzySearch(
    searchQuery,
    data,
    (c) => `${c.name} ${c.school} ${c.major}`
  ).map((i) => i.item);

  return (
    <div className="flex h-full w-xs flex-col border-r">
      <InputGroup className="h-auto rounded-none border-b border-none p-2 px-1 shadow-none">
        <InputGroupAddon>
          <IconSearch />
        </InputGroupAddon>
        <InputGroupInput
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          placeholder="Search..."
          value={searchQuery}
        />
      </InputGroup>
      <div className="relative grow">
        <div className="absolute inset-0 overflow-x-clip overflow-y-scroll">
          {Object.entries(groupBy(filteredStudents, "school")).map(
            ([school, students]) => (
              <SidebarItemGroup key={school} title={school}>
                {students.map((student) => (
                  <SidebarItem key={student.name} {...student} />
                ))}
              </SidebarItemGroup>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function SidebarItemGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="sticky top-0 z-10 line-clamp-1 border-y bg-card px-4 text-muted-foreground">
        {title}
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function SidebarItem({ name, major }: { name: string; major: string }) {
  return (
    <div>
      <Button
        className="h-auto w-full justify-start rounded-none border-none px-4 py-4 shadow-none"
        size="lg"
        variant="outline"
      >
        <Avatar className="size-10 border">
          <AvatarFallback>
            {name
              .split(" ")
              .map((w) => w.at(0))
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="text-start">
          <div className="text-lg">{name}</div>
          <div className="text-muted-foreground">{major}</div>
        </div>
      </Button>
    </div>
  );
}
