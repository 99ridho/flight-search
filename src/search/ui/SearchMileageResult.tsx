"use client";

import { MileageResponse, MileageSearchParam } from "../types";
import { useEffect, useState } from "react";
import { doSearchMileage } from "../searchMileage";

export default function SearchMileageResult(props: {
  searchParams: MileageSearchParam | null | undefined;
}) {
  const [result, setResult] = useState<MileageResponse>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!props.searchParams) {
      return;
    }

    const fetchResult = async () => {
      const result = await doSearchMileage(
        props.searchParams as MileageSearchParam,
      );
      setResult({ ...result });
    };

    fetchResult();
  }, [props.searchParams]);

  if (!props.searchParams) {
    return null;
  }

  const data = result?.data;
  if (!data) {
    return null;
  }

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
                {flight.isEconomyAvailable
                  ? `${flight.economyMileageCost} miles`
                  : "Not Available"}
              </td>
              <td className="p-3">
                {flight.isPremiumAvailable
                  ? `${flight.premiumMileageCost} miles`
                  : "Not Available"}
              </td>
              <td className="p-3">
                {flight.isBusinessAvailable
                  ? `${flight.businessMileageCost} miles`
                  : "Not Available"}
              </td>
              <td className="p-3">
                {flight.isFirstAvailable
                  ? `${flight.firstMileageCost} miles`
                  : "Not Available"}
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
