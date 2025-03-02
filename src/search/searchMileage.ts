import { MileageResponse, MileageSearchParam } from "./types";
import { buildQueryParams } from "@/utils";

export async function doSearchMileage(
  params: MileageSearchParam,
): Promise<MileageResponse> {
  const queryString = buildQueryParams({
    origin_airport: params.originAirport,
    destination_airport: params.destinationAirport,
    departure_date: params.departureDate,
  });

  return (await fetch(`api/search-mileage?${queryString}`)).json();
}
