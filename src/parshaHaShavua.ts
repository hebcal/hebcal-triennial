import {months} from '@hebcal/hdate';
import {Event, flags} from '@hebcal/core/dist/esm/event';
import {ParshaEvent} from '@hebcal/core/dist/esm/ParshaEvent';
import {parshaToString} from '@hebcal/leyning/dist/esm/common';
import {specialReadings2} from '@hebcal/leyning/dist/esm/specialReadings';
import {getTriennialHaftara} from './haftara';
import {getTriennial, TriennialAliyot} from './triennial';

/**
 * Looks up the triennial leyning for this Parashat HaShavua
 * @returns a map of aliyot 1-7 plus "M"
 */
export function getTriennialForParshaHaShavua(
  ev: Event,
  il = false
): TriennialAliyot {
  if (!(ev instanceof Event)) {
    throw new TypeError(`Bad event argument: ${ev}`);
  } else if (ev.getFlags() !== flags.PARSHA_HASHAVUA) {
    throw new TypeError(`Bad event argument: ${ev.getDesc()}`);
  }
  const hd = ev.getDate();
  const hyear0 = hd.getFullYear();
  const parshaEv = ev as ParshaEvent;
  const parsha = parshaEv.parsha;
  // When Nitzavim & Vayeilech are not combined, they should each be read in their entirety.
  // Vayeilech can occur immediately after RH, so back up one year to pick up
  // the tail end of previous 3-year cycle.
  const p1 = parsha[0];
  const hyear =
    p1 === 'Vayeilech' && hd.getMonth() === months.TISHREI
      ? hyear0 - 1
      : hyear0;
  const triennial = getTriennial(hyear, il);
  const startYear = triennial.getStartYear();
  const yearNum = hyear - startYear;
  const name = parshaToString(parsha); // untranslated
  const reading = triennial.getReading(name, yearNum);
  if (typeof reading !== 'object') {
    throw new ReferenceError(
      `Can't load reading for ${name} in ${hyear} (year number ${yearNum})`
    );
  }
  // possibly replace 7th aliyah and/or maftir
  const special = specialReadings2(parsha, hd, il, reading.aliyot!);
  const reason = special.reason;
  const aliyotMap = special.aliyot;
  for (const [num, str] of Object.entries(reason)) {
    const aliyah = aliyotMap[num];
    if (typeof aliyah === 'object') {
      aliyah.reason = str;
    }
  }
  // reading.yearNum = yearNum;
  reading.aliyot = aliyotMap;
  if (!special.haft) {
    const triHaft = getTriennialHaftara(parsha, yearNum);
    if (triHaft) {
      Object.assign(reading, triHaft);
    }
  }
  return reading;
}
