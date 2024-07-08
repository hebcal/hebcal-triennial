import {HebrewCalendar, HDate, months, flags, ParshaEvent, Event} from '@hebcal/core';
import {getTriennialForParshaHaShavua} from '../src/parshaHaShavua';
import {formatAliyahWithBook} from '@hebcal/leyning';

test('getTriennialForParshaHaShavua', () => {
  const options = {
    start: new Date(2020, 4, 1),
    end: new Date(2020, 4, 10),
    sedrot: true,
    noHolidays: true,
  };
  let events = HebrewCalendar.calendar(options);
  let ev = events[0];
  expect(ev.getDesc()).toBe('Parashat Achrei Mot-Kedoshim');
  let reading = getTriennialForParshaHaShavua(ev).aliyot;
  expect(formatAliyahWithBook(reading['2'])).toBe('Leviticus 16:7-16:11');
  expect(formatAliyahWithBook(reading['7'])).toBe('Leviticus 17:1-17:7');
  expect(formatAliyahWithBook(reading['M'])).toBe('Leviticus 17:5-17:7');
  ev = events[1];
  expect(ev.getDesc()).toBe('Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev).aliyot;
  expect(formatAliyahWithBook(reading['1'])).toBe('Leviticus 21:1-21:6');
  expect(formatAliyahWithBook(reading['M'])).toBe('Leviticus 22:13-22:16');

  options.start = new Date(2022, 3, 29);
  options.end = new Date(2022, 4, 15);
  events = HebrewCalendar.calendar(options);
  ev = events[0];
  expect(ev.getDesc()).toBe('Parashat Achrei Mot');
  reading = getTriennialForParshaHaShavua(ev).aliyot;
  const expected0 = {
    '1': {k: 'Leviticus', b: '17:1', e: '17:7', v: 7},
    '2': {k: 'Leviticus', b: '17:8', e: '17:12', v: 5},
    '3': {k: 'Leviticus', b: '17:13', e: '17:16', v: 4},
    '4': {k: 'Leviticus', b: '18:1', e: '18:5', v: 5},
    '5': {k: 'Leviticus', b: '18:6', e: '18:21', v: 16},
    '6': {k: 'Leviticus', b: '18:22', e: '18:25', v: 4},
    '7': {k: 'Leviticus', b: '18:26', e: '18:30', v: 5},
    'M': {k: 'Leviticus', b: '18:26', e: '18:30', v: 5},
  };
  expect(reading).toEqual(expected0);
  ev = events[1];
  expect(ev.getDesc()).toBe('Parashat Kedoshim');
  reading = getTriennialForParshaHaShavua(ev).aliyot;
  expect(formatAliyahWithBook(reading['1'])).toBe('Leviticus 19:15-19:18');
  expect(formatAliyahWithBook(reading['7'])).toBe('Leviticus 20:23-20:27');
  expect(formatAliyahWithBook(reading['M'])).toBe('Leviticus 20:25-20:27');
  ev = events[2];
  expect(ev.getDesc()).toBe('Parashat Emor');
  reading = getTriennialForParshaHaShavua(ev).aliyot;
  expect(formatAliyahWithBook(reading['1'])).toBe('Leviticus 23:23-23:25');
  expect(formatAliyahWithBook(reading['M'])).toBe('Leviticus 24:21-24:23');

  options.start = new Date(2022, 9, 1);
  options.end = new Date(2022, 9, 1);
  events = HebrewCalendar.calendar(options);
  ev = events[0];
  expect(ev.getDesc()).toBe('Parashat Vayeilech');
  reading = getTriennialForParshaHaShavua(ev).aliyot;
  const expected = {
    '1': {k: 'Deuteronomy', b: '31:1', e: '31:3', v: 3},
    '2': {k: 'Deuteronomy', b: '31:4', e: '31:6', v: 3},
    '3': {k: 'Deuteronomy', b: '31:7', e: '31:9', v: 3},
    '4': {k: 'Deuteronomy', b: '31:10', e: '31:13', v: 4},
    '5': {k: 'Deuteronomy', b: '31:14', e: '31:19', v: 6},
    '6': {k: 'Deuteronomy', b: '31:20', e: '31:24', v: 5},
    '7': {k: 'Deuteronomy', b: '31:25', e: '31:30', v: 6},
    'M': {k: 'Deuteronomy', b: '31:28', e: '31:30', v: 3},
  };
  expect(reading).toEqual(expected);
});

test('specialReading1', () => {
  const options = {
    start: new Date(2016, 11, 31),
    end: new Date(2017, 0, 1),
    sedrot: true,
    noHolidays: true,
  };
  const events = HebrewCalendar.calendar(options);
  const ev = events[0];
  expect(ev.getDesc()).toBe('Parashat Miketz');
  const reading = getTriennialForParshaHaShavua(ev).aliyot;
  const expected = {
    '1': {k: 'Genesis', b: '41:1', e: '41:4', v: 4},
    '2': {k: 'Genesis', b: '41:5', e: '41:7', v: 3},
    '3': {k: 'Genesis', b: '41:8', e: '41:14', v: 7},
    '4': {k: 'Genesis', b: '41:15', e: '41:24', v: 10},
    '5': {k: 'Genesis', b: '41:25', e: '41:38', v: 14},
    '6': {k: 'Genesis', b: '41:39', e: '41:43', v: 5},
    '7': {k: 'Genesis', b: '41:44', e: '41:52', v: 9},
    'M': {
      p: 35,
      k: 'Numbers',
      b: '7:48',
      e: '7:53',
      reason: 'Chanukah Day 7 (on Shabbat)',
      v: 6,
    },
  };
  expect(reading).toEqual(expected);
});

test('specialReading2', () => {
  const options = {
    start: new Date(2021, 1, 13),
    end: new Date(2021, 1, 13),
    sedrot: true,
    noHolidays: true,
  };
  const events = HebrewCalendar.calendar(options);
  const ev = events[0];
  expect(ev.getDesc()).toBe('Parashat Mishpatim');
  const reading = getTriennialForParshaHaShavua(ev).aliyot;
  const expected = {
    '1': {k: 'Exodus', b: '22:4', e: '22:8', v: 5},
    '2': {k: 'Exodus', b: '22:9', e: '22:12', v: 4},
    '3': {k: 'Exodus', b: '22:13', e: '22:18', v: 6},
    '4': {k: 'Exodus', b: '22:19', e: '22:26', v: 8},
    '5': {k: 'Exodus', b: '22:27', e: '23:5', v: 9},
    '6': {k: 'Exodus', b: '23:6', e: '23:19', v: 14},
    '7': {
      p: 41,
      k: 'Numbers',
      b: '28:9',
      e: '28:15',
      v: 7,
      reason: 'Shabbat Shekalim (on Rosh Chodesh)',
    },
    'M': {
      p: 21,
      k: 'Exodus',
      b: '30:11',
      e: '30:16',
      v: 6,
      reason: 'Shabbat Shekalim (on Rosh Chodesh)',
    },
  };
  expect(reading).toEqual(expected);
});

test('vayeilech-elul', () => {
  const options = {
    sedrot: true,
    noHolidays: true,
  };
  options.start = options.end = new Date(2020, 8, 12);
  const event1 = HebrewCalendar.calendar(options)[0];
  expect(event1.getDesc()).toBe('Parashat Nitzavim-Vayeilech');
  const reading1 = getTriennialForParshaHaShavua(event1);
  expect(reading1.yearNum).toBe(0);

  options.start = options.end = new Date(2021, 8, 11);
  const event2 = HebrewCalendar.calendar(options)[0];
  expect(event2.getDesc()).toBe('Parashat Vayeilech');
  const reading2 = getTriennialForParshaHaShavua(event2);
  expect(reading2.yearNum).toBe(1);

  options.start = options.end = new Date(2022, 9, 1);
  const event3 = HebrewCalendar.calendar(options)[0];
  expect(event3.getDesc()).toBe('Parashat Vayeilech');
  const reading3 = getTriennialForParshaHaShavua(event3);
  expect(reading3.yearNum).toBe(2);
});

test('emor-5746', () => {
  const options = {
    sedrot: true,
    noHolidays: true,
  };
  // 17 May 1986 (8 Iyyar 5746)
  options.start = options.end = new Date(1986, 4, 17);
  const ev = HebrewCalendar.calendar(options)[0];
  expect(ev.getDesc()).toBe('Parashat Emor');
  const reading = getTriennialForParshaHaShavua(ev);
  const expected = {
    aliyot: {
      '1': {k: 'Leviticus', b: '23:23', e: '23:25', v: 3},
      '2': {k: 'Leviticus', b: '23:26', e: '23:32', v: 7},
      '3': {k: 'Leviticus', b: '23:33', e: '23:44', v: 12},
      '4': {k: 'Leviticus', b: '24:1', e: '24:4', v: 4},
      '5': {k: 'Leviticus', b: '24:5', e: '24:9', v: 5},
      '6': {k: 'Leviticus', b: '24:10', e: '24:12', v: 3},
      '7': {k: 'Leviticus', b: '24:13', e: '24:23', v: 11},
      'M': {k: 'Leviticus', b: '24:21', e: '24:23', v: 3},
    },
    date: new HDate(options.start),
    yearNum: 2,
    haft: [
      {b: '1:1', e: '1:7', k: 'Nachum', v: 7,
        note: 'Judah shall observe its festivals // complete festival calendar'},
      {b: '2:1', e: '2:3', k: 'Nachum', v: 3},
      {b: '2:2b', e: '2:3a', k: 'Nachum', v: 2},
    ],
    haftara: 'Nachum 1:1-7, 2:1-3, 2:2b-3a',
    haftaraNumV: 12,
    variation: 'Y.3',
  };
  expect(reading).toEqual(expected);
});

test('multi-year', () => {
  for (let hyear = 5782; hyear < 6200; hyear++) {
    if (hyear === 5831 || hyear === 5832 || hyear === 5833 || hyear === 5834) {
      continue;
    }
    const events = HebrewCalendar.calendar({
      year: hyear,
      isHebrewYear: true,
      sedrot: true,
      noHolidays: true,
    });
    for (const ev of events) {
      try {
        getTriennialForParshaHaShavua(ev);
      } catch (err) {
        console.log(ev);
        console.log(err);
        fail(ev.getDesc());
      }
    }
  }
  expect(true).toBe(true);
});

test('triennial-haft', () => {
  // 7/9/2022 Parashat Chukat
  const hd1 = new HDate(10, months.TAMUZ, 5782);
  const ev1 = HebrewCalendar.calendar({start: hd1, end: hd1, sedrot: true, noHolidays: true})[0];
  expect(ev1.getFlags()).toBe(flags.PARSHA_HASHAVUA);
  expect(ev1.getDesc()).toBe('Parashat Chukat');
  const r1 = getTriennialForParshaHaShavua(ev1);
  expect(r1.haftara).toBe('II Kings 18:1-13, 19:15-19');

  // 7/30/2022 Parashat Matot-Masei
  const hd2 = new HDate(2, months.AV, 5782);
  const ev2 = HebrewCalendar.calendar({start: hd2, end: hd2, sedrot: true, noHolidays: true})[0];
  expect(ev2.getFlags()).toBe(flags.PARSHA_HASHAVUA);
  expect(ev2.getDesc()).toBe('Parashat Matot-Masei');
  const r2 = getTriennialForParshaHaShavua(ev2);
  expect(r2.haftara).toBe('I Kings 9:2-9, 9:4-5a');

  // 8/6/2022 Parashat Devarim
  const hd3 = new HDate(9, months.AV, 5782);
  const ev3 = HebrewCalendar.calendar({start: hd3, end: hd3, sedrot: true, noHolidays: true})[0];
  expect(ev3.getFlags()).toBe(flags.PARSHA_HASHAVUA);
  expect(ev3.getDesc()).toBe('Parashat Devarim');
  const r3 = getTriennialForParshaHaShavua(ev3);
  expect(r3.haftara).not.toBeDefined();
});

test('no-triennial-haft-on-special', () => {
  const hd = new HDate(29, 'Tishrei', 5784);
  const ev = new ParshaEvent(hd, ['Bereshit'], false);
  const reading = getTriennialForParshaHaShavua(ev, false);
  expect(reading.haft).not.toBeDefined();
  expect(reading.haftara).not.toBeDefined();
  expect(reading.haftaraNumV).not.toBeDefined();
});

test('getTriennialForParshaHaShavua-throws', () => {
  const hd = new HDate(29, 'Tishrei', 5784);
  const ev = new Event(hd, 'Bogus', flags.DAF_YOMI);
  expect(() => {
    getTriennialForParshaHaShavua(ev, false);
  }).toThrow('Bad event argument: Bogus');
});
