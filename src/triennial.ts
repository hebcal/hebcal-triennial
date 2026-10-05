import QuickLRU from 'quick-lru';
import {HDate, months} from '@hebcal/hdate';
import {
  type NumberOrString,
  parshiot,
  getSedra,
} from '@hebcal/core/dist/esm/sedra';
import type {
  Aliyah,
  AliyotMap,
  StringMap,
  TorahBook,
} from '@hebcal/leyning/dist/esm/types';
import {BOOK, calculateNumVerses} from '@hebcal/leyning/dist/esm/common';
import triennialConfig0 from './triennial.json.js';

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
  /** Variation key used for this reading, such as `Y.1` or `D.3` */
  variation?: string;
};

const VEZOT_HABERAKHAH = 'Vezot Haberakhah';
// N.B. these are 0-based indices
const doubled: readonly number[] = [
  21, // Vayakhel-Pekudei
  26, // Tazria-Metzora
  28, // Achrei Mot-Kedoshim
  31, // Behar-Bechukotai
  38, // Chukat-Balak
  41, // Matot-Masei
  50, // Nitzavim-Vayeilech
];
const isSometimesDoubled: ReadonlySet<number> = new Set(
  doubled.flatMap(id => [id, id + 1])
);

/**
 * takes a 0-based (Bereshit=0) parsha ID
 * @private
 */
function getDoubledName(id: number): string {
  return `${parshiot[id]}-${parshiot[id + 1]}`;
}

/** Map lookup for keys that are known to be present */
function getOrThrow<K, V>(map: ReadonlyMap<K, V>, key: K): V {
  const value = map.get(key);
  if (value === undefined) {
    throw new InternalError(`can't find ${String(key)}??`);
  }
  return value;
}

let triennialAliyot: Map<string, Map<string, AliyotMap>> | undefined;

function getTriennialAliyot(): Map<string, Map<string, AliyotMap>> {
  return (triennialAliyot ??= makeTriennialAliyot());
}

/** `[begin, end]` or `[begin, end, reason]` */
type JsonAliyah = string[];

type JsonAliyot = Record<string, JsonAliyah>;

type JsonAliyotMap = Record<string, JsonAliyot>;

type JsonVariationMap = Record<string, JsonAliyot | string>;

type JsonParsha = {
  book: number;
  descr?: string;
  fullParsha?: boolean;
  years?: JsonAliyotMap;
  variations?: JsonVariationMap;
  patterns?: StringMap;
};

type Parshiyot = Record<string, JsonParsha>;

const triennialConfig = triennialConfig0 as Parshiyot;

class InternalError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InternalError';
  }
}

/** Triennial Torah readings */
export class Triennial {
  private readonly startYear: number;
  private readonly il: boolean;
  private readonly sedraArray: readonly NumberOrString[];
  private readonly bereshit: readonly number[];
  private readonly firstSaturday: number;
  private readonly variationOptions: Map<string, string>;
  private readonly readings: Map<string, TriennialAliyot[]>;
  /**
   * Calculates Triennial schedule for entire Hebrew year
   * @param [hebrewYear] Hebrew Year (default current year)
   * @param [il] Israel (default false)
   */
  constructor(hebrewYear?: number, il = false) {
    // `||` rather than `??` so that JS callers passing 0 still get the current year
    const year = hebrewYear || new HDate().getFullYear();
    if (year < 5744) {
      throw new RangeError(`Invalid Triennial year ${year}`);
    }

    this.startYear = Triennial.getCycleStartYear(year);
    this.il = il;
    const sedraArray: NumberOrString[] = [];
    const bereshit: number[] = [];
    for (let yr = 0; yr < 4; yr++) {
      const arr = getSedra(this.startYear + yr, il).getSedraArray();
      bereshit.push(sedraArray.length + arr.indexOf(0));
      sedraArray.push(...arr);
    }
    this.sedraArray = sedraArray;
    this.bereshit = bereshit;
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
      for (const aliyah of Object.values(reading.aliyot)) {
        calculateNumVerses(aliyah);
      }
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
    return year - (Triennial.getYearNumber(year) - 1);
  }

