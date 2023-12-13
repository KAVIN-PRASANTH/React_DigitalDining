function getISTDateTime() {

  const now = new Date();
  const options = {
    timeZone: 'Asia/Kolkata',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  const ISTDateTime = now.toLocaleString('en-IN', options);
  let [date, time] = ISTDateTime.split(', ');
  let [day, month, year] = date.split("/");
  date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`

  return {
    date,
    time
  };
}
module.exports = getISTDateTime;