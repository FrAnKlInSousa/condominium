export function formatDate(date: string) {
  const onlyDate = date.split("T")[0];
  const [year, month, day] = onlyDate.split("-");
  return `${day}/${month}/${year}`;
}
