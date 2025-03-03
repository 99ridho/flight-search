export type MileageSearchParam = {
  originAirports: string[];
  destinationAirports: string[];
  departureDate: string; // yyyy-MM-dd
};

export type MileageRoute = {
  ID: string;
  originAirport: string;
  originRegion: string;
  destinationAirport: string;
  destinationRegion: string;
  numsDayOut: number;
  distance: number;
  source: string;
};

export type MileageEntry = {
  ID: string;
  routeID: string;
  route: MileageRoute;
  date: string;
  parsedDate: string;
  isEconomyAvailable: boolean;
  isPremiumAvailable: boolean;
  isBusinessAvailable: boolean;
  isFirstAvailable: boolean;
  economyMileageCost: number;
  premiumMileageCost: number;
  businessMileageCost: number;
  firstMileageCost: number;
  taxesCurrency: string;
  economyTaxCost: number;
  premiumTaxCost: number;
  businessTaxCost: number;
  firstTaxCost: number;
};

export type MileageResponse = {
  code: number;
  data: MileageEntry[] | undefined;
  errorMessage: string | undefined;
};
