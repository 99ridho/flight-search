import { buildQueryParams } from "@/utils";

export async function GET(req: Request): Promise<Response> {
  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());

    const queryString = buildQueryParams({
      origin_airport: query.origin_airport,
      destination_airport: query.destination_airport,
      start_date: query.departure_date,
      end_date: query.departure_date,
    });
    const seatsAeroUrl = `https://seats.aero/partnerapi/search?${queryString}`;
    const response = await fetch(seatsAeroUrl, {
      method: "GET",
      headers: {
        "Partner-Authorization": process.env.SEATS_API_KEY ?? "",
        Accept: "application/json",
      },
    });

    const responseData = await response.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = responseData.data.map((d: any) => ({
      ID: d.ID,
      routeID: d.RouteID,
      route: {
        ID: d.Route.ID,
        originAirport: d.Route.OriginAirport,
        originRegion: d.Route.OriginRegion,
        destinationAirport: d.Route.DestinationAirport,
        destinationRegion: d.Route.DestinationRegion,
        numsDayOut: d.Route.NumDaysOut,
        distance: d.Route.Distance,
        source: d.Route.Source,
      },
      date: d.Date,
      parsedDate: d.ParsedDate,
      isEconomyAvailable: d.YAvailable,
      isPremiumAvailable: d.WAvailable,
      isBusinessAvailable: d.JAvailable,
      isFirstAvailable: d.FAvailable,
      economyMileageCost: d.YMileageCostRaw,
      premiumMileageCost: d.WMileageCostRaw,
      businessMileageCost: d.JMileageCostRaw,
      firstMileageCost: d.FMileageCostRaw,
      taxesCurrency: d.TaxesCurrency,
      economyTaxCost: d.YTotalTaxes,
      premiumTaxCost: d.WTotalTaxes,
      businessTaxCost: d.JTotalTaxes,
      firstTaxCost: d.FTotalTaxes,
    }));

    return Response.json({
      code: 200,
      data: result,
    });
  } catch {
    return Response.json(
      {
        code: 500,
        errorMessage:
          "Terjadi kesalahan ketika melakukan pencarian mileage. Silahkan coba beberapa saat lagi",
      },
      {
        status: 500,
      },
    );
  }
}
