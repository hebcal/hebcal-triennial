import {HDate, months} from '@hebcal/hdate';
import {parshiot, getSedra} from '@hebcal/core/dist/esm/sedra';
import {Aliyah, AliyotMap, StringMap} from '@hebcal/leyning/dist/esm/types';
import {BOOK, calculateNumVerses} from '@hebcal/leyning/dist/esm/common';
import {clone} from '@hebcal/leyning/dist/esm/clone';
import triennialConfig0 from './triennial.json';

/**
 * Represents triennial aliyot for a given date
 */
export type TriennialAliyot = {
  /** Map of aliyot `1` through `7` plus `M` for maftir */
  aliyot?: AliyotMap;
  /** year number, 0-2 */
  yearNum?: number;
  /** Shabbat date for when this parsha is read in this 3-year cycle */
  date?: HDate;
  /** true if a double parsha is read separately in year `yearNum` */
  readSeparately?: boolean;
  /** if read together, the name of the combined parsha */
  readTogether?: string;
  /** Shabbat date of the first part of a read-separately aliyah pair */
  date1?: HDate;
  /** Shabbat date of the second part of a read-separately aliyah pair */
  date2?: HDate;
  /** true if we read the entire parsha */
  fullParsha?: boolean;
  /** Triennial Haftarah object */
  haft?: Aliyah | Aliyah[];
  /** Triennial Haftarah string, such as `Isaiah 42:5 – 43:11` */
  haftara?: string;
  /** Number of verses in the Haftarah */
  haftaraNumV?: number;
  variation?: string;
};

const VEZOT_HABERAKHAH = 'Vezot Haberakhah';
const isSometimesDoubled = new Set<number>();
// N.B. these are 0-based indices
const doubled = [
  21, // Vayakhel-Pekudei
  26, // Tazria-Metzora
  28, // Achrei Mot-Kedoshim
  31, // Behar-Bechukotai
  38, // Chukat-Balak
  41, // Matot-Masei
  50, // Nitzavim-Vayeilech
];
for (const id of doubled) {
  isSometimesDoubled.add(id);
  isSometimesDoubled.add(id + 1);
}

/**
 * takes a 0-based (Bereshit=0) parsha ID
 * @private
 */
function getDoubledName(id: number): string {
  const p1 = parshiot[id];
  const p2 = parshiot[id + 1];
  const name = p1 + '-' + p2;
  return name;
}

let triennialAliyot: Map<string, Map<string, AliyotMap>>;

type JsonAliyah = string[];

type JsonAliyot = {[key: string]: JsonAliyah};

type JsonAliyotMap = {[key: string]: JsonAliyot};

type JsonVariationMap = {[key: string]: JsonAliyot | string};

type JsonParsha = {
  book: number;
  descr?: string;
  fullParsha?: boolean;
  years?: JsonAliyotMap;
  variations?: JsonVariationMap;
  patterns?: StringMap;
};

type Parshiyot = {
  [key: string]: JsonParsha;
};

const triennialConfig = triennialConfig0 as Parshiyot;

/** Triennial Torah readings */
export class Triennial {
  private startYear: number;
  private il: boolean;
  private sedraArray: (number | string)[];
  private bereshit: number[];
  private firstSaturday: number;
  private variationOptions: Map<string, string>;
  private readings: Map<string, TriennialAliyot[]>;
  /**
   * Calculates Triennial schedule for entire Hebrew year
   * @param [hebrewYear] Hebrew Year (default current year)
   * @param [il] Israel (default false)
   */
  constructor(hebrewYear?: number, il = false) {
    hebrewYear = hebrewYear || new HDate().getFullYear();
    if (hebrewYear < 5744) {
      throw new RangeError(`Invalid Triennial year ${hebrewYear}`);
    }
    if (!triennialAliyot) {
      triennialAliyot = makeTriennialAliyot();
    }

    this.startYear = Triennial.getCycleStartYear(hebrewYear);
    this.il = il;
    this.sedraArray = [];
    this.bereshit = Array(4);
    for (let yr = 0; yr < 4; yr++) {
      const sedra = getSedra(this.startYear + yr, il);
      const arr = sedra.getSedraArray();
      this.bereshit[yr] = this.sedraArray.length + arr.indexOf(0);
      this.sedraArray = this.sedraArray.concat(arr);
    }
    // find the first Saturday on or after Rosh Hashana
    const rh = new HDate(1, months.TISHREI, this.startYear);
    const firstSaturday = rh.onOrAfter(6);
    this.firstSaturday = firstSaturday.abs();
    this.variationOptions = this.calcVariationOptions();
    this.readings = this.cycleReadings();
  }

