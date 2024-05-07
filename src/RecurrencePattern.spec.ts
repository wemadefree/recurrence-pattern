import { expect } from 'chai';
import { RecurrencePattern } from './RecurrencePattern';
import { TRecurrencePatternType } from './types';

describe(__filename, function () {
  it('RecurrencePattern instanciation', function () {
    const pattern = new RecurrencePattern({
      baseDate: new Date(),
      type: 'daily',
      interval: 1,
    });

    expect(pattern).to.be.instanceof(RecurrencePattern);
  });

  it('RecurrencePattern isValidPattern', function () {
    const baseDate = new Date();
    const dailyValid = new RecurrencePattern({
      baseDate,
      type: 'daily',
      interval: 1,
    });
    const weeklyValid = new RecurrencePattern({
      baseDate,
      type: 'weekly',
      interval: 1,
      daysOfWeek: ['monday'],
      firstDayOfWeek: 'sunday',
    });

    const weeklyInvalid = new RecurrencePattern({
      baseDate,
      type: 'weekly',
      interval: 1,
      daysOfWeek: [],
      firstDayOfWeek: 'sunday',
    });

    const absoluteMonthlyValid = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: 1,
    });

    const absoluteMonthlyInvalid = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: null,
    });

    const relativeMonthlyValid = new RecurrencePattern({
      baseDate,
      type: 'relativeMonthly',
      interval: 1,
      daysOfWeek: ['monday'],
      index: null,
    });

    const relativeMonthlyInvalid = new RecurrencePattern({
      baseDate,
      type: 'relativeMonthly',
      interval: 1,
      daysOfWeek: [],
      index: 'last',
    });

    const absoluteYearlyValid = new RecurrencePattern({
      baseDate,
      type: 'absoluteYearly',
      interval: 1,
      dayOfMonth: 1,
      month: 1,
    });

    const absoluteYearlyInvalid = new RecurrencePattern({
      baseDate,
      type: 'absoluteYearly',
      interval: 1,
      dayOfMonth: 1,
    });

    const relativeYearlyValid = new RecurrencePattern({
      baseDate,
      type: 'relativeYearly',
      interval: 1,
      daysOfWeek: ['monday'],
      index: 'first',
      month: 1,
    });

    const relativeYearlyInvalid = new RecurrencePattern({
      baseDate,
      type: 'relativeYearly',
      interval: 1,
    });


    expect(dailyValid.isValidPattern).to.be.true;
    expect(weeklyValid.isValidPattern).to.be.true;
    expect(weeklyInvalid.isValidPattern).to.be.false;
    expect(absoluteMonthlyValid.isValidPattern).to.be.true;
    expect(absoluteMonthlyInvalid.isValidPattern).to.be.false;
    expect(relativeMonthlyValid.isValidPattern).to.be.true;
    expect(relativeMonthlyValid.index).to.be.equal('first');
    expect(relativeMonthlyInvalid.isValidPattern).to.be.false;
    expect(absoluteYearlyValid.isValidPattern).to.be.true;
    expect(absoluteYearlyInvalid.isValidPattern).to.be.false;
    expect(relativeYearlyValid.isValidPattern).to.be.true;
    expect(relativeYearlyInvalid.isValidPattern).to.be.false;
  });

  it('RecurrencePattern nextOccurrence daily every day leap year', function () {
    const baseDate = new Date('2024-02-28');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'daily',
      interval: 1,
    });

    const afterDate = baseDate;
    const nextOccurrence = pattern.nextOccurrence(afterDate);
    expect(nextOccurrence).to.deep.equal(new Date('2024-02-29'));
  });

  it('RecurrencePattern nextOccurrence daily every 3 days', function () {
    const baseDate = new Date('2024-03-20');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'daily',
      interval: 3,
    });

    const afterDate = baseDate;
    const nextOccurrence = pattern.nextOccurrence(afterDate);
    expect(nextOccurrence).to.deep.equal(new Date('2024-03-23'));
  });

  it('RecurrencePattern nextOccurrence daily every 14 days', function () {
    const baseDate = new Date('2024-03-20');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'daily',
      interval: 14,
    });

    const afterDate = baseDate;
    const nextOccurrence = pattern.nextOccurrence(afterDate);
    expect(nextOccurrence).to.deep.equal(new Date('2024-04-03'));
  });

  it('RecurrencePattern occurrencesBetween weekly every other tuesday', function () {
    const baseDate = new Date('2024-03-21');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'weekly',
      interval: 2,
      daysOfWeek: ['tuesday'],
    });

    const afterDate = new Date('2024-03-21');
    const beforeDate = new Date('2024-06-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2024-04-02'),
      new Date('2024-04-16'),
      new Date('2024-04-30'),
      new Date('2024-05-14'),
      new Date('2024-05-28'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween relativeMonthly third thu every month', function () {
    const baseDate = new Date('2024-03-21');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'relativeMonthly',
      interval: 1,
      daysOfWeek: ['thursday'],
      index: 'third',
    });

    const afterDate = new Date('2024-03-21');
    const beforeDate = new Date('2024-08-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      // new Date('2024-03-21'), (If include is sent to .after in RRule - but have decided not to do that currently)
      new Date('2024-04-18'),
      new Date('2024-05-16'),
      new Date('2024-06-20'),
      new Date('2024-07-18'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween absoluteMonthly 31st (last) day every month', function () {
    const baseDate = new Date('2024-03-06');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: 31,
    });

    const afterDate = new Date('2024-03-01');
    const beforeDate = new Date('2024-09-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2024-03-31'),
      new Date('2024-04-30'),
      new Date('2024-05-31'),
      new Date('2024-06-30'),
      new Date('2024-07-31'),
      new Date('2024-08-31'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween absoluteMonthly 30th (or last) day every month', function () {
    const baseDate = new Date('2023-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: 30,
    });

    const afterDate = new Date('2023-01-01');
    const beforeDate = new Date('2024-09-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2023-01-30'),
      new Date('2023-02-28'),
      new Date('2023-03-30'),
      new Date('2023-04-30'),
      new Date('2023-05-30'),
      new Date('2023-06-30'),
      new Date('2023-07-30'),
      new Date('2023-08-30'),
      new Date('2023-09-30'),
      new Date('2023-10-30'),
      new Date('2023-11-30'),
      new Date('2023-12-30'),
      new Date('2024-01-30'),
      new Date('2024-02-29'),
      new Date('2024-03-30'),
      new Date('2024-04-30'),
      new Date('2024-05-30'),
      new Date('2024-06-30'),
      new Date('2024-07-30'),
      new Date('2024-08-30'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween absoluteMonthly 29th (or last) day every month', function () {
    const baseDate = new Date('2023-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: 29,
    });

    const afterDate = new Date('2023-01-01');
    const beforeDate = new Date('2024-09-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2023-01-29'),
      new Date('2023-02-28'),
      new Date('2023-03-29'),
      new Date('2023-04-29'),
      new Date('2023-05-29'),
      new Date('2023-06-29'),
      new Date('2023-07-29'),
      new Date('2023-08-29'),
      new Date('2023-09-29'),
      new Date('2023-10-29'),
      new Date('2023-11-29'),
      new Date('2023-12-29'),
      new Date('2024-01-29'),
      new Date('2024-02-29'),
      new Date('2024-03-29'),
      new Date('2024-04-29'),
      new Date('2024-05-29'),
      new Date('2024-06-29'),
      new Date('2024-07-29'),
      new Date('2024-08-29'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween absoluteMonthly 28th day every month', function () {
    const baseDate = new Date('2023-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteMonthly',
      interval: 1,
      dayOfMonth: 28,
    });

    const afterDate = new Date('2023-01-01');
    const beforeDate = new Date('2024-09-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2023-01-28'),
      new Date('2023-02-28'),
      new Date('2023-03-28'),
      new Date('2023-04-28'),
      new Date('2023-05-28'),
      new Date('2023-06-28'),
      new Date('2023-07-28'),
      new Date('2023-08-28'),
      new Date('2023-09-28'),
      new Date('2023-10-28'),
      new Date('2023-11-28'),
      new Date('2023-12-28'),
      new Date('2024-01-28'),
      new Date('2024-02-28'),
      new Date('2024-03-28'),
      new Date('2024-04-28'),
      new Date('2024-05-28'),
      new Date('2024-06-28'),
      new Date('2024-07-28'),
      new Date('2024-08-28'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween relativeYearly second wednesday in january', function () {
    const baseDate = new Date('2020-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'relativeYearly',
      interval: 1,
      daysOfWeek: ['wednesday'],
      month: 1,
      index: 'second',
    });

    const afterDate = new Date('2020-01-01');
    const beforeDate = new Date('2030-01-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2020-01-08'),
      new Date('2021-01-13'),
      new Date('2022-01-12'),
      new Date('2023-01-11'),
      new Date('2024-01-10'),
      new Date('2025-01-08'),
      new Date('2026-01-14'),
      new Date('2027-01-13'),
      new Date('2028-01-12'),
      new Date('2029-01-10'),
    ]);
  });

  it('RecurrencePattern occurrencesBetween absoluteYearly 15th of june', function () {
    const baseDate = new Date('2020-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteYearly',
      interval: 1,
      month: 6,
      dayOfMonth: 15,
    });

    const afterDate = new Date('2020-01-01');
    const beforeDate = new Date('2030-01-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2020-06-15'),
      new Date('2021-06-15'),
      new Date('2022-06-15'),
      new Date('2023-06-15'),
      new Date('2024-06-15'),
      new Date('2025-06-15'),
      new Date('2026-06-15'),
      new Date('2027-06-15'),
      new Date('2028-06-15'),
      new Date('2029-06-15'),
    ]);
  });

  it('RecurrencePattern exclusion', function () {
    const baseDate = new Date('2020-01-01');
    const pattern = new RecurrencePattern({
      baseDate,
      type: 'absoluteYearly',
      interval: 1,
      month: 6,
      dayOfMonth: 15,
    });

    pattern.addExcludeDate(new Date('2025-06-15'));

    const afterDate = new Date('2020-01-01');
    const beforeDate = new Date('2030-01-01');
    const occurrences = pattern.occurrencesBetween(afterDate, beforeDate);
    expect(occurrences).to.deep.equal([
      new Date('2020-06-15'),
      new Date('2021-06-15'),
      new Date('2022-06-15'),
      new Date('2023-06-15'),
      new Date('2024-06-15'),
      // new Date('2025-06-15'),
      new Date('2026-06-15'),
      new Date('2027-06-15'),
      new Date('2028-06-15'),
      new Date('2029-06-15'),
    ]);
  });
});
