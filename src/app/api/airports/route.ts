import airports from "./airports.json";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const airportSearchQuery = url.searchParams.get("q") as string;

  if (airportSearchQuery === "") {
    return Response.json([]);
  }

  const airportCodesAndNames = Object.values(airports)
    .filter((value) => {
      return value.iata !== "";
    })
    .filter((value) => {
      return value.name
        .toLowerCase()
        .includes(airportSearchQuery.toLowerCase());
    })
    .map((value) => {
      return {
        code: value.iata,
        name: value.name,
      };
    });

  return Response.json(airportCodesAndNames);
}
