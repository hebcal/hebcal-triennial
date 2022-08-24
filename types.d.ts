/// <reference types="node"/>

import {Event} from '@hebcal/core';
import {AliyotMap} from '@hebcal/leyning';
import {WriteStream} from 'fs';

declare module '@hebcal/triennial' {
    /**
     * Represents triennial aliyot for a given date
     */
    export type TriennialAliyot = {
        /** Map of aliyot `1` through `7` plus `M` for maftir */
        aliyot: AliyotMap;
        /** year number, 0-2 */
        yearNum: number;
        /** Shabbat date for when this parsha is read in this 3-year cycle */
        date: Date;
        /** true if a double parsha is read separately in year `yearNum` */
        readSeparately?: boolean;
        /** Shabbat date of the first part of a read-separately aliyah pair */
        date1?: Date;
        /** Shabbat date of the second part of a read-separately aliyah pair */
        date2?: Date;
    };

    /**
     * Triennial Torah readings
     */
    export class Triennial {
        constructor(hebrewYear: number);
        getReading(parsha: string, yearNum: number): TriennialAliyot;
        getStartYear(): number;
        debug(): string;
        /**
         * Returns triennial year 1, 2 or 3 based on this Hebrew year
         * @param year Hebrew year
         */
        static getYearNumber(year: number): number;
        /**
         * Returns Hebrew year that this 3-year triennial cycle began
         * @param year Hebrew year
         */
        static getCycleStartYear(year: number): number;
    }

    /**
     * Calculates the 3-year readings for a given year
     * @param year - Hebrew year
     */
    export function getTriennial(year: number): Triennial;

    /**
     * Looks up triennial leyning for a regular Shabbat parsha.
     * @param ev - the Hebcal event associated with this parsha
     * @returns a map of aliyot 1-7 plus "M"
     */
    export function getTriennialForParshaHaShavua(ev: Event): TriennialAliyot;

    export function getTriennialHaftaraForHoliday(holiday: string, yearNum: number): any;

    export function writeTriennialCsv(stream: WriteStream, hyear: number): void;
}
