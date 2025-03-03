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
    <div className="flex flex-col gap-y-4">
      <SearchMileageForm
        onSubmit={(params) => {
          setSearchParams({
            departureDate: params.departureDate,
            destinationAirports: params.destination,
            originAirports: params.origin,
            minimumFees: params.minimumFees,
            maximumFees: params.maximumFees,
            directFlights: params.directFlights,
          });
        }}
      />
      {searchParams && <SearchMileageResult searchParams={searchParams} />}
    </div>
  );
}
