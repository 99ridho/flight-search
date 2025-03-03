"use client";

import { useRef, useState } from "react";
import Select from "react-select";
import { debounce } from "lodash";
import { z } from "zod";

const searchMileageSchema = z.object({
  origin: z.array(z.string()).min(1, "At least one origin is required"),
  destination: z
    .array(z.string())
    .min(1, "At least one destination is required"),
  departureDate: z.string().min(1, "Departure date is required").date(),
});

export default function SearchMileageForm(props: {
  onSubmit: (params: {
    origin: string[];
    destination: string[];
    departureDate: string;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [airportOptions, setAirportOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [originAirports, setOriginAirports] = useState<
    { value: string; label: string }[]
  >([]);
  const [destinationAirports, setDestinationAirports] = useState<
    { value: string; label: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      origin: originAirports.map((v) => v.value),
      destination: destinationAirports.map((v) => v.value),
      departureDate: formData.get("date") as string,
    };

    // Validate data with Zod
    const result = searchMileageSchema.safeParse(data);

    if (!result.success) {
      // Map Zod errors to state
      const errorMessages: { [key: string]: string } = {};
      result.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      return;
    }

    setErrors({});
    props.onSubmit(data);
  };

  const fetchAirports = debounce(async (query: string) => {
    const result = await fetch(`api/airports?q=${query}`);
    const data = await result.json();
    const options = data.map((v: { code: string; name: string }) => ({
      value: v.code,
      label: v.name,
    }));
    setAirportOptions(options);
  }, 500);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg border border-gray-800 w-[90vw]"
    >
      <div className="flex flex-row items-start gap-2">
        {/* Origin */}
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Origin</p>
          <Select
            isMulti
            options={airportOptions}
            className="basic-multi-select px-3 py-2 border rounded-md w-full"
            classNamePrefix="select"
            onInputChange={fetchAirports}
            onChange={(values) =>
              setOriginAirports(values as { value: string; label: string }[])
            }
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: "42px", // Matches the input field height
              }),
            }}
          />
          {errors.origin && (
            <p className="text-red-500 text-sm">{errors.origin}</p>
          )}
        </div>

        {/* Destination */}
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Destination</p>
          <Select
            isMulti
            options={airportOptions}
            className="basic-multi-select px-3 py-2 border rounded-md w-full"
            classNamePrefix="select"
            onInputChange={fetchAirports}
            onChange={(values) =>
              setDestinationAirports(
                values as { value: string; label: string }[],
              )
            }
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: "42px", // Matches the input field height
              }),
            }}
          />
          {errors.destination && (
            <p className="text-red-500 text-sm">{errors.destination}</p>
          )}
        </div>

        {/* Departure Date */}
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Departure Date</p>
          <input
            type="date"
            name="date"
            className="px-3 py-2 border rounded-md w-full h-[60px]"
          />
          {errors.departureDate && (
            <p className="text-red-500 text-sm">{errors.departureDate}</p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex-none w-[10%]"
      >
        Search
      </button>
    </form>
  );
}
