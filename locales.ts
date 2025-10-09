// locales.ts

export const en = {
  save: 'Save',
  selectSingle: 'Select date',
  selectMultiple: 'Select dates',
  selectRange: 'Select date range',
  notAccordingToDateFormat: (inputFormat: string) =>
    `Date format should be ${inputFormat}`,
  mustBeHigherThan: (date: string) => `Date should be later than ${date}`,
  mustBeLowerThan: (date: string) => `Date should be earlier than ${date}`,
  mustBeBetween: (start: string, end: string) =>
    `Date should be between ${start} and ${end}`,
  dateIsDisabled: 'Date is disabled',
  previous: 'Previous',
  next: 'Next',
  typeInDate: 'Type in date',
  pickDateFromCalendar: 'Pick date from calendar',
  close: 'Close',
  hour: 'Hour',
  minute: 'Minute',
};
