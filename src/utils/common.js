export function sqlServerDateTimeFormat(dateString) {
  const date = new Date(parseDate(dateString));
  const isoString = date.toISOString();
  return isoString.split("T")[0] + "T00:00:00";
}

export function sqlServerDateTimeFormatToDDMMYYYY(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDate(input) {
  const [day, month, year] = input.split("/");
  return new Date(`${year}-${month}-${day}`);
}
