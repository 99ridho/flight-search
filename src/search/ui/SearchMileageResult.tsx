"use client";

import { MileageResponse, MileageSearchParam } from "../types";
import { useEffect, useState } from "react";
import { doSearchMileage } from "../searchMileage";

export default function SearchMileageResult(props: {
  searchParams: MileageSearchParam;
}) {
  const [result, setResult] = useState<MileageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchResult = async (searchParams: MileageSearchParam) => {
    setLoading(true);
    setError(null);
    try {
      const result = await doSearchMileage(searchParams);
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

  useEffect(() => {
    if (!props.searchParams) {
      return;
    }

    fetchResult(props.searchParams);
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

  const getAvailabilityChipClass = (available: boolean) => {
    if (!available) return "bg-red-600 text-white px-2 py-1 rounded";
    return "bg-blue-500 text-white px-2 py-1 rounded";
  };

  const getRemainingSeatChipClass = (seats: number) => {
    if (seats == 0) return "bg-red-600 text-white px-2 py-1 rounded";
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
            <th className="p-3 text-center">Economy</th>
            <th className="p-3 text-center">Premium</th>
            <th className="p-3 text-center">Business</th>
            <th className="p-3 text-center">First</th>
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
                <div className="flex flex-col items-center justify-items-center gap-y-2">
                  <span
                    className={getAvailabilityChipClass(
                      flight.isEconomyAvailable,
                    )}
                  >
                    {flight.isEconomyAvailable
                      ? `${flight.economyMileageCost} miles + ${flight.taxesCurrency} ${flight.economyTaxCost}`
                      : "Not Available"}
                  </span>
                  {flight.isEconomyAvailable && (
                    <span
                      className={getRemainingSeatChipClass(
                        flight.economyRemainingSeats,
                      )}
                    >
                      {`${flight.economyRemainingSeats} remaining`}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-col items-center justify-items-center gap-y-2">
                  <span
                    className={getAvailabilityChipClass(
                      flight.isPremiumAvailable,
                    )}
                  >
                    {flight.isPremiumAvailable
                      ? `${flight.premiumMileageCost} miles + ${flight.taxesCurrency} ${flight.premiumTaxCost}`
                      : "Not Available"}
                  </span>
                  {flight.isPremiumAvailable && (
                    <span
                      className={getRemainingSeatChipClass(
                        flight.premiumRemainingSeats,
                      )}
                    >
                      {`${flight.premiumRemainingSeats} remaining`}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-col items-center justify-items-center gap-y-2">
                  <span
                    className={getAvailabilityChipClass(
                      flight.isBusinessAvailable,
                    )}
                  >
                    {flight.isBusinessAvailable
                      ? `${flight.businessMileageCost} miles + ${flight.taxesCurrency} ${flight.businessTaxCost}`
                      : "Not Available"}
                  </span>
                  {flight.isBusinessAvailable && (
                    <span
                      className={getRemainingSeatChipClass(
                        flight.businessRemainingSeats,
                      )}
                    >
                      {`${flight.businessRemainingSeats} remaining`}
                    </span>
                  )}
                </div>
              </td>
              <td className="p-3">
                <div className="flex flex-col items-center justify-items-center gap-y-2">
                  <span
                    className={getAvailabilityChipClass(
                      flight.isFirstAvailable,
                    )}
                  >
                    {flight.isFirstAvailable
                      ? `${flight.firstMileageCost} miles + ${flight.taxesCurrency} ${flight.firstTaxCost}`
                      : "Not Available"}
                  </span>
                  {flight.isFirstAvailable && (
                    <span
                      className={getRemainingSeatChipClass(
                        flight.firstRemainingSeats,
                      )}
                    >
                      {`${flight.firstRemainingSeats} remaining`}
                    </span>
                  )}
                </div>
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
