export function formatDate(timestamp) {
  if (timestamp == 0) {
    return "N/A";
  }
  const date = new Date(timestamp * 1000);
  return date.toLocaleString();
}