  /**
   * @param parsha parsha name ("Bereshit" or "Achrei Mot-Kedoshim")
   * @param yearNum 0 through 2 for which year of Triennial cycle
   * @returns result, including a map of aliyot 1-7 plus "M"
   */
  getReading(parsha: string, yearNum: number): TriennialAliyot {
    if (yearNum < 0 || yearNum > 2) {
      throw new RangeError(`invalid year number: ${yearNum}`);
    }
    const years = this.readings.get(parsha);
    if (!years) {
      throw new RangeError(`invalid parsha: ${parsha}`);
    }
    // don't use clone() here because we want to preserve HDate objects
    const reading0 = years[yearNum];
    const reading: TriennialAliyot = {...reading0};
    if (reading.aliyot) {
      Object.values(reading.aliyot).map((aliyah: Aliyah) =>
        calculateNumVerses(aliyah)
      );
    }
    if (triennialConfig[parsha].fullParsha) {
      reading.fullParsha = true;
    }
    reading.yearNum = yearNum;
    return reading;
  }

  getStartYear(): number {
    return this.startYear;
  }

  getIsrael(): boolean {
    return this.il;
  }

  /**
   * Returns triennial year 1, 2 or 3 based on this Hebrew year
   * @param year Hebrew year
   */
  static getYearNumber(year: number): number {
    if (year < 5744) {
      throw new RangeError(`Invalid Triennial year ${year}`);
    }
    return ((year - 5744) % 3) + 1;
  }

  /**
   * Returns Hebrew year that this 3-year triennial cycle began
   * @param year Hebrew year
   */
  static getCycleStartYear(year: number): number {
    return year - (this.getYearNumber(year) - 1);
  }

  /**
   * First, determine if a doubled parsha is read [T]ogether or [S]eparately
   * in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
   */
  private getThreeYearPattern(id: number): string {
    let pattern = '';
    for (let yr = 0; yr <= 2; yr++) {
      let found = this.sedraArray.indexOf(-1 * id, this.bereshit[yr]);
      if (found > this.bereshit[yr + 1]) {
        found = -1;
      }
      const pat = found === -1 ? 'S' : 'T';
      pattern += pat;
    }
    return pattern;
  }

  private calcVariationOptions(): Map<string, string> {
    const map = new Map<string, string>();
    for (const id of doubled) {
      const pattern = this.getThreeYearPattern(id);
      const name = getDoubledName(id);
      // Next, look up the pattern in JSON to determine readings for each year.
      // For "all-together", use "Y" pattern to imply Y.1, Y.2, Y.3
      const variation =
        pattern === 'TTT' ? 'Y' : triennialConfig[name].patterns?.[pattern];
      if (typeof variation === 'undefined') {
        throw new Error(
          `Can't find pattern ${pattern} for ${name}, startYear=${this.startYear}`
        );
      }
      const p1 = parshiot[id];
      const p2 = parshiot[id + 1];
      map.set(name, variation);
      map.set(p1, variation);
      map.set(p2, variation);
    }
    return map;
  }

  debug(): string {
    let str = `Triennial cycle started year ${this.startYear}\n`;
    for (const id of doubled) {
      const pattern = this.getThreeYearPattern(id);
      const name = getDoubledName(id);
      const variation = this.variationOptions.get(name);
      str += `  ${name} ${pattern} (${variation})\n`;
    }
    return str;
  }

  /**
   * Builds a lookup table readings["Bereshit"][0], readings["Matot-Masei"][2]
   */
  private cycleReadings(): Map<string, TriennialAliyot[]> {
    const readings = new Map<string, TriennialAliyot[]>();
    for (const parsha of parshiot) {
      readings.set(parsha, Array(3));
    }
    readings.set(VEZOT_HABERAKHAH, Array(3));
    const doubledNames = doubled.map(getDoubledName);
    for (const parsha of doubledNames) {
      readings.set(parsha, Array(3));
    }
    for (let yr = 0; yr <= 2; yr++) {
      this.cycleReadingsForYear(readings, yr);
    }
    return readings;
  }

