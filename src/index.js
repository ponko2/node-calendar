import moment from 'moment-timezone';
import holiday from 'holiday-jp';

const locale = 'ja';
const timezone = 'Asia/Tokyo';

// Moment.jsの言語設定
moment.locale(locale);

export default class Calendar {
  /**
   * コンストラクタ
   *
   * @param {(string|object)} date   - 日付文字列もしくはMomentのオブジェクト
   * @param {string}          format - 日付書式
   *
   * @returns {void}
   */
  constructor(date, format) {
    if (!date) {
      this.date = moment();
    } else if (!format) {
      this.date = moment(date);
    } else {
      this.date = moment(date, format);
    }

    this.date.tz(timezone);
  }

  /**
   * 日時の文字列
   *
   * @param {string} format - 日時の書式
   *
   * @returns {string} 日時の文字列
   */
  format(format) {
    if (!format) {
      return this.date.format();
    }

    return this.date.format(format);
  }

  /**
   * Momentのオブジェクト
   *
   * @returns {object} Momentのオブジェクト
   */
  getMoment() {
    return this.date.clone();
  }

  /**
   * 今日の0時
   *
   * @returns {object} 今日の0時
   */
  today() {
    const today = this.getMoment().startOf('day');
    return new this.constructor(today);
  }

  /**
   * 明日
   *
   * @returns {object} 明日
   */
  tomorrow() {
    const tomorrow = this.today()
      .getMoment()
      .add(1, 'day');
    return new this.constructor(tomorrow);
  }

  /**
   * 昨日
   *
   * @returns {object} 昨日
   */
  yesterday() {
    const yesterday = this.today()
      .getMoment()
      .subtract(1, 'day');
    return new this.constructor(yesterday);
  }

  /**
   * 今日の曜日
   *
   * @returns {object} 今日の曜日
   */
  dayOfWeek() {
    return this.today().format('dd');
  }

  /**
   * 月初の日時
   *
   * @returns {object} 月初の日時
   */
  startOfTheMonth() {
    const startOfTheMonth = this.getMoment().startOf('month');
    return new this.constructor(startOfTheMonth);
  }

  /**
   * 月末の日時
   *
   * @returns {object} 月末の日時
   */
  endOfTheMonth() {
    const endOfTheMonth = this.getMoment().endOf('month');
    return new this.constructor(endOfTheMonth);
  }

  /**
   * 次の休祝日
   *
   * @returns {object} 次の休祝日
   */
  nextHoliday() {
    let calendar = this.tomorrow();

    while (calendar.isWeekday()) {
      calendar = calendar.tomorrow();
    }

    return calendar;
  }

  /**
   * 前の休祝日
   *
   * @returns {object} 前の休祝日
   */
  previousHoliday() {
    let calendar = this.yesterday();

    while (calendar.isWeekday()) {
      calendar = calendar.yesterday();
    }

    return calendar;
  }

  /**
   * 次の平日
   *
   * @returns {object} 次の平日
   */
  nextWeekday() {
    let calendar = this.tomorrow();

    while (calendar.isHoliday()) {
      calendar = calendar.tomorrow();
    }

    return calendar;
  }

  /**
   * 前の平日
   *
   * @returns {object} 前の平日
   */
  previousWeekday() {
    let calendar = this.yesterday();

    while (calendar.isHoliday()) {
      calendar = calendar.yesterday();
    }

    return calendar;
  }

  /**
   * 休祝日かをチェック
   *
   * @returns {boolean} 休祝日のときtrue
   */
  isHoliday() {
    const date = this.today().getMoment();
    return (
      holiday.isHoliday(date.toDate()) || date.day() === 0 || date.day() === 6
    );
  }

  /**
   * 平日かをチェック
   *
   * @returns {boolean} 平日のときtrue
   */
  isWeekday() {
    return !this.isHoliday();
  }

  /**
   * 月初かをチェック
   *
   * @returns {boolean} 月初のときtrue
   */
  isStartOfTheMonth() {
    const today = this.today().getMoment();
    const startOfTheMonth = this.startOfTheMonth().getMoment();
    return today.isSame(startOfTheMonth, 'day');
  }

  /**
   * 月末かをチェック
   *
   * @returns {boolean} 月末のときtrue
   */
  isEndOfTheMonth() {
    const today = this.today().getMoment();
    const endOfTheMonth = this.endOfTheMonth().getMoment();
    return today.isSame(endOfTheMonth, 'day');
  }
}
