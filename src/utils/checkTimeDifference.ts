import { DateTime } from 'luxon'
export function checkTimeDifference(time: string) {
  const dateString = time;
  const pastDateTime = DateTime.fromISO(dateString);
  const currentDateTime = DateTime.now();

  // Calculate the difference in minutes
  const diff = currentDateTime.diff(pastDateTime, 'minutes').toObject();
  const minutesPassed = Math.floor(diff.minutes);

  // Determine the appropriate time unit
  let timeAgo;
  if (minutesPassed < 60 && minutesPassed > 0) {
    timeAgo = `${minutesPassed}m`;
  } else if (minutesPassed <= 0) {
    timeAgo = "Just now"
  } else if (minutesPassed < 1440) {
    const hoursPassed = Math.floor(minutesPassed / 60);
    timeAgo = `${hoursPassed}h`;
  } else {
    const daysPassed = Math.floor(minutesPassed / 1440);
    timeAgo = `${daysPassed}d`;
  }

  return timeAgo
}


