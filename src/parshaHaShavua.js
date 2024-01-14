import {Event, flags, months} from '@hebcal/core';
import {specialReadings2, parshaToString} from '@hebcal/leyning';
import {getTriennialHaftara} from './haftara.js';
import {getTriennial} from './triennial.js';

/**
 * Looks up the triennial leyning for this Parashat HaShavua
 * @param {Event} ev
 * @param {boolean} [il] Israel
 * @return {TriennialAliyot} a map of aliyot 1-7 plus "M"
 */
export function getTriennialForParshaHaShavua(ev, il = false) {
  if (!ev instanceof Event) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() != flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Event must be parsha hashavua: ${ev.getDesc()}`);
  }
  const hd = ev.getDate();
  const hyear0 = hd.getFullYear();
  const parsha = ev.parsha;
  // When Nitzavim & Vayeilech are not combined, they should each be read in their entirety.
  // Vayeilech can occur immediately after RH, so back up one year to pick up
  // the tail end of previous 3-year cycle.
  const p1 = parsha[0];
  const hyear = (p1 === 'Vayeilech' && hd.getMonth() === months.TISHREI) ? hyear0 - 1 : hyear0;
  const triennial = getTriennial(hyear, il);
  const startYear = triennial.getStartYear();
  const yearNum = hyear - startYear;
  const name = parshaToString(parsha); // untranslated
  const reading = triennial.getReading(name, yearNum);
  if (typeof reading !== 'object') {
    throw new ReferenceError(`Can't load reading for ${name} in ${hyear} (year number ${yearNum})`);
  }
  // possibly replace 7th aliyah and/or maftir
  const special = specialReadings2(parsha, hd, il, reading.aliyot);
  const reason = special.reason;
  const aliyotMap = special.aliyot;
  for (const [num, str] of Object.entries(reason)) {
    const aliyah = aliyotMap[num];
    if (typeof aliyah === 'object') {
      aliyah.reason = str;
    }
  }
  reading.yearNum = yearNum;
  reading.aliyot = aliyotMap;
  if (!special.haft) {
    const triHaft = getTriennialHaftara(parsha, yearNum);
    Object.assign(reading, triHaft);
  }
  return reading;
}
