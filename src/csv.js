import {HebrewCalendar, flags} from '@hebcal/core';
import {getLeyningForParshaHaShavua, getLeyningForHoliday,
  getParshaDates, writeHolidayMincha,
  getLeyningKeyForEvent, writeCsvLines} from '@hebcal/leyning';
import {Triennial} from './triennial.js';
import {getTriennialForParshaHaShavua} from './parshaHaShavua.js';
import {getTriennialHaftaraForHoliday} from './haftara.js';

/**
 * @param {fs.WriteStream} stream
 * @param {number} hyear
 * @param {boolean} [il]
 */
export function writeTriennialCsv(stream, hyear, il=false) {
  const events0 = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    numYears: 3,
    sedrot: true,
    il: il,
  });
  const events = events0.filter((ev) => ev.getDesc() !== 'Rosh Chodesh Tevet');
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Triennial Reading","Verses"\r\n');
  for (const ev of events) {
    if (ev.getFlags() === flags.PARSHA_HASHAVUA || !parshaDates[ev.getDate().toString()]) {
      writeTriennialEvent(stream, ev, il);
    }
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
export function writeTriennialEvent(stream, ev, il) {
  if (ignore(ev)) {
    return;
  }
  if (ev.getFlags() === flags.PARSHA_HASHAVUA) {
    writeTriennialEventParsha(stream, ev, il);
  } else {
    writeTriennialEventHoliday(stream, ev, il);
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
function writeTriennialEventHoliday(stream, ev, il) {
  const reading = getLeyningForHoliday(ev, il);
  if (reading) {
    const key = getLeyningKeyForEvent(ev, il);
    const year = ev.getDate().getFullYear();
    const yearNum = Triennial.getYearNumber(year) - 1;
    const triHaft = getTriennialHaftaraForHoliday(key, yearNum);
    if (triHaft) {
      reading.triHaftara = triHaft.haftara;
      reading.triHaftaraNumV = triHaft.haftaraNumV;
    }
    writeCsvLines(stream, ev, reading, il, false);
    writeHolidayMincha(stream, ev, il);
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 * @param {boolean} il
 */
function writeTriennialEventParsha(stream, ev, il) {
  const triReading = getTriennialForParshaHaShavua(ev, il);
  if (triReading) {
    const reading = getLeyningForParshaHaShavua(ev, il);
    reading.fullkriyah = triReading.aliyot;
    reading.triHaftara = triReading.haftara;
    reading.triHaftaraNumV = triReading.haftaraNumV;
    writeCsvLines(stream, ev, reading, il, true);
  }
}

/**
 * @private
 * @param {Event} ev
 * @return {boolean}
 */
function ignore(ev) {
  const mask = ev.getFlags();
  if (mask === flags.SPECIAL_SHABBAT) {
    return true;
  }
  if (mask !== flags.ROSH_CHODESH) {
    return false;
  }
  return ev.getDate().getDay() === 6;
}
