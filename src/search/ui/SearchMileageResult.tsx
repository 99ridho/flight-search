"use client";

import { MileageResponse, MileageSearchParam } from "../types";
import { useEffect, useState } from "react";
import { doSearchMileage } from "../searchMileage";

export default function SearchMileageResult(props: {
  searchParams: MileageSearchParam | null | undefined;
}) {
  const [result, setResult] = useState<MileageResponse>();

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

  if (props.searchParams) {
    return <pre>{JSON.stringify(result, null, 2)}</pre>;
  }

  return null;
}
