import dayjs from 'dayjs';

export const getRandomDate = (startYear, endYear) => {
  const randomYear = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const randomMonth = Math.floor(Math.random() * 12);
  const randomDay = Math.floor(Math.random() * 28) + 1;
  const randomDate = new Date(Date.UTC(randomYear, randomMonth, randomDay, 0, 0, 0, 0));
  return randomDate.toISOString();
};

export const getCurrentTime = () => {
  const currentDate = new Date();
  return currentDate.toISOString();
};

export const dateToMDY = (date) => dayjs(date).format('MMMM D YYYY');
export const dateToY = (date) => dayjs(date).format('YYYY');
export const dateToRelativeTime = (date) => {
  const dateFromData = dayjs(date);
  const now = dayjs();
  const diffInDays = now.diff(dateFromData, 'day');
  let relativeTimeText;
  switch (diffInDays) {
    case 0:
      relativeTimeText = 'today';
      break;
    case 1:
      relativeTimeText = 'yesterday';
      break;
    default:
      relativeTimeText = `${diffInDays} days ago`;
      break;
  }
  return relativeTimeText;
};
