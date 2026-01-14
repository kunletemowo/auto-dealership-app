/**
 * Canadian cities and postal codes for autocomplete
 * Includes major cities and common postal code prefixes
 */

export interface LocationOption {
  value: string;
  label: string;
  city: string;
  region: string;
  postalCodePrefix?: string;
  latitude?: number;
  longitude?: number;
}

export const CANADIAN_LOCATIONS: LocationOption[] = [
  // Ontario
  { value: "toronto-on", label: "Toronto, ON", city: "Toronto", region: "Ontario", postalCodePrefix: "M" },
  { value: "ottawa-on", label: "Ottawa, ON", city: "Ottawa", region: "Ontario", postalCodePrefix: "K" },
  { value: "mississauga-on", label: "Mississauga, ON", city: "Mississauga", region: "Ontario", postalCodePrefix: "L" },
  { value: "brampton-on", label: "Brampton, ON", city: "Brampton", region: "Ontario", postalCodePrefix: "L" },
  { value: "hamilton-on", label: "Hamilton, ON", city: "Hamilton", region: "Ontario", postalCodePrefix: "L" },
  { value: "london-on", label: "London, ON", city: "London", region: "Ontario", postalCodePrefix: "N" },
  { value: "markham-on", label: "Markham, ON", city: "Markham", region: "Ontario", postalCodePrefix: "L" },
  { value: "vaughan-on", label: "Vaughan, ON", city: "Vaughan", region: "Ontario", postalCodePrefix: "L" },
  { value: "kitchener-on", label: "Kitchener, ON", city: "Kitchener", region: "Ontario", postalCodePrefix: "N" },
  { value: "windsor-on", label: "Windsor, ON", city: "Windsor", region: "Ontario", postalCodePrefix: "N" },
  { value: "richmond-hill-on", label: "Richmond Hill, ON", city: "Richmond Hill", region: "Ontario", postalCodePrefix: "L" },
  { value: "oakville-on", label: "Oakville, ON", city: "Oakville", region: "Ontario", postalCodePrefix: "L" },
  { value: "burlington-on", label: "Burlington, ON", city: "Burlington", region: "Ontario", postalCodePrefix: "L" },
  { value: "oshawa-on", label: "Oshawa, ON", city: "Oshawa", region: "Ontario", postalCodePrefix: "L" },
  { value: "st-catharines-on", label: "St. Catharines, ON", city: "St. Catharines", region: "Ontario", postalCodePrefix: "L" },
  { value: "cambridge-on", label: "Cambridge, ON", city: "Cambridge", region: "Ontario", postalCodePrefix: "N" },
  { value: "guelph-on", label: "Guelph, ON", city: "Guelph", region: "Ontario", postalCodePrefix: "N" },
  { value: "barrie-on", label: "Barrie, ON", city: "Barrie", region: "Ontario", postalCodePrefix: "L" },
  { value: "kingston-on", label: "Kingston, ON", city: "Kingston", region: "Ontario", postalCodePrefix: "K" },
  { value: "peterborough-on", label: "Peterborough, ON", city: "Peterborough", region: "Ontario", postalCodePrefix: "K" },
  { value: "thunder-bay-on", label: "Thunder Bay, ON", city: "Thunder Bay", region: "Ontario", postalCodePrefix: "P" },
  
  // Quebec
  { value: "montreal-qc", label: "Montreal, QC", city: "Montreal", region: "Quebec", postalCodePrefix: "H" },
  { value: "quebec-city-qc", label: "Quebec City, QC", city: "Quebec City", region: "Quebec", postalCodePrefix: "G" },
  { value: "laval-qc", label: "Laval, QC", city: "Laval", region: "Quebec", postalCodePrefix: "H" },
  { value: "gatineau-qc", label: "Gatineau, QC", city: "Gatineau", region: "Quebec", postalCodePrefix: "J" },
  { value: "longueuil-qc", label: "Longueuil, QC", city: "Longueuil", region: "Quebec", postalCodePrefix: "J" },
  { value: "sherbrooke-qc", label: "Sherbrooke, QC", city: "Sherbrooke", region: "Quebec", postalCodePrefix: "J" },
  { value: "saguenay-qc", label: "Saguenay, QC", city: "Saguenay", region: "Quebec", postalCodePrefix: "G" },
  { value: "trois-rivieres-qc", label: "Trois-Rivières, QC", city: "Trois-Rivières", region: "Quebec", postalCodePrefix: "G" },
  
  // British Columbia
  { value: "vancouver-bc", label: "Vancouver, BC", city: "Vancouver", region: "British Columbia", postalCodePrefix: "V" },
  { value: "surrey-bc", label: "Surrey, BC", city: "Surrey", region: "British Columbia", postalCodePrefix: "V" },
  { value: "burnaby-bc", label: "Burnaby, BC", city: "Burnaby", region: "British Columbia", postalCodePrefix: "V" },
  { value: "richmond-bc", label: "Richmond, BC", city: "Richmond", region: "British Columbia", postalCodePrefix: "V" },
  { value: "langley-bc", label: "Langley, BC", city: "Langley", region: "British Columbia", postalCodePrefix: "V" },
  { value: "coquitlam-bc", label: "Coquitlam, BC", city: "Coquitlam", region: "British Columbia", postalCodePrefix: "V" },
  { value: "abbotsford-bc", label: "Abbotsford, BC", city: "Abbotsford", region: "British Columbia", postalCodePrefix: "V" },
  { value: "kelowna-bc", label: "Kelowna, BC", city: "Kelowna", region: "British Columbia", postalCodePrefix: "V" },
  { value: "victoria-bc", label: "Victoria, BC", city: "Victoria", region: "British Columbia", postalCodePrefix: "V" },
  { value: "nanaimo-bc", label: "Nanaimo, BC", city: "Nanaimo", region: "British Columbia", postalCodePrefix: "V" },
  
  // Alberta
  { value: "calgary-ab", label: "Calgary, AB", city: "Calgary", region: "Alberta", postalCodePrefix: "T" },
  { value: "edmonton-ab", label: "Edmonton, AB", city: "Edmonton", region: "Alberta", postalCodePrefix: "T" },
  { value: "red-deer-ab", label: "Red Deer, AB", city: "Red Deer", region: "Alberta", postalCodePrefix: "T" },
  { value: "lethbridge-ab", label: "Lethbridge, AB", city: "Lethbridge", region: "Alberta", postalCodePrefix: "T" },
  { value: "st-albert-ab", label: "St. Albert, AB", city: "St. Albert", region: "Alberta", postalCodePrefix: "T" },
  { value: "medicine-hat-ab", label: "Medicine Hat, AB", city: "Medicine Hat", region: "Alberta", postalCodePrefix: "T" },
  { value: "grande-prairie-ab", label: "Grande Prairie, AB", city: "Grande Prairie", region: "Alberta", postalCodePrefix: "T" },
  
  // Manitoba
  { value: "winnipeg-mb", label: "Winnipeg, MB", city: "Winnipeg", region: "Manitoba", postalCodePrefix: "R" },
  { value: "brandon-mb", label: "Brandon, MB", city: "Brandon", region: "Manitoba", postalCodePrefix: "R" },
  
  // Saskatchewan
  { value: "saskatoon-sk", label: "Saskatoon, SK", city: "Saskatoon", region: "Saskatchewan", postalCodePrefix: "S" },
  { value: "regina-sk", label: "Regina, SK", city: "Regina", region: "Saskatchewan", postalCodePrefix: "S" },
  { value: "prince-albert-sk", label: "Prince Albert, SK", city: "Prince Albert", region: "Saskatchewan", postalCodePrefix: "S" },
  
  // Nova Scotia
  { value: "halifax-ns", label: "Halifax, NS", city: "Halifax", region: "Nova Scotia", postalCodePrefix: "B" },
  { value: "dartmouth-ns", label: "Dartmouth, NS", city: "Dartmouth", region: "Nova Scotia", postalCodePrefix: "B" },
  
  // New Brunswick
  { value: "saint-john-nb", label: "Saint John, NB", city: "Saint John", region: "New Brunswick", postalCodePrefix: "E" },
  { value: "moncton-nb", label: "Moncton, NB", city: "Moncton", region: "New Brunswick", postalCodePrefix: "E" },
  { value: "fredericton-nb", label: "Fredericton, NB", city: "Fredericton", region: "New Brunswick", postalCodePrefix: "E" },
  
  // Newfoundland and Labrador
  { value: "st-johns-nl", label: "St. John's, NL", city: "St. John's", region: "Newfoundland and Labrador", postalCodePrefix: "A" },
  
  // Prince Edward Island
  { value: "charlottetown-pe", label: "Charlottetown, PE", city: "Charlottetown", region: "Prince Edward Island", postalCodePrefix: "C" },
  
  // Northwest Territories
  { value: "yellowknife-nt", label: "Yellowknife, NT", city: "Yellowknife", region: "Northwest Territories", postalCodePrefix: "X" },
  
  // Yukon
  { value: "whitehorse-yt", label: "Whitehorse, YT", city: "Whitehorse", region: "Yukon", postalCodePrefix: "Y" },
  
  // Nunavut
  { value: "iqaluit-nu", label: "Iqaluit, NU", city: "Iqaluit", region: "Nunavut", postalCodePrefix: "X" },
];

