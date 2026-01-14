/**
 * Comprehensive list of car makes and their models
 * Used for search forms and autocomplete
 */

export interface CarMake {
  value: string;
  label: string;
  models: string[];
}

export const CAR_MAKES: CarMake[] = [
  {
    value: "acura",
    label: "Acura",
    models: ["ILX", "TLX", "RLX", "RDX", "MDX", "ZDX", "NSX", "Integra", "TSX", "RSX", "RL", "TL", "CL", "Legend", "Vigor"],
  },
  {
    value: "alfa-romeo",
    label: "Alfa Romeo",
    models: ["Giulia", "Stelvio", "4C", "Spider", "Giulietta", "MiTo", "159", "Brera", "GT", "147", "166"],
  },
  {
    value: "aston-martin",
    label: "Aston Martin",
    models: ["DB11", "DBS", "Vantage", "Rapide", "Vanquish", "DB9", "DB7", "V8 Vantage", "Lagonda"],
  },
  {
    value: "audi",
    label: "Audi",
    models: ["A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "e-tron", "R8", "TT", "S3", "S4", "S5", "S6", "S7", "S8", "RS3", "RS4", "RS5", "RS6", "RS7", "Q4 e-tron", "Q2"],
  },
  {
    value: "bentley",
    label: "Bentley",
    models: ["Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "Arnage", "Azure"],
  },
  {
    value: "bmw",
    label: "BMW",
    models: ["1 Series", "2 Series", "3 Series", "4 Series", "5 Series", "6 Series", "7 Series", "8 Series", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "M2", "M3", "M4", "M5", "M6", "M8", "X3 M", "X4 M", "X5 M", "X6 M"],
  },
  {
    value: "buick",
    label: "Buick",
    models: ["Encore", "Encore GX", "Envision", "Enclave", "Regal", "LaCrosse", "Verano", "Lucerne", "Rendezvous", "Rainier", "Terraza"],
  },
  {
    value: "cadillac",
    label: "Cadillac",
    models: ["CT4", "CT5", "CT6", "XT4", "XT5", "XT6", "Escalade", "ATS", "CTS", "XTS", "SRX", "DTS", "STS", "DeVille"],
  },
  {
    value: "chevrolet",
    label: "Chevrolet",
    models: ["Camaro", "Corvette", "Malibu", "Impala", "Cruze", "Spark", "Sonic", "Equinox", "Traverse", "Tahoe", "Suburban", "Trax", "Blazer", "Silverado", "Colorado", "Bolt EV", "Bolt EUV"],
  },
  {
    value: "chrysler",
    label: "Chrysler",
    models: ["300", "Pacifica", "Voyager", "200", "Town & Country", "Sebring", "PT Cruiser", "Concorde", "Intrepid", "LHS"],
  },
  {
    value: "dodge",
    label: "Dodge",
    models: ["Charger", "Challenger", "Durango", "Journey", "Grand Caravan", "Dart", "Avenger", "Caliber", "Magnum", "Stratus", "Neon", "Intrepid"],
  },
  {
    value: "ferrari",
    label: "Ferrari",
    models: ["488", "F8 Tributo", "SF90 Stradale", "Roma", "Portofino", "GTC4Lusso", "812 Superfast", "LaFerrari", "458", "California", "FF"],
  },
  {
    value: "fiat",
    label: "Fiat",
    models: ["500", "500e", "500X", "500L", "124 Spider", "Panda", "Punto", "Tipo", "Bravo", "Stilo"],
  },
  {
    value: "ford",
    label: "Ford",
    models: ["Mustang", "F-150", "F-250", "F-350", "Escape", "Explorer", "Expedition", "Edge", "Bronco", "Ranger", "Maverick", "Fusion", "Focus", "Fiesta", "Taurus", "Edge", "EcoSport", "Mach-E", "Bronco Sport"],
  },
  {
    value: "genesis",
    label: "Genesis",
    models: ["G70", "G80", "G90", "GV70", "GV80"],
  },
  {
    value: "gmc",
    label: "GMC",
    models: ["Sierra", "Canyon", "Yukon", "Yukon XL", "Acadia", "Terrain", "Envoy", "Acadia", "Sierra 1500", "Sierra 2500", "Sierra 3500"],
  },
  {
    value: "honda",
    label: "Honda",
    models: ["Civic", "Accord", "CR-V", "Pilot", "Odyssey", "Ridgeline", "HR-V", "Passport", "Fit", "Insight", "Clarity", "Element", "S2000", "Prelude", "CR-Z"],
  },
  {
    value: "hyundai",
    label: "Hyundai",
    models: ["Elantra", "Sonata", "Accent", "Veloster", "Kona", "Tucson", "Santa Fe", "Palisade", "Venue", "Ioniq", "Ioniq 5", "Ioniq 6", "Genesis", "Azera", "Equus"],
  },
  {
    value: "infiniti",
    label: "Infiniti",
    models: ["Q50", "Q60", "Q70", "QX50", "QX60", "QX80", "G37", "G35", "M37", "M35", "FX", "EX", "JX"],
  },
  {
    value: "jaguar",
    label: "Jaguar",
    models: ["XE", "XF", "XJ", "F-Pace", "E-Pace", "I-Pace", "F-Type", "XK", "S-Type", "X-Type"],
  },
  {
    value: "jeep",
    label: "Jeep",
    models: ["Wrangler", "Grand Cherokee", "Cherokee", "Compass", "Renegade", "Gladiator", "Wagoneer", "Grand Wagoneer", "Liberty", "Patriot", "Commander"],
  },
  {
    value: "kia",
    label: "Kia",
    models: ["Rio", "Forte", "Optima", "K5", "Stinger", "Soul", "Seltos", "Sportage", "Sorento", "Telluride", "Carnival", "EV6", "Niro", "Cadenza", "K900"],
  },
  {
    value: "lamborghini",
    label: "Lamborghini",
    models: ["Huracán", "Aventador", "Urus", "Gallardo", "Murciélago", "Countach", "Diablo"],
  },
  {
    value: "land-rover",
    label: "Land Rover",
    models: ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar", "LR4", "LR3", "LR2"],
  },
  {
    value: "lexus",
    label: "Lexus",
    models: ["IS", "ES", "GS", "LS", "RC", "LC", "UX", "NX", "RX", "GX", "LX", "CT", "HS", "SC"],
  },
  {
    value: "lincoln",
    label: "Lincoln",
    models: ["Continental", "MKZ", "Aviator", "Nautilus", "Corsair", "Navigator", "MKT", "MKS", "MKX", "MKX"],
  },
  {
    value: "mazda",
    label: "Mazda",
    models: ["Mazda3", "Mazda6", "CX-3", "CX-5", "CX-9", "CX-30", "MX-5 Miata", "CX-50", "RX-8", "RX-7", "MPV"],
  },
  {
    value: "mclaren",
    label: "McLaren",
    models: ["570S", "720S", "GT", "Artura", "765LT", "600LT", "650S", "MP4-12C", "P1"],
  },
  {
    value: "mercedes-benz",
    label: "Mercedes-Benz",
    models: ["A-Class", "C-Class", "E-Class", "S-Class", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "G-Class", "SL", "SLC", "AMG GT", "EQC", "EQS", "EQE"],
  },
  {
    value: "mini",
    label: "MINI",
    models: ["Cooper", "Cooper S", "Countryman", "Clubman", "Paceman", "Roadster", "Coupe", "Convertible"],
  },
  {
    value: "mitsubishi",
    label: "Mitsubishi",
    models: ["Mirage", "Lancer", "Outlander", "Outlander Sport", "Eclipse Cross", "Endeavor", "Galant", "Montero"],
  },
  {
    value: "nissan",
    label: "Nissan",
    models: ["Altima", "Sentra", "Maxima", "Versa", "Rogue", "Rogue Sport", "Murano", "Pathfinder", "Armada", "Frontier", "Titan", "Leaf", "370Z", "350Z", "Quest", "Xterra"],
  },
  {
    value: "porsche",
    label: "Porsche",
    models: ["911", "718 Boxster", "718 Cayman", "Panamera", "Cayenne", "Macan", "Taycan", "Carrera", "Cayman", "Boxster"],
  },
  {
    value: "ram",
    label: "Ram",
    models: ["1500", "2500", "3500", "ProMaster", "ProMaster City"],
  },
  {
    value: "rivian",
    label: "Rivian",
    models: ["R1T", "R1S"],
  },
  {
    value: "rolls-royce",
    label: "Rolls-Royce",
    models: ["Ghost", "Wraith", "Dawn", "Cullinan", "Phantom"],
  },
  {
    value: "subaru",
    label: "Subaru",
    models: ["Impreza", "Legacy", "Outback", "Forester", "Crosstrek", "Ascent", "WRX", "BRZ", "Baja", "Tribeca"],
  },
  {
    value: "tesla",
    label: "Tesla",
    models: ["Model S", "Model 3", "Model X", "Model Y", "Roadster", "Cybertruck"],
  },
  {
    value: "toyota",
    label: "Toyota",
    models: ["Camry", "Corolla", "Prius", "Avalon", "RAV4", "Highlander", "4Runner", "Sequoia", "Land Cruiser", "Tacoma", "Tundra", "Sienna", "Venza", "C-HR", "GR Supra", "GR86", "bZ4X"],
  },
  {
    value: "volkswagen",
    label: "Volkswagen",
    models: ["Jetta", "Passat", "Arteon", "Golf", "GTI", "Golf R", "Tiguan", "Atlas", "Atlas Cross Sport", "ID.4", "Beetle", "CC", "Eos", "Touareg"],
  },
  {
    value: "volvo",
    label: "Volvo",
    models: ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90", "C30", "C70", "S40", "S80"],
  },
];

/**
 * Get all makes as options for dropdown
 */
export function getMakeOptions() {
  return [
    { value: "", label: "All Makes" },
    ...CAR_MAKES.map((make) => ({
      value: make.value,
      label: make.label,
    })),
  ];
}

/**
 * Get models for a specific make
 */
export function getModelsForMake(makeValue: string): { value: string; label: string }[] {
  if (!makeValue) {
    return [{ value: "", label: "All Models" }];
  }

  const make = CAR_MAKES.find((m) => m.value === makeValue.toLowerCase());
  if (!make) {
    return [{ value: "", label: "All Models" }];
  }

  return [
    { value: "", label: "All Models" },
    ...make.models.map((model) => ({
      value: model.toLowerCase(),
      label: model,
    })),
  ];
}

/**
 * Filter models based on search query
 */
export function filterModelsForMake(
  makeValue: string,
  searchQuery: string
): { value: string; label: string }[] {
  const allModels = getModelsForMake(makeValue);
  if (!searchQuery) {
    return allModels;
  }

  const query = searchQuery.toLowerCase();
  return allModels.filter(
    (model) =>
      model.value === "" || // Always include "All Models"
      model.label.toLowerCase().includes(query)
  );
}
