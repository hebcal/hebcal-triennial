import {cloneHaftara, sumVerses, makeSummaryFromParts} from '@hebcal/leyning';
import triennialHaft from './triennial-haft.json';

/**
 * Looks up the alternative triennial Haftara for a given parsha
 *
 * INSTRUCTIONS REGARDING DOUBLE PARSHIYOT
 *
 * In any 3 year sequence, in some years these parshiyot are read together
 * and in some they are read separately.
 * When separated: read the next haftarah of the parashah being read.
 * When together: when reading the first third, read the next haftarah
 * of the first parashah, when reading the latter two thirds, read the
 * next haftarah of the latter parashah
 * @private
 * @param {string[]} parsha
 * @param {number} yearNum 0, 1, or 2
 * @return {Object}
 */
export function getTriennialHaftara(parsha, yearNum) {
  const idx = (parsha.length === 1 || yearNum === 0) ? 0 : 1;
  const name = parsha[idx];
  const triHaft = triennialHaft[name];
  const triHaft2 = triHaft?.[yearNum + 1];
  if (typeof triHaft2 === 'object') {
    const haft = cloneHaftara(triHaft2);
    return {
      haft: haft,
      haftara: makeSummaryFromParts(haft),
      haftaraNumV: sumVerses(haft),
    };
  }
  return {};
}

/**
 * Looks up the alternative triennial Haftara for a holiday
 * @param {string} key
 * @param {number} yearNum
 * @return {Object}
 */
export function getTriennialHaftaraForHoliday(key, yearNum) {
  if (key === 'Tish\'a B\'Av') {
    return getTriennialHaftara([key], yearNum);
  }
  const triHaft2 = triennialHaft._holidays[key];
  if (typeof triHaft2 === 'object') {
    const haft = cloneHaftara(triHaft2);
    return {
      haft: haft,
      haftara: makeSummaryFromParts(haft),
      haftaraNumV: sumVerses(haft),
    };
  }
  return undefined;
}
