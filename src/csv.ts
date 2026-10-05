import type {Event} from '@hebcal/core/dist/esm/event';
import type {HolidayEvent} from '@hebcal/core/dist/esm/HolidayEvent';
import {getHolidaysForYearArray} from '@hebcal/core/dist/esm/holidays';
import {getLeyningForParshaHaShavua} from '@hebcal/leyning/dist/esm/leyning';
import {getLeyningKeyForEvent} from '@hebcal/leyning/dist/esm/getLeyningKeyForEvent';
import {getLeyningForHoliday} from '@hebcal/leyning/dist/esm/getLeyningForHoliday';
import {
  getParshaDates,
  writeCsvLines,
  writeHolidayMincha,
} from '@hebcal/leyning/dist/esm/csv';
import type {WriteStream} from 'node:fs';
import {getTriennialHaftaraForHoliday} from './haftara.js';
import {getTriennialForParshaHaShavua} from './parshaHaShavua.js';
import {Triennial} from './triennial.js';
import {parshaYear} from '@hebcal/core/dist/esm/parshaYear';

export function writeTriennialCsv(
  stream: WriteStream,
  hyear: number,
  il = false
): void {
  const events0 = getParshaAndHolidayEvents(hyear, il);
  const events = events0.filter(ev => ev.getDesc() !== 'Rosh Chodesh Tevet');
  const parshaDates = getParshaDates(events);
  stream.write('"Date","Parashah","Aliyah","Triennial Reading","Verses"\r\n');
  for (const ev of events) {
    if (
      ev.hasFlag('PARSHA_HASHAVUA') ||
      !parshaDates[ev.getDate().toString()]
    ) {
      writeTriennialEvent(stream, ev, il);
    }
  }
}

function getParshaAndHolidayEvents(hyear: number, il: boolean): Event[] {
  const years = [hyear, hyear + 1, hyear + 2];
  return years.flatMap(year => {
    const events: Event[] = [
      ...parshaYear(year, il),
      ...getHolidaysForYearArray(year, il),
    ];
    return events.sort((a, b) => a.getDate().abs() - b.getDate().abs());
  });
}

/**
 * @private
 */
export function writeTriennialEvent(
  stream: WriteStream,
  ev: Event,
  il: boolean
): void {
  if (ignore(ev)) {
    return;
  }
  if (ev.hasFlag('PARSHA_HASHAVUA')) {
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
): void {
  const reading = getLeyningForHoliday(ev, il);
  if (reading) {
    const key = getLeyningKeyForEvent(ev, il);
    const year = ev.getDate().getFullYear();
    const yearNum = Triennial.getYearNumber(year) - 1;
    const triHaft = key && getTriennialHaftaraForHoliday(key, yearNum);
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
): void {
  const triReading = getTriennialForParshaHaShavua(ev, il);
  if (triReading?.aliyot) {
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
  if (ev.hasFlag('SPECIAL_SHABBAT')) {
    return true;
  }
  if (!ev.hasFlag('ROSH_CHODESH')) {
    return false;
  }
  return ev.getDate().getDay() === 6;
}
