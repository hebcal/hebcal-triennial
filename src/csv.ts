import {Event, HebrewCalendar, HolidayEvent, flags} from '@hebcal/core';
import {
  getLeyningForHoliday,
  getLeyningForParshaHaShavua,
  getLeyningKeyForEvent,
  getParshaDates,
  writeCsvLines,
  writeHolidayMincha,
} from '@hebcal/leyning';
import {WriteStream} from 'node:fs';
import {getTriennialHaftaraForHoliday} from './haftara';
import {getTriennialForParshaHaShavua} from './parshaHaShavua';
import {Triennial} from './triennial';

export function writeTriennialCsv(
  stream: WriteStream,
  hyear: number,
  il = false
) {
  const events0 = HebrewCalendar.calendar({
    year: hyear,
    isHebrewYear: true,
    numYears: 3,
    sedrot: true,
    il: il,
  });
  const events = events0.filter(ev => ev.getDesc() !== 'Rosh Chodesh Tevet');
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Triennial Reading","Verses"\r\n');
  for (const ev of events) {
    if (
      ev.getFlags() === flags.PARSHA_HASHAVUA ||
      !parshaDates[ev.getDate().toString()]
    ) {
      writeTriennialEvent(stream, ev, il);
    }
  }
}

/**
 * @private
 */
export function writeTriennialEvent(
  stream: WriteStream,
  ev: Event,
  il: boolean
) {
  if (ignore(ev)) {
    return;
  }
  if (ev.getFlags() === flags.PARSHA_HASHAVUA) {
    writeTriennialEventParsha(stream, ev, il);
  } else {
    writeTriennialEventHoliday(stream, ev as HolidayEvent, il);
  }
}

/**
 * @private
 */
function writeTriennialEventHoliday(
  stream: WriteStream,
  ev: HolidayEvent,
  il: boolean
) {
  const reading = getLeyningForHoliday(ev, il);
  if (reading) {
    const key = getLeyningKeyForEvent(ev, il);
    const year = ev.getDate().getFullYear();
    const yearNum = Triennial.getYearNumber(year) - 1;
    const triHaft = getTriennialHaftaraForHoliday(key!, yearNum);
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
 */
function writeTriennialEventParsha(
  stream: WriteStream,
  ev: Event,
  il: boolean
) {
  const triReading = getTriennialForParshaHaShavua(ev, il);
  if (triReading && triReading.aliyot) {
    const reading = getLeyningForParshaHaShavua(ev, il);
    reading.fullkriyah = triReading.aliyot;
    reading.triHaftara = triReading.haftara;
    reading.triHaftaraNumV = triReading.haftaraNumV;
    writeCsvLines(stream, ev, reading, il, true);
  }
}

/**
 * @private
 */
function ignore(ev: Event): boolean {
  const mask = ev.getFlags();
  if (mask === flags.SPECIAL_SHABBAT) {
    return true;
  }
  if (mask !== flags.ROSH_CHODESH) {
    return false;
  }
  return ev.getDate().getDay() === 6;
}
