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

## [API Documentation](https://hebcal.github.io/api/triennial/index.html)
