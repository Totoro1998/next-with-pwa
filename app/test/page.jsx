"use client";

import { useState } from "react";

import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";

export default function Page() {
  const [selected, setSelected] = useState();
  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="flex">
      <DayPicker
        mode="single"
        classNames={{
          today: `border-amber-500`, // Add a border to today's date
          selected: `bg-amber-500 border-amber-500 text-white`, // Highlight the selected day
          root: `${defaultClassNames.root} p-2`, // Add a shadow to the root element
          chevron: `${defaultClassNames.chevron} fill-amber-500`, // Change the color of the chevron
        }}
        selected={selected}
        onSelect={setSelected}
        //   footer={selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."}
      />
    </div>
  );
}