  /**
   * First, determine if a doubled parsha is read [T]ogether or [S]eparately
   * in each of the 3 years. Yields a pattern like 'SSS', 'STS', 'TTT', 'TTS'.
   */
  private getThreeYearPattern(id: number): string {
    let pattern = '';
    for (let yr = 0; yr <= 2; yr++) {
      let found = this.sedraArray.indexOf(-id, this.bereshit[yr]);
      if (found > this.bereshit[yr + 1]) {
        found = -1;
      }
      pattern += found === -1 ? 'S' : 'T';
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
      if (variation === undefined) {
        throw new TypeError(
          `Can't find pattern ${pattern} for ${name}, startYear=${this.startYear}`
        );
      }
      map.set(name, variation);
      map.set(parshiot[id], variation);
      map.set(parshiot[id + 1], variation);
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
    const names = [
      ...parshiot,
      VEZOT_HABERAKHAH,
      ...doubled.map(getDoubledName),
    ];
    for (const parsha of names) {
      readings.set(parsha, new Array(3));
    }
    for (let yr = 0; yr <= 2; yr++) {
      this.cycleReadingsForYear(readings, yr);
    }
    return readings;
  }

  private cycleReadingsForYear(
    readings: Map<string, TriennialAliyot[]>,
    yr: number
  ): void {
    const allAliyot = getTriennialAliyot();
    const slot = (name: string) => getOrThrow(readings, name);
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
      const variation = `${variationKey}.${yr + 1}`;
      const a = getOrThrow(allAliyot, name).get(variation);
      if (!a) {
        throw new InternalError(
          `can't find ${name} variation ${variation} (year ${yr})`
        );
      }
      const aliyot: AliyotMap = structuredClone(a);
      // calculate numVerses for the subset of aliyot that don't cross chapter boundaries
      for (const aliyah of Object.values(aliyot)) {
        calculateNumVerses(aliyah);
      }
      slot(name)[yr] = {
        aliyot,
        date: new HDate(this.firstSaturday + i * 7),
        variation,
      };
    }
    // create links for doubled
    for (const id of doubled) {
      const h = getDoubledName(id);
      const combined = slot(h)[yr];
      const p1 = slot(parshiot[id]);
      const p2 = slot(parshiot[id + 1]);
      if (combined) {
        p1[yr] = p2[yr] = {
          readTogether: h,
          date: combined.date,
          variation: combined.variation,
        };
      } else {
        slot(h)[yr] = {
          readSeparately: true,
          date1: p1[yr].date,
          date2: p2[yr].date,
          variation: p1[yr].variation,
        };
      }
    }
    const vezotAliyot = getOrThrow(
      getOrThrow(allAliyot, VEZOT_HABERAKHAH),
      'Y.1'
    );
    const mday = this.il ? 22 : 23;
    slot(VEZOT_HABERAKHAH)[yr] = {
      aliyot: structuredClone(vezotAliyot),
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
  book: TorahBook,
  triennial: JsonParsha
): Map<string, AliyotMap> {
  const variations: JsonVariationMap | JsonAliyotMap | undefined =
    triennial.years ?? triennial.variations;
  if (variations === undefined) {
    throw new Error(`Parashat ${parsha} has no years or variations`);
  }
  // first pass, copy only alyiot definitions from triennialConfig into lookup table
  const lookup = new Map<string, AliyotMap>();
  for (const [variation, aliyot] of Object.entries(variations)) {
    if (typeof aliyot === 'object') {
      const dest: AliyotMap = {};
      for (const [num, [b, e, reason]] of Object.entries(aliyot)) {
        const reading: Aliyah = {k: book, b, e};
        if (reason !== undefined) {
          reading.reason = reason;
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
      if (dest === undefined) {
        throw new InternalError(
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
      throw new InternalError(`misconfiguration: ${parsha}`);
    }
    const book = BOOK[value.book];
    const lookup = resolveSameAs(parsha, book, value);
    triennialAliyot.set(parsha, lookup);
  }
  return triennialAliyot;
}

const __cache = new QuickLRU<string, Triennial>({maxSize: 25});

/**
 * Calculates the 3-year readings for a given year
 * @param year Hebrew year
 * @param [il] Israel
 */
export function getTriennial(year: number, il = false): Triennial {
  const cycleStartYear = Triennial.getCycleStartYear(year);
  const key = `${il ? 1 : 0}-${cycleStartYear}`;
  const cached = __cache.get(key);
  if (cached) {
    return cached;
  }
  const tri = new Triennial(cycleStartYear, il);
  __cache.set(key, tri);
  return tri;
}
