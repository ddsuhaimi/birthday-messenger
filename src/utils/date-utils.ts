import moment from "moment-timezone";

export function getNextBirthdayDate(birthday: Date, timezone: string): Date {
  const now = moment().tz(timezone);
  let nextBirthday = moment.tz(
    [
      now.year(),
      birthday.getMonth(),
      birthday.getDate(),
      9, // 9 AM
      0, // 0 minutes
      0, // 0 seconds
    ],
    timezone
  );

  // If birthday has passed this year, schedule for next year
  if (nextBirthday.isBefore(now)) {
    nextBirthday.add(1, "year");
  }

  return nextBirthday.toDate();
}
