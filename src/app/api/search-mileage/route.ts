import { buildQueryParams } from "@/utils";
import { z } from "zod";

export async function GET(req: Request): Promise<Response> {
  const schema = z.object({
    originAirport: z.string({
      required_error: "origin airports (comma-separated) is required",
    }),
    destinationAirport: z.string({
      required_error: "destination airports (comma-separated) is required",
    }),
    departureDate: z
      .string({
        required_error: "origin airports (comma-separated) is required",
      })
      .date("date must follow the format YYYY-MM-DD"),
  });

  try {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const schemaValidationResult = schema.safeParse(query);

    if (!schemaValidationResult.success) {
      const errorMessages = schemaValidationResult.error.errors.map(
        (e) => e.message,
      );
      return Response.json(
        {
          code: 400,
          errorMessages: errorMessages,
        },
        {
          status: 400,
        },
      );
    }

    const queryString = buildQueryParams({
      origin_airport: query.originAirport,
      destination_airport: query.destinationAirport,
      start_date: query.departureDate,
      end_date: query.departureDate,
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
      economyMileageCost: parseInt(d.YMileageCost, 10),
      premiumMileageCost: parseInt(d.WMileageCost, 10),
      businessMileageCost: parseInt(d.JMileageCost, 10),
      firstMileageCost: parseInt(d.FMileageCost, 10),
      taxesCurrency: d.TaxesCurrency,
      economyTaxCost: d.YTotalTaxes,
      premiumTaxCost: d.WTotalTaxes,
      businessTaxCost: d.JTotalTaxes,
      firstTaxCost: d.FTotalTaxes,
      economyRemainingSeats: d.YRemainingSeats,
      premiumRemainingSeats: d.WRemainingSeats,
      businessRemainingSeats: d.JRemainingSeats,
      firstRemainingSeats: d.FRemainingSeats,
    }));

    return Response.json({
      code: 200,
      data: result,
    });
  } catch {
    return Response.json(
      {
        code: 500,
        errorMessages: [
          "Error occured when fetching mileages. Please try again.",
        ],
      },
      {
        status: 500,
      },
    );
  }
}
