import { datetime, RRule, RRuleSet, rrulestr, Frequency, Weekday, Options as RRuleOptions } from 'rrule';
import { IRecurrencePattern, TRecurrencePatternType, TRecurrencePatternWeekIndex } from './types';



export class RecurrencePattern implements IRecurrencePattern {
  baseDate: Date;
  type: TRecurrencePatternType;
  interval: number;
  daysOfWeek: string[];
  firstDayOfWeek: string;
  dayOfMonth: number | null;
  index: TRecurrencePatternWeekIndex | null;
  month: number | null;
  WEEKDAY_RR_MAPPING = {
    monday: RRule.MO,
    tuesday: RRule.TU,
    wednesday: RRule.WE,
    thursday: RRule.TH,
    friday: RRule.FR,
    saturday: RRule.SA,
    sunday: RRule.SU,
  };
  excludeDates: Date[] = [];

  constructor(data: IRecurrencePattern) {
    this.baseDate = new Date(data.baseDate);
    this.type = data.type;
    this.interval = data.interval;
    this.daysOfWeek = data.daysOfWeek || [];
    this.firstDayOfWeek = data.firstDayOfWeek || 'monday';
    this.dayOfMonth = data.dayOfMonth ?? null;
    this.index = data.index || 'first';
    this.month = data.month ?? null;
  }

  get isValidPattern() {
    switch (this.type) {
      case 'daily':
        return true;
      case 'weekly':
        return this.daysOfWeek.length > 0;
      case 'absoluteMonthly':
        return this.dayOfMonth !== null;
      case 'relativeMonthly':
        return this.daysOfWeek.length > 0;
      case 'absoluteYearly':
        return this.dayOfMonth !== null && this.month !== null;
      case 'relativeYearly':
        return this.daysOfWeek.length > 0 && this.month !== null;
      default:
        return false;
    }
  }

  get rrFrequency(): Frequency {
    switch (this.type) {
      case 'daily':
        return RRule.DAILY;
      case 'weekly':
        return RRule.WEEKLY;
      case 'absoluteMonthly':
        return RRule.MONTHLY;
      case 'relativeMonthly':
        return RRule.MONTHLY;
      case 'absoluteYearly':
        return RRule.YEARLY;
      case 'relativeYearly':
        return RRule.YEARLY;
      default:
        return RRule.DAILY;
    }
  }

  get rrByWeekDay(): Weekday[] {
    return this.daysOfWeek.map(day => this.WEEKDAY_RR_MAPPING[day as keyof typeof this.WEEKDAY_RR_MAPPING]);
  }

  get rrBySetPos(): number {
    const indexMapping = {
      first: 1,
      second: 2,
      third: 3,
      fourth: 4,
      last: -1,
    };
    return indexMapping[this.index as TRecurrencePatternWeekIndex];
  }

  get rrWkst(): Weekday {
    return this.WEEKDAY_RR_MAPPING[this.firstDayOfWeek as keyof typeof this.WEEKDAY_RR_MAPPING];
  }

  addExcludeDate(date: Date) {
    this.excludeDates.push(date);
  }

  addExcludeDates(dates: Date[]) {
    dates.forEach(date => this.addExcludeDate(date));
  }

  generateRRule(opts: Partial<RRuleOptions> = {}): RRule {
    if (!this.isValidPattern) throw new Error('Invalid pattern');

    let rule: Partial<RRuleOptions> = {
      freq: this.rrFrequency,
      interval: this.interval,
      wkst: this.rrWkst,
      dtstart: this.baseDate,
    };

    if (['weekly', 'relativeMonthly', 'relativeYearly'].includes(this.type)) {
      rule = {
        ...rule,
        byweekday: this.rrByWeekDay,
      };
    }

    if (['absoluteMonthly', 'absoluteYearly'].includes(this.type)) {
      rule = {
        ...rule,
        bysetpos: -1, // Magic to pick the last possible entry per month
        bymonthday: (this.dayOfMonth && this.dayOfMonth > 28) ? Array.from({ length: (this.dayOfMonth - 27) }, (x, i) => i + 28) : this.dayOfMonth,
        bymonth: this.month,
      };
    }

    if (['relativeMonthly', 'relativeYearly'].includes(this.type)) {
      rule = {
        ...rule,
        bysetpos: this.rrBySetPos,
      };
    }

    if (['relativeYearly'].includes(this.type)) {
      rule = {
        ...rule,
        bymonth: this.month,
      };
    }

    return new RRule({
      ...rule,
      ...opts,
    });
  }

  nextOccurrence(afterDate: Date = new Date()): Date | null {
    const ruleSet = new RRuleSet();
    ruleSet.rrule(this.generateRRule());
    this.excludeDates.forEach(date => ruleSet.exdate(date));
    return ruleSet.after(afterDate);
  }

  previousOccurrence(beforeDate: Date = new Date()): Date | null {
    const ruleSet = new RRuleSet();
    ruleSet.rrule(this.generateRRule());
    this.excludeDates.forEach(date => ruleSet.exdate(date));
    return ruleSet.before(beforeDate);
  }

  occurrencesBetween(afterDate: Date, beforeDate: Date, count?: number): Date[] {
    const ruleSet = new RRuleSet();
    ruleSet.rrule(this.generateRRule());
    this.excludeDates.forEach(date => ruleSet.exdate(date));

    if (count) {
      return ruleSet.between(afterDate, beforeDate, false, (date, i) => i < count);
    }
    return ruleSet.between(afterDate, beforeDate);
  }

  occurrences(count: number): Date[] {
    const ruleSet = new RRuleSet();
    ruleSet.rrule(this.generateRRule({ count, }));
    this.excludeDates.forEach(date => ruleSet.exdate(date));
    return ruleSet.all();
  }

  static from(data: IRecurrencePattern): RecurrencePattern {
    return new RecurrencePattern(data);
  }
}