/**
 * Filter locations based on search query (city, region, or postal code prefix)
 */
export function filterLocations(query: string): LocationOption[] {
  if (!query) {
    return CANADIAN_LOCATIONS;
  }

  const lowerQuery = query.toLowerCase().trim();
  
  return CANADIAN_LOCATIONS.filter((location) => {
    const cityMatch = location.city.toLowerCase().includes(lowerQuery);
    const regionMatch = location.region.toLowerCase().includes(lowerQuery);
    const labelMatch = location.label.toLowerCase().includes(lowerQuery);
    const postalMatch = location.postalCodePrefix?.toLowerCase().includes(lowerQuery);
    
    // Also check if query matches a postal code pattern (e.g., "M5H" or "M5H 2N2")
    const postalCodePattern = /^[a-z]\d[a-z]\s*\d[a-z]\d$/i;
    const isPostalCodePattern = postalCodePattern.test(lowerQuery);
    
    if (isPostalCodePattern) {
      // Extract first character of postal code and match
      const firstChar = lowerQuery.charAt(0);
      return location.postalCodePrefix?.toLowerCase() === firstChar;
    }
    
    return cityMatch || regionMatch || labelMatch || postalMatch;
  });
}

/**
 * Get location display string
 */
export function getLocationDisplay(location: LocationOption): string {
  return location.label;
}
