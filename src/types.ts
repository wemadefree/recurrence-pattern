export type TRecurrencePatternType =
  /*
    daily
    Event repeats based on the number of days specified by interval between occurrences.
    Example: Repeat event every 3 days.
    Required properties: type, interval
  */
  'daily' |

  /*
    weekly
    Event repeats on the same day or days of the week, based on the number of weeks between each set of occurrences.
    Example: Repeat event Monday and Tuesday of every other week.
    Required properties: type, interval, daysOfWeek, firstDayOfWeek
  */
  'weekly' |

  /*
    absoluteMonthly
    Event repeats on the specified day of the month (e.g. the 15th), based on the number of months between occurrences.
    Example: Repeat event quarterly (every 3 months) on the 15th.
    Required properties: type, interval, dayOfMonth
  */
  'absoluteMonthly' |

  /*
    relativeMonthly
    Event repeats on the specified day or days of the week, in the same relative position in the month,
    based on the number of months between occurrences.
    Example: Repeat event on the second Thursday or Friday every three months.
    Required properties: type, interval, daysOfWeek
    Optional properties: index
  */
  'relativeMonthly' |

  /*
    absoluteYearly
    Event repeats on the specified day and month, based on the number of years between occurrences.
    Example: Repeat event on the 15th of March every 3 years.
    Required properties: type, interval, dayOfMonth, month
  */
  'absoluteYearly' |

  /*
    relativeYearly
    Event repeats on the specified day or days of the week, in the same relative position in a specific month of the year,
    based on the number of years between occurrences.
    Example: Repeat event on the second Thursday or Friday of every November every 3 years.
    Required properties: type, interval, daysOfWeek, month
    Optional properties: index
  */
  'relativeYearly';


export type TRecurrencePatternWeekIndex = 'first' | 'second' | 'third' | 'fourth' | 'last';

// Modeled after the recurrencePattern resource type used in Microsoft Graph API:
// https://learn.microsoft.com/en-us/graph/api/resources/recurrencepattern?view=graph-rest-1.0
// but not made to be a 1:1 match. The pattern turned out to be very similar to the one originally created.

export interface IRecurrencePattern {
  baseDate: Date;
  type: TRecurrencePatternType;
  /*
    The day of the month on which the event occurs. Required if type is absoluteMonthly or absoluteYearly.
  */
  dayOfMonth?: number | null;

  /*
    A collection of the days of the week on which the event occurs.
    The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday.
    If type is relativeMonthly or relativeYearly, and daysOfWeek specifies more than one day,
    the event falls on the first day that satisfies the pattern.
    Required if type is weekly, relativeMonthly, or relativeYearly.
  */
  daysOfWeek?: string[];

  /*
    The first day of the week. The possible values are: sunday, monday, tuesday, wednesday, thursday, friday, saturday.
    Default is monday (differs from MS spec). Required if type is weekly.
  */
  firstDayOfWeek?: string;

  /*
    Specifies on which instance of the allowed days specified in daysOfWeek the event occurs,
    counted from the first instance in the month.
    The possible values are: first, second, third, fourth, last. Default is first.
    Optional and used if type is relativeMonthly or relativeYearly.
  */
  index?: TRecurrencePatternWeekIndex | null;

  /*
    The number of units between occurrences, where units can be in days, weeks,
    months, or years, depending on the type. Required.
  */
  interval: number;

  /*
    The month in which the event occurs.
    This is a number from 1 to 12. Required if type is absoluteYearly or relativeYearly.
  */
  month?: number | null;
}