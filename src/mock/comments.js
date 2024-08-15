import { getRandomBoolean, getRandomInteger, getRandomSubset } from '../utils.js';
const MAX_COMMENTS_ON_FILM = 10;

const commentEmotion = ['smile', 'sleeping', 'puke', 'angry'];

const comments = [
  {
    id: 0,
    author: 'Elena Novak',
    comment: 'Отличный фильм',
    date: '2021-09-23T12:34:56.654Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 1,
    author: 'Alex Smith',
    comment: 'Super film!',
    date: '2022-11-19T09:23:45.453Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 2,
    author: 'Maria Petrova',
    comment: 'Фильм был захватывающим!',
    date: '2023-06-12T14:22:18.785Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 3,
    author: 'John Doe',
    comment: 'Мне не очень понравился сюжет.',
    date: '2020-03-05T17:16:23.123Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 4,
    author: 'Anna Kuznetsova',
    comment: 'Отличная актерская игра!',
    date: '2021-12-30T11:17:49.284Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 5,
    author: 'Michael Green',
    comment: 'Музыка в фильме просто великолепна!',
    date: '2023-01-15T08:10:07.557Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 6,
    author: 'Sophia Brown',
    comment: 'Слишком затянуто.',
    date: '2021-04-25T19:23:07.654Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 7,
    author: 'David Wilson',
    comment: 'Концовка разочаровала.',
    date: '2020-07-04T12:34:56.984Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 8,
    author: 'Olga Romanova',
    comment: 'Рекомендую к просмотру!',
    date: '2022-11-18T22:45:34.321Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 9,
    author: 'Liam Johnson',
    comment: 'Очень предсказуемый фильм.',
    date: '2023-05-07T15:22:18.563Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  },
  {
    id: 10,
    author: 'Emily Davis',
    comment: 'Сюжет наполнен неожиданными поворотами!',
    date: '2020-09-11T21:14:45.223Z',
    emotion: commentEmotion[getRandomInteger(0, commentEmotion.length)]
  }
];

export const getMovieComments = () => {
  const hasComments = getRandomBoolean();
  const filmCommentsCount = (hasComments)
    ? getRandomInteger(1, MAX_COMMENTS_ON_FILM)
    : 0;
  if (filmCommentsCount === 0) {
    return [];
  }
  return getRandomSubset(comments, filmCommentsCount);
};

