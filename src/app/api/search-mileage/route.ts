import { MileageEntry } from "@/search/types";
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
    minimumFees: z.optional(z.coerce.number()),
    maximumFees: z.optional(z.coerce.number()),
    onlyDirectFlights: z.optional(z.boolean()),
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

    const calculateTaxes = (taxes: number) => {
      return taxes / 100;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: MileageEntry[] = responseData.data.map((d: any) => ({
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
      economyTaxCost: calculateTaxes(d.YTotalTaxes),
      premiumTaxCost: calculateTaxes(d.WTotalTaxes),
      businessTaxCost: calculateTaxes(d.JTotalTaxes),
      firstTaxCost: calculateTaxes(d.FTotalTaxes),
      economyRemainingSeats: d.YRemainingSeats,
      premiumRemainingSeats: d.WRemainingSeats,
      businessRemainingSeats: d.JRemainingSeats,
      firstRemainingSeats: d.FRemainingSeats,
      economyDirectFlight: d.YDirect,
      premiumDirectFlight: d.WDirect,
      businessDirectFlight: d.JDirect,
      firstDirectFlight: d.FDirect,
    }));

    if (query.minimumFees) {
      const minimumFees = parseInt(query.minimumFees, 10);
      results = results.filter((r) => {
        return (
          r.economyTaxCost >= minimumFees ||
          r.premiumTaxCost >= minimumFees ||
          r.businessTaxCost >= minimumFees ||
          r.firstTaxCost >= minimumFees
        );
      });
    }

    if (query.maximumFees) {
      const maximumFees = parseInt(query.maximumFees, 10);
      results = results.filter((r) => {
        return (
          r.economyTaxCost <= maximumFees ||
          r.premiumTaxCost <= maximumFees ||
          r.businessTaxCost <= maximumFees ||
          r.firstTaxCost <= maximumFees
        );
      });
    }

    if (query.onlyDirectFlights) {
      results = results.filter((r) => {
        return (
          r.economyDirect === true ||
          r.premiumDirect === true ||
          r.businessDirect === true ||
          r.firstDirect === true
        );
      });
    }

    return Response.json({
      code: 200,
      data: results,
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
