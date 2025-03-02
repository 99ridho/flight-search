import airports from "./airports.json";

export async function GET(): Promise<Response> {
  const airportCodesAndNames = Object.values(airports)
    .filter((value) => {
      return value.iata !== "";
    })
    .map((value) => {
      return {
        code: value.iata,
        name: value.name,
      };
    });

  return Response.json(airportCodesAndNames);
}
