// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildQueryParams = (params: Record<string, any>) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value); // Append only non-empty values
  });
  return searchParams.toString();
};
