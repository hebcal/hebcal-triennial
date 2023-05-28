# @hebcal/triennial
Javascript Triennial Torah Readings

[![Build Status](https://github.com/hebcal/hebcal-triennial/actions/workflows/node.js.yml/badge.svg)](https://github.com/hebcal/hebcal-triennial/actions/workflows/node.js.yml)

“Many congregations pattern their weekly Torah reading cycle after a system
similar to the one used in ancient Israel during the rabbinic period. In
this system, the traditional parashiot are each divided into three shorter
segments, and the whole Torah is completed once every three years. The
system has both advantages and disadvantages, but its ability to shorten
the length of Torah reading without sacrificing the complete reading of the
Torah on a regular basis has made it the choice of some synagogues in the
Conservative Movement.”

[A Complete Triennial System for Reading the Torah, Committee on Jewish Law and Standards of the Rabbinical Assembly](https://www.rabbinicalassembly.org/sites/default/files/public/halakhah/teshuvot/19861990/eisenberg_triennial.pdf)

Update December 2021: In November 2020, the CJLS modified the triennial
cycle for some combined parshiyot to change the reading for year 3 to be
the third section of the parashah.

[Modification of the Triennial Cycle Readings for Combined Parashot in Certain Years](https://www.rabbinicalassembly.org/sites/default/files/2021-09/cohen-triennial.pdf), Rabbi Miles B. Cohen

Update August 2022: Incorporated [An Emendation to Richard Eisenberg’s Complete Triennial System for Reading Torah, to Address a Rare Situation](https://www.rabbinicalassembly.org/sites/default/files/public/halakhah/teshuvot/2011-2020/heller-triennial-emendation.pdf), Rabbi Joshua Heller, 2012

## Installation
```bash
$ npm install @hebcal/triennial
```

## Synopsis
```javascript
import {HebrewCalendar, HDate, Event} from '@hebcal/core';
import {formatAliyahWithBook} from '@hebcal/leyning';
import {getTriennialForParshaHaShavua} from '@hebcal/triennial';

const events = HebrewCalendar.calendar({sedrot: true, noHolidays: true});
const ev = events.find((ev) => ev.getDesc() == 'Parashat Pinchas');
const triReading = getTriennialForParshaHaShavua(ev);
for (const [num, aliyah] of Object.entries(triReading)) {
  const number = num == 'M' ? 'maftir' : `aliyah ${num}`;
  const str = formatAliyahWithBook(aliyah);
  console.log(`Triennial ${number}: ${str}`);
}
```

## Classes

<dl>
<dt><a href="#Triennial">Triennial</a></dt>
<dd><p>Triennial Torah readings</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#getTriennial">getTriennial(year, [il])</a> ⇒ <code><a href="#Triennial">Triennial</a></code></dt>
<dd><p>Calculates the 3-year readings for a given year</p>
</dd>
<dt><a href="#getTriennialForParshaHaShavua">getTriennialForParshaHaShavua(ev, [il])</a> ⇒ <code><a href="#TriennialAliyot">TriennialAliyot</a></code></dt>
<dd><p>Looks up the triennial leyning for this Parashat HaShavua</p>
</dd>
<dt><a href="#getTriennialHaftaraForHoliday">getTriennialHaftaraForHoliday(key, yearNum)</a> ⇒ <code>Object</code></dt>
<dd><p>Looks up the alternative triennial Haftara for a holiday</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#TriennialAliyot">TriennialAliyot</a> : <code>Object</code></dt>
<dd><p>Represents triennial aliyot for a given date</p>
</dd>
</dl>

<a name="Triennial"></a>

## Triennial
Triennial Torah readings

**Kind**: global class  

* [Triennial](#Triennial)
    * [new Triennial([hebrewYear], [il])](#new_Triennial_new)
    * _instance_
        * [.getReading(parsha, yearNum)](#Triennial+getReading) ⇒ <code>Object.&lt;string, Aliyah&gt;</code>
        * [.getStartYear()](#Triennial+getStartYear) ⇒ <code>number</code>
        * [.debug()](#Triennial+debug) ⇒ <code>string</code>
    * _static_
        * [.getYearNumber(year)](#Triennial.getYearNumber) ⇒ <code>number</code>
        * [.getCycleStartYear(year)](#Triennial.getCycleStartYear) ⇒ <code>number</code>

<a name="new_Triennial_new"></a>

### new Triennial([hebrewYear], [il])
Calculates Triennial schedule for entire Hebrew year


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [hebrewYear] | <code>number</code> |  | Hebrew Year (default current year) |
| [il] | <code>boolean</code> | <code>false</code> | Israel (default false) |

<a name="Triennial+getReading"></a>

### triennial.getReading(parsha, yearNum) ⇒ <code>Object.&lt;string, Aliyah&gt;</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
**Returns**: <code>Object.&lt;string, Aliyah&gt;</code> - a map of aliyot 1-7 plus "M"  

| Param | Type | Description |
| --- | --- | --- |
| parsha | <code>string</code> | parsha name ("Bereshit" or "Achrei Mot-Kedoshim") |
| yearNum | <code>number</code> | 0 through 2 for which year of Triennial cycle |

<a name="Triennial+getStartYear"></a>

### triennial.getStartYear() ⇒ <code>number</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial+debug"></a>

### triennial.debug() ⇒ <code>string</code>
**Kind**: instance method of [<code>Triennial</code>](#Triennial)  
<a name="Triennial.getYearNumber"></a>

### Triennial.getYearNumber(year) ⇒ <code>number</code>
Returns triennial year 1, 2 or 3 based on this Hebrew year

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="Triennial.getCycleStartYear"></a>

### Triennial.getCycleStartYear(year) ⇒ <code>number</code>
Returns Hebrew year that this 3-year triennial cycle began

**Kind**: static method of [<code>Triennial</code>](#Triennial)  

| Param | Type | Description |
| --- | --- | --- |
| year | <code>number</code> | Hebrew year |

<a name="getTriennial"></a>

## getTriennial(year, [il]) ⇒ [<code>Triennial</code>](#Triennial)
Calculates the 3-year readings for a given year

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| year | <code>number</code> |  | Hebrew year |
| [il] | <code>boolean</code> | <code>false</code> | Israel |

<a name="getTriennialForParshaHaShavua"></a>

## getTriennialForParshaHaShavua(ev, [il]) ⇒ [<code>TriennialAliyot</code>](#TriennialAliyot)
Looks up the triennial leyning for this Parashat HaShavua

**Kind**: global function  
**Returns**: [<code>TriennialAliyot</code>](#TriennialAliyot) - a map of aliyot 1-7 plus "M"  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| ev | <code>Event</code> |  |  |
| [il] | <code>boolean</code> | <code>false</code> | Israel |

<a name="getTriennialHaftaraForHoliday"></a>

## getTriennialHaftaraForHoliday(key, yearNum) ⇒ <code>Object</code>
Looks up the alternative triennial Haftara for a holiday

**Kind**: global function  

| Param | Type |
| --- | --- |
| key | <code>string</code> | 
| yearNum | <code>number</code> | 

<a name="TriennialAliyot"></a>

## TriennialAliyot : <code>Object</code>
Represents triennial aliyot for a given date

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| aliyot | <code>Object.&lt;string, Aliyah&gt;</code> | a map of aliyot 1-7 plus "M" |
| yearNum | <code>number</code> | year number, 0-2 |
| date | <code>Date</code> | Shabbat date for when this parsha is read in this 3-year cycle |
| [readSeparately] | <code>boolean</code> | true if a double parsha is read separately in year `yearNum` |
| [date1] | <code>Date</code> | Shabbat date of the first part of a read-separately aliyah pair |
| [date2] | <code>Date</code> | Shabbat date of the second part of a read-separately aliyah pair |

