export const locationSuggestions = [
  // Kosovo
  "Prishtina, Kosovo", "Prizren, Kosovo", "Peja, Kosovo", "Gjakova, Kosovo", "Mitrovica, Kosovo", "Gjilan, Kosovo", "Ferizaj, Kosovo", "Podujeva, Kosovo", "Vushtrri, Kosovo", "Deçan, Kosovo",
  // Albania
  "Tirana, Albania", "Durres, Albania", "Vlora, Albania", "Shkoder, Albania", "Saranda, Albania", "Fier, Albania", "Korça, Albania", "Elbasan, Albania", "Berat, Albania", "Gjirokastra, Albania",
  // Germany
  "Berlin, Germany", "Munich, Germany", "Hamburg, Germany", "Frankfurt, Germany", "Cologne, Germany", "Stuttgart, Germany", "Düsseldorf, Germany", "Leipzig, Germany", "Dortmund, Germany", "Essen, Germany", "Bremen, Germany", "Dresden, Germany", "Hannover, Germany", "Nuremberg, Germany", "Tuttlingen, Germany", "Mannheim, Germany", "Karlsruhe, Germany", "Freiburg, Germany", "Ulm, Germany", "Heidelberg, Germany", "Bonn, Germany", "Bielefeld, Germany", "Münster, Germany",
  // Switzerland
  "Zurich, Switzerland", "Geneva, Switzerland", "Basel, Switzerland", "Lausanne, Switzerland", "Bern, Switzerland", "Winterthur, Switzerland", "Lucerne, Switzerland", "St. Gallen, Switzerland", "Lugano, Switzerland", "Biel/Bienne, Switzerland",
  // Austria
  "Vienna, Austria", "Graz, Austria", "Linz, Austria", "Salzburg, Austria", "Innsbruck, Austria", "Klagenfurt, Austria", "Villach, Austria", "Wels, Austria",
  // Rest of Europe
  "Skopje, North Macedonia", "Ohrid, North Macedonia", "Tetovo, North Macedonia",
  "Podgorica, Montenegro", "Budva, Montenegro", "Kotor, Montenegro",
  "Dubrovnik, Croatia", "Split, Croatia", "Zagreb, Croatia", "Zadar, Croatia",
  "Belgrade, Serbia", "Novi Sad, Serbia", "Nis, Serbia",
  "Sarajevo, Bosnia and Herzegovina", "Mostar, Bosnia and Herzegovina", "Banja Luka, Bosnia and Herzegovina",
  "Ljubljana, Slovenia", "Lake Bled, Slovenia", "Maribor, Slovenia",
  "Athens, Greece", "Santorini, Greece", "Mykonos, Greece", "Thessaloniki, Greece", "Crete, Greece", "Rhodes, Greece",
  "Rome, Italy", "Milan, Italy", "Venice, Italy", "Florence, Italy", "Naples, Italy", "Turin, Italy", "Bologna, Italy",
  "Paris, France", "Nice, France", "Lyon, France", "Marseille, France", "Toulouse, France", "Bordeaux, France",
  "Barcelona, Spain", "Madrid, Spain", "Seville, Spain", "Valencia, Spain", "Bilbao, Spain", "Malaga, Spain",
  "Lisbon, Portugal", "Porto, Portugal", "Faro, Portugal",
  "London, United Kingdom", "Manchester, United Kingdom", "Edinburgh, United Kingdom", "Birmingham, United Kingdom", "Glasgow, United Kingdom", "Liverpool, United Kingdom",
  "Dublin, Ireland", "Cork, Ireland",
  "Amsterdam, Netherlands", "Rotterdam, Netherlands", "The Hague, Netherlands", "Utrecht, Netherlands",
  "Brussels, Belgium", "Antwerp, Belgium", "Ghent, Belgium", "Bruges, Belgium",
  "Prague, Czech Republic", "Brno, Czech Republic",
  "Budapest, Hungary", "Debrecen, Hungary",
  "Warsaw, Poland", "Krakow, Poland", "Wroclaw, Poland", "Poznan, Poland", "Gdansk, Poland",
  "Bucharest, Romania", "Cluj-Napoca, Romania", "Timisoara, Romania",
  "Sofia, Bulgaria", "Plovdiv, Bulgaria", "Varna, Bulgaria",
  "Istanbul, Turkey", "Antalya, Turkey", "Cappadocia, Turkey", "Ankara, Turkey", "Izmir, Turkey",
  "Stockholm, Sweden", "Gothenburg, Sweden",
  "Oslo, Norway", "Bergen, Norway",
  "Copenhagen, Denmark", "Aarhus, Denmark",
  "Helsinki, Finland", "Espoo, Finland",
  // Global
  "Dubai, United Arab Emirates", "Abu Dhabi, United Arab Emirates",
  "Doha, Qatar",
  "Cairo, Egypt", "Alexandria, Egypt",
  "Marrakesh, Morocco", "Casablanca, Morocco",
  "Cape Town, South Africa", "Johannesburg, South Africa",
  "New York, United States", "Los Angeles, United States", "Chicago, United States", "Miami, United States", "San Francisco, United States", "Las Vegas, United States", "Washington D.C., United States", "Boston, United States",
  "Toronto, Canada", "Vancouver, Canada", "Montreal, Canada",
  "Mexico City, Mexico", "Cancun, Mexico", "Guadalajara, Mexico",
  "Rio de Janeiro, Brazil", "Sao Paulo, Brazil",
  "Buenos Aires, Argentina", "Cordoba, Argentina",
  "Lima, Peru", "Cusco, Peru",
  "Bogota, Colombia", "Medellin, Colombia",
  "Tokyo, Japan", "Osaka, Japan", "Kyoto, Japan", "Sapporo, Japan",
  "Seoul, South Korea", "Busan, South Korea",
  "Bangkok, Thailand", "Phuket, Thailand", "Chiang Mai, Thailand",
  "Bali, Indonesia", "Jakarta, Indonesia",
  "Singapore",
  "Kuala Lumpur, Malaysia", "Penang, Malaysia",
  "Maldives",
  "Colombo, Sri Lanka",
  "Delhi, India", "Mumbai, India", "Goa, India", "Bangalore, India",
  "Kathmandu, Nepal",
  "Sydney, Australia", "Melbourne, Australia", "Brisbane, Australia", "Perth, Australia",
  "Auckland, New Zealand", "Wellington, New Zealand", "Queenstown, New Zealand"
];

/**
 * Locations Data Module
 * 
 * Contains a normalized dataset of major global cities, airports, and popular
 * travel destinations. Used to provide fast, client-side autocomplete and
 * basic validation for user inputs in the AI Form.
 */
export const normalizedLocations = [...new Set(locationSuggestions)].sort((a, b) =>
  a.localeCompare(b)
);