  private cycleReadingsForYear(
    readings: Map<string, TriennialAliyot[]>,
    yr: number
  ) {
    if (!triennialAliyot) {
      throw new Error();
    }
    const startIdx = this.bereshit[yr];
    const endIdx = this.bereshit[yr + 1];
    for (let i = startIdx; i < endIdx; i++) {
      const id = this.sedraArray[i];
      if (typeof id !== 'number') {
        continue;
      }
      const name = id < 0 ? getDoubledName(-id) : parshiot[id];
      const variationKey = isSometimesDoubled.has(id)
        ? this.variationOptions.get(name)
        : 'Y';
      const variation = variationKey + '.' + (yr + 1);
      const variations = triennialAliyot.get(name);
      if (!variations) {
        throw new Error(`can't find ${name}??`);
      }
      const a = variations.get(variation);
      if (!a) {
        throw new Error(
          `can't find ${name} variation ${variation} (year ${yr})`
        );
      }
      const aliyot: AliyotMap = clone(a);
      // calculate numVerses for the subset of aliyot that don't cross chapter boundaries
      for (const aliyah of Object.values(aliyot)) {
        calculateNumVerses(aliyah);
      }
      readings.get(name)![yr] = {
        aliyot,
        date: new HDate(this.firstSaturday + i * 7),
        variation,
      };
    }
    // create links for doubled
    for (const id of doubled) {
      const h = getDoubledName(id);
      const combined = readings.get(h)![yr];
      const p1 = parshiot[id];
      const p2 = parshiot[id + 1];
      if (combined) {
        readings.get(p1)![yr] = readings.get(p2)![yr] = {
          readTogether: h,
          date: combined.date,
          variation: combined.variation,
        };
      } else {
        const r1 = readings.get(p1)![yr];
        readings.get(h)![yr] = {
          readSeparately: true,
          date1: r1.date,
          date2: readings.get(p2)![yr].date,
          variation: r1.variation,
        };
      }
    }
    const vezot = triennialAliyot.get(VEZOT_HABERAKHAH);
    const vezotAliyot = vezot!.get('Y.1');
    const mday = this.il ? 22 : 23;
    readings.get(VEZOT_HABERAKHAH)![yr] = {
      aliyot: clone(vezotAliyot),
      date: new HDate(mday, months.TISHREI, this.startYear + yr),
      variation: 'Y.1',
    };
  }
}

/**
 * Transforms input JSON with sameAs shortcuts like "D.2":"A.3" to
 * actual aliyot objects for a given variation/year
 * @private
 */
function resolveSameAs(
  parsha: string,
  book: string,
  triennial: JsonParsha
): Map<string, AliyotMap> {
  const variations: JsonVariationMap | JsonAliyotMap | undefined =
    triennial.years || triennial.variations;
  if (typeof variations === 'undefined') {
    throw new Error(`Parashat ${parsha} has no years or variations`);
  }
  // first pass, copy only alyiot definitions from triennialConfig into lookup table
  const lookup = new Map<string, AliyotMap>();
  for (const [variation, aliyot] of Object.entries(variations)) {
    if (typeof aliyot === 'object') {
      const dest: AliyotMap = {};
      for (const [num, src] of Object.entries(aliyot)) {
        const reading: Aliyah = {k: book, b: src[0], e: src[1]};
        if (src.length === 3) {
          reading.reason = src[2];
        }
        dest[num] = reading;
      }
      lookup.set(variation, dest);
    }
  }
  // second pass to resolve sameas strings (to simplify later lookups)
  for (const [variation, aliyot] of Object.entries(variations)) {
    if (typeof aliyot === 'string') {
      const dest = lookup.get(aliyot);
      if (typeof dest === 'undefined') {
        throw new Error(
          `Can't find source for ${parsha} ${variation} sameas=${aliyot}`
        );
      }
      lookup.set(variation, dest);
    }
  }
  return lookup;
}

/**
 * Walks triennialConfig and builds lookup table for triennial aliyot
 * @private
 */
function makeTriennialAliyot(): Map<string, Map<string, AliyotMap>> {
  const triennialAliyot = new Map<string, Map<string, AliyotMap>>();
  // build a lookup table so we don't have to follow num/variation/sameas
  for (const [parsha, value] of Object.entries(triennialConfig)) {
    if (typeof value !== 'object' || typeof value.book !== 'number') {
      throw new Error(`misconfiguration: ${parsha}`);
    }
    const book = BOOK[value.book];
    const lookup = resolveSameAs(parsha, book, value);
    triennialAliyot.set(parsha, lookup);
  }
  return triennialAliyot;
}

const __cache = new Map<string, Triennial>();

/**
 * Calculates the 3-year readings for a given year
 * @param year Hebrew year
 * @param [il] Israel
 */
export function getTriennial(year: number, il = false): Triennial {
  const cycleStartYear = Triennial.getCycleStartYear(year);
  const prefix = il ? '1-' : '0-';
  const key = prefix + cycleStartYear;
  const cached = __cache.get(key);
  if (cached) {
    return cached;
  }
  const tri = new Triennial(cycleStartYear, il);
  __cache.set(key, tri);
  return tri;
}
