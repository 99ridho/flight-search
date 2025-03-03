import { MileageResponse, MileageSearchParam } from "./types";
import { buildQueryParams } from "@/utils";

export async function doSearchMileage(
  params: MileageSearchParam,
): Promise<MileageResponse> {
  const queryString = buildQueryParams({
    originAirport: params.originAirports.join(","),
    destinationAirport: params.destinationAirports.join(","),
    departureDate: params.departureDate,
    minimumFees: params.minimumFees,
    maximumFees: params.maximumFees,
    onlyDirectFlights: params.directFlights,
  });

  return (await fetch(`api/search-mileage?${queryString}`)).json();
}
