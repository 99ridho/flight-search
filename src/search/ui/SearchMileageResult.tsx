"use client";

import { MileageResponse, MileageSearchParam } from "../types";
import { useEffect, useState } from "react";
import { doSearchMileage } from "../searchMileage";

export default function SearchMileageResult(props: {
  searchParams: MileageSearchParam | null | undefined;
}) {
  const [result, setResult] = useState<MileageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!props.searchParams) {
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await doSearchMileage(
          props.searchParams as MileageSearchParam,
        );
        if (result.errorMessages && result.errorMessages.length > 0) {
          setError(result.errorMessages.join("\n"));
        } else {
          setResult({ ...result });
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [props.searchParams]);

  if (!props.searchParams) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">Error: {error}</div>;
  }

  const data = result?.data;
  if (!data) {
    return <div className="text-center py-4">No results found.</div>;
  }

  const getChipClass = (available: boolean, seats: number) => {
    if (!available) return "bg-red-600 text-white px-2 py-1 rounded";
    if (seats > 5) return "bg-green-600 text-white px-2 py-1 rounded";
    return "bg-yellow-500 text-white px-2 py-1 rounded";
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="overflow-x-auto pb-4">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-400">
          <tr>
            <th className="p-3 text-left">Date</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">Departure</th>
            <th className="p-3 text-left">Arrival</th>
            <th className="p-3 text-left">Economy</th>
            <th className="p-3 text-left">Premium</th>
            <th className="p-3 text-left">Business</th>
            <th className="p-3 text-left">First</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((flight) => (
            <tr key={flight.ID} className="border-b">
              <td className="p-3">{flight.date}</td>
              <td className="p-3">{flight.route.source}</td>
              <td className="p-3">{flight.route.originAirport}</td>
              <td className="p-3">{flight.route.destinationAirport}</td>
              <td className="p-3">
                <span
                  className={getChipClass(
                    flight.isEconomyAvailable,
                    flight.economyRemainingSeats,
                  )}
                >
                  {flight.isEconomyAvailable
                    ? `${flight.economyMileageCost} miles (${flight.economyRemainingSeats} remaining)`
                    : "Not Available"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={getChipClass(
                    flight.isPremiumAvailable,
                    flight.premiumRemainingSeats,
                  )}
                >
                  {flight.isPremiumAvailable
                    ? `${flight.premiumMileageCost} miles (${flight.premiumRemainingSeats} remaining)`
                    : "Not Available"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={getChipClass(
                    flight.isBusinessAvailable,
                    flight.businessRemainingSeats,
                  )}
                >
                  {flight.isBusinessAvailable
                    ? `${flight.businessMileageCost} miles (${flight.businessRemainingSeats} remaining)`
                    : "Not Available"}
                </span>
              </td>
              <td className="p-3">
                <span
                  className={getChipClass(
                    flight.isFirstAvailable,
                    flight.firstRemainingSeats,
                  )}
                >
                  {flight.isFirstAvailable
                    ? `${flight.firstMileageCost} miles (${flight.firstRemainingSeats} remaining)`
                    : "Not Available"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 space-x-2">
        <button
          className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={`px-4 py-2 bg-gray-300 rounded ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"}`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
