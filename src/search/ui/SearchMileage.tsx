"use client";

import { useState } from "react";
import SearchMileageForm from "./SearchMileageForm";
import { MileageSearchParam } from "../types";
import SearchMileageResult from "./SearchMileageResult";

export default function SearchMileage() {
  const [searchParams, setSearchParams] = useState<
    MileageSearchParam | null | undefined
  >();

  return (
    <div className="flex flex-col">
      <SearchMileageForm
        onSubmit={(params) => {
          setSearchParams({
            departureDate: params.departureDate,
            destinationAirport: params.destination,
            originAirport: params.origin,
          });
        }}
      />
      {searchParams && <SearchMileageResult searchParams={searchParams} />}
    </div>
  );
}
