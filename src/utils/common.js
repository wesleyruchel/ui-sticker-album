export function sqlServerDateTimeFormat(dateString) {
  const date = new Date(parseDate(dateString));
  const isoString = date.toISOString();
  return isoString.split("T")[0] + "T00:00:00";
}

function parseDate(input) {
  const [day, month, year] = input.split("/");
  return new Date(`${year}-${month}-${day}`);
}
