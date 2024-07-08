import {
  Aliyah,
  cloneHaftara,
  makeSummaryFromParts,
  sumVerses,
} from '@hebcal/leyning';
import triennialHaftHolidays0 from './tri-haft-holidays.json';
import triennialHaft0 from './triennial-haft.json';

export type TriHaftarah = {
  /** Haftarah object */
  haft: Aliyah | Aliyah[];
  /** Haftarah, such as `Isaiah 42:5 – 43:11` */
  haftara: string;
  /** Number of verses in the Haftarah */
  haftaraNumV?: number;
};

type TriennialHaftAliyah = Aliyah & {note?: string};

type TriennialHaftYearMap = {
  [key: string]: TriennialHaftAliyah | TriennialHaftAliyah[];
};

type TriennialHaft = {
  [key: string]: TriennialHaftYearMap;
};

const triennialHaft = triennialHaft0 as TriennialHaft;

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
 */
export function getTriennialHaftara(
  parsha: string[],
  yearNum: number
): TriHaftarah | undefined {
  const idx = parsha.length === 1 || yearNum === 0 ? 0 : 1;
  const name = parsha[idx];
  const triHaft = triennialHaft[name];
  const triHaft2 = triHaft?.[yearNum + 1];
  // Normal condition if missing, e.g., Devarim and Vaetchanan are the same as full kriyah
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

const triennialHaftHolidays = triennialHaftHolidays0 as TriennialHaftYearMap;

/**
 * Looks up the alternative triennial Haftara for a holiday
 */
export function getTriennialHaftaraForHoliday(
  key: string,
  yearNum: number
): TriHaftarah | undefined {
  if (key === "Tish'a B'Av") {
    return getTriennialHaftara([key], yearNum);
  }
  const triHaft2 = triennialHaftHolidays[key];
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
