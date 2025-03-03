"use client";

import { useRef, useState } from "react";
import Select from "react-select";
import { debounce } from "lodash";

export default function SearchMileageForm(props: {
  onSubmit: (params: {
    origin: string;
    destination: string;
    departureDate: string;
  }) => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [airportOptions, setAirportOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const [destinationAirports, setDestinationAirports] = useState<
    { value: string; label: string }[]
  >([]);

  const [originAirports, setOriginAirports] = useState<
    { value: string; label: string }[]
  >([]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const data = {
      origin: originAirports.map((v) => v.value).join(","),
      destination: destinationAirports.map((v) => v.value).join(","),
      departureDate: formData.get("date") as string,
    };

    props.onSubmit(data);
  };

  const fetchAirports = debounce(async (query: string) => {
    const result = await fetch(`api/airports?q=${query}`);
    const data = await result.json();
    const options = data.map((v: { code: string; name: string }) => {
      return {
        value: v.code,
        label: v.name,
      };
    });

    setAirportOptions(options);
  }, 500);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-gray-100 p-4 rounded-lg border border-gray-800 w-[90vw]"
    >
      <div className="flex flex-row items-start gap-2">
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Origin</p>
          <Select
            isMulti
            name="origin"
            options={airportOptions}
            className="basic-multi-select px-3 py-2 border rounded-md w-full"
            classNamePrefix="select"
            onInputChange={fetchAirports}
            onChange={(values) => {
              setOriginAirports(values as { value: string; label: string }[]);
            }}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: "42px", // Matches the input field height
              }),
            }}
          />
        </div>
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Destination</p>
          <Select
            isMulti
            name="destination"
            options={airportOptions}
            className="basic-multi-select px-3 py-2 border rounded-md w-full"
            classNamePrefix="select"
            onInputChange={fetchAirports}
            onChange={(values) => {
              setDestinationAirports(
                values as { value: string; label: string }[],
              );
            }}
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: "42px", // Matches the input field height
              }),
            }}
          />
        </div>
        <div className="flex flex-col gap-y-1 flex-1">
          <p className="text-sm">Departure Date</p>
          <input
            type={"date"}
            name={"date"}
            placeholder={"Departure Date"}
            className="px-3 py-2 border rounded-md w-full h-[60px]"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex-none w-[10%]"
      >
        Search
      </button>
    </form>
  );
}
