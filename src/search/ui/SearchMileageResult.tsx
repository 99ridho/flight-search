"use client";

import { buildQueryParams } from "@/utils";
import { MileageSearchParam } from "../types";
import { useEffect, useState } from "react";

export default function SearchMileageResult(props: {
  searchParams: MileageSearchParam | null | undefined;
}) {
  const [result, setResult] = useState();

  useEffect(() => {
    if (props.searchParams) {
      const queryParams = buildQueryParams(props.searchParams);
      const fetchResult = async () => {
        const result = await fetch(`api/search-mileage?${queryParams}`);
        setResult(await result.json());
      };

      fetchResult();
    }
  }, [props.searchParams]);

  if (props.searchParams) {
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
  }

  return null;
}
