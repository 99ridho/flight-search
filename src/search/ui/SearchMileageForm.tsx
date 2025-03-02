"use client";

import { useRef } from "react";

export default function SearchMileageForm(props: {
  onSubmit: (params: {
    origin: string;
    destination: string;
    departureDate: string;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      origin: formData.get("origin") as string,
      destination: formData.get("destination") as string,
      departureDate: formData.get("date") as string,
    };

    props.onSubmit(data);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-row items-center gap-2 bg-gray-100 p-4 rounded-lg border border-gray-800 w-[90vh]"
    >
      {["Origin", "Destination", "Date"].map((label, index) => (
        <div key={index} className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">{label}</p>
          <input
            type={label === "Date" ? "date" : "text"}
            name={label.toLowerCase()}
            placeholder={label}
            className="px-3 py-2 border rounded-md w-full"
          />
        </div>
      ))}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex-none w-[10%]"
      >
        Search
      </button>
    </form>
  );
}
