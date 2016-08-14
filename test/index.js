import test     from 'ava';
import sinon    from 'sinon';
import moment   from 'moment-timezone';
import Calendar from '../lib';

test('引数なしの初期化', (t) => {
  const expected = '2016-01-01T09:10:00+09:00';
  const clock    = sinon.useFakeTimers(moment(expected).valueOf());
  const calendar = new Calendar();

  t.is(calendar.format(), expected);

  clock.restore();
});

test('日付を指定した初期化', (t) => {
  const expected = '2016-01-01T09:10:00+09:00';
  const calendar = new Calendar(expected);

  t.is(calendar.format(), expected);
});

test('日付とフォーマットを指定した初期化', (t) => {
  const expected = '2016-01-01T00:00:00+09:00';
  const calendar = new Calendar('2016/01/01', 'YYYY/MM/DD');

  t.is(calendar.format(), expected);
});

test('今日の0時を返す', (t) => {
  const expected = '2016-01-01T00:00:00+09:00';
  const now      = '2016-01-01T08:15:45+09:00';
  const calendar = new Calendar(now);

  t.is(calendar.today().format(), expected);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('明日の0時を返す', (t) => {
  const expected = '2016-01-02T00:00:00+09:00';
  const now      = '2016-01-01T08:15:45+09:00';
  const calendar = new Calendar(now);

  t.is(calendar.tomorrow().format(), expected);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('昨日の0時を返す', (t) => {
  const expected = '2016-01-01T00:00:00+09:00';
  const now      = '2016-01-02T08:15:45+09:00';
  const calendar = new Calendar(now);

  t.is(calendar.yesterday().format(), expected);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('今日の曜日を返す', (t) => {
  const monday    = new Calendar('2016-02-01T00:00:00+09:00');
  const tuesday   = new Calendar('2016-02-02T00:00:00+09:00');
  const wednesday = new Calendar('2016-02-03T00:00:00+09:00');
  const thursday  = new Calendar('2016-02-04T00:00:00+09:00');
  const friday    = new Calendar('2016-02-05T00:00:00+09:00');
  const saturday  = new Calendar('2016-02-06T00:00:00+09:00');
  const sunday    = new Calendar('2016-02-07T00:00:00+09:00');

  t.is(monday.dayOfWeek(), '月');
  t.is(tuesday.dayOfWeek(), '火');
  t.is(wednesday.dayOfWeek(), '水');
  t.is(thursday.dayOfWeek(), '木');
  t.is(friday.dayOfWeek(), '金');
  t.is(saturday.dayOfWeek(), '土');
  t.is(sunday.dayOfWeek(), '日');
});

test('月初の日時を返す', (t) => {
  const expected = '2016-01-01T00:00:00+09:00';
  const now      = '2016-01-15T09:05:12+09:00';
  const calendar = new Calendar(now);

  t.is(calendar.startOfTheMonth().format(), expected);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('月末の日時を返す', (t) => {
  const expected = '2016-01-31T23:59:59+09:00';
  const now      = '2016-01-15T09:05:12+09:00';
  const calendar = new Calendar(now);

  t.is(calendar.endOfTheMonth().format(), expected);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('次の休祝日を返す', (t) => {
  const previousSaturday = '2016-01-16T00:00:00+09:00';
  const now              = '2016-01-17T09:05:12+09:00';
  const tomorrow         = '2016-01-18T00:00:00+09:00';
  const nextSaturday     = '2016-01-23T00:00:00+09:00';
  const calendar         = new Calendar(now);
  const nextHoliday      = calendar.nextHoliday().format();

  t.is(nextHoliday, nextSaturday);
  t.not(nextHoliday, now);
  t.not(nextHoliday, tomorrow);
  t.not(nextHoliday, previousSaturday);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('前の休祝日を返す', (t) => {
  const sunday          = '2016-01-17T00:00:00+09:00';
  const yesterday       = '2016-01-18T00:00:00+09:00';
  const now             = '2016-01-19T09:05:12+09:00';
  const saturday        = '2016-01-23T00:00:00+09:00';
  const calendar        = new Calendar(now);
  const previousHoliday = calendar.previousHoliday().format();

  t.is(previousHoliday, sunday);
  t.not(previousHoliday, now);
  t.not(previousHoliday, yesterday);
  t.not(previousHoliday, saturday);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('次の平日を返す', (t) => {
  const friday      = '2016-01-15T00:00:00+09:00';
  const now         = '2016-01-16T09:05:12+09:00';
  const tomorrow    = '2016-01-17T00:00:00+09:00';
  const monday      = '2016-01-18T00:00:00+09:00';
  const calendar    = new Calendar(now);
  const nextWeekday = calendar.nextWeekday().format();

  t.is(nextWeekday, monday);
  t.not(nextWeekday, now);
  t.not(nextWeekday, tomorrow);
  t.not(nextWeekday, friday);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('前の平日を返す', (t) => {
  const friday          = '2016-01-15T00:00:00+09:00';
  const yesterday       = '2016-01-16T00:00:00+09:00';
  const now             = '2016-01-17T09:05:12+09:00';
  const monday          = '2016-01-18T00:00:00+09:00';
  const calendar        = new Calendar(now);
  const previousWeekday = calendar.previousWeekday().format();

  t.is(previousWeekday, friday);
  t.not(previousWeekday, now);
  t.not(previousWeekday, yesterday);
  t.not(previousWeekday, monday);
  t.is(calendar.format(), now, '現在日時を上書きしない');
});

test('月初かをチェック', (t) => {
  const startOfTheMonth = new Calendar('2016-01-01T00:00:00+09:00');
  const endOfTheMonth   = new Calendar('2016-01-31T23:59:59+09:00');

  t.truthy(startOfTheMonth.isStartOfTheMonth());
  t.falsy(endOfTheMonth.isStartOfTheMonth(), '月末は月初ではない');
});

test('月末かをチェック', (t) => {
  const startOfTheMonth = new Calendar('2016-01-01T00:00:00+09:00');
  const endOfTheMonth   = new Calendar('2016-01-31T23:59:59+09:00');

  t.truthy(endOfTheMonth.isEndOfTheMonth());
  t.falsy(startOfTheMonth.isEndOfTheMonth(), '月初は月末ではない');
});

test('休祝日かをチェック', (t) => {
  const saturday = new Calendar('2016-01-02T09:00:00+09:00');
  const sunday   = new Calendar('2016-01-03T09:00:00+09:00');
  const holiday  = new Calendar('2016-01-11T09:00:00+09:00');
  const weekday  = new Calendar('2016-01-04T09:00:00+09:00');

  t.truthy(saturday.isHoliday());
  t.truthy(sunday.isHoliday());
  t.truthy(holiday.isHoliday());
  t.falsy(weekday.isHoliday());
});

test('平日かをチェック', (t) => {
  const saturday = new Calendar('2016-01-02T09:00:00+09:00');
  const sunday   = new Calendar('2016-01-03T09:00:00+09:00');
  const holiday  = new Calendar('2016-01-11T09:00:00+09:00');
  const weekday  = new Calendar('2016-01-04T09:00:00+09:00');

  t.truthy(weekday.isWeekday());
  t.falsy(saturday.isWeekday());
  t.falsy(sunday.isWeekday());
  t.falsy(holiday.isWeekday());
});
