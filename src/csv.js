import {HebrewCalendar, flags} from '@hebcal/core';
import {getLeyningForParshaHaShavua, getLeyningForHoliday,
  getLeyningKeyForEvent, writeCsvLines} from '@hebcal/leyning';
import {getTriennialForParshaHaShavua, getTriennialHaftaraForHoliday, Triennial} from './triennial';

/**
 * @private
 * @param {Event[]} events
 * @return {Object<string,boolean>}
 */
function getParshaDates(events) {
  const parshaEvents = events.filter((ev) => ev.getFlags() === flags.PARSHA_HASHAVUA);
  const parshaDates = parshaEvents.reduce((set, ev) => {
    set[ev.getDate().toString()] = true;
    return set;
  }, {});
  return parshaDates;
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {number} hyear
 */
export function writeTriennialCsv(stream, hyear) {
  const events0 = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    numYears: 3,
    sedrot: true,
    il: false,
  });
  const events = events0.filter((ev) => ev.getDesc() !== 'Rosh Chodesh Tevet');
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Triennial Reading","Verses"\r\n');
  events.forEach((ev) => {
    if (ev.getFlags() === flags.PARSHA_HASHAVUA || !parshaDates[ev.getDate().toString()]) {
      writeTriennialEvent(stream, ev);
    }
  });
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 */
export function writeTriennialEvent(stream, ev) {
  if (ignore(ev)) {
    return;
  }
  if (ev.getFlags() === flags.PARSHA_HASHAVUA) {
    writeTriennialEventParsha(stream, ev);
  } else {
    writeTriennialEventHoliday(stream, ev);
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 */
function writeTriennialEventHoliday(stream, ev) {
  const il = false;
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
  }
}

/**
 * @private
 * @param {fs.WriteStream} stream
 * @param {Event} ev
 */
function writeTriennialEventParsha(stream, ev) {
  const triReading = getTriennialForParshaHaShavua(ev, true);
  if (triReading) {
    const il = false;
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
