import {DashboardData} from './types';

export function generateRandomId() {
  return Math.random()
    .toString(36)
    .substring(7);
}

export function getDevData(): DashboardData {
  return {
    cards: [
      {
        columnSpan: 1,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 1,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 1,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 2,
        type: 'issueList',
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 1,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 3,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 1,
        data: {
          id: generateRandomId(),
        },
      },
      {
        columnSpan: 2,
        data: {
          id: generateRandomId(),
        },
      },
    ],
  };
}