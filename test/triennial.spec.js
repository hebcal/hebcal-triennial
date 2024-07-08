import {HDate} from '@hebcal/core';
import {Triennial} from '../src/triennial';

test('triennial', () => {
  const tri = new Triennial(5777);
  const expected = [
    {
      aliyot: {
        '1': {k: 'Exodus', b: '35:1', e: '35:10', v: 10},
        '2': {k: 'Exodus', b: '35:11', e: '35:20', v: 10},
        '3': {k: 'Exodus', b: '35:21', e: '35:29', v: 9},
        '4': {k: 'Exodus', b: '35:30', e: '36:7', v: 13},
        '5': {k: 'Exodus', b: '36:8', e: '36:19', v: 12},
        '6': {k: 'Exodus', b: '36:20', e: '36:38', v: 19},
        '7': {k: 'Exodus', b: '37:1', e: '37:16', v: 16},
        'M': {k: 'Exodus', b: '37:10', e: '37:16', v: 7},
      },
      date: new HDate(736413),
      variation: 'Y.1',
      yearNum: 0,
    },
    {
      aliyot: {
        '1': {k: 'Exodus', b: '37:17', e: '37:24', v: 8},
        '2': {k: 'Exodus', b: '37:25', e: '37:29', v: 5},
        '3': {k: 'Exodus', b: '38:1', e: '38:8', v: 8},
        '4': {k: 'Exodus', b: '38:9', e: '38:20', v: 12},
        '5': {k: 'Exodus', b: '38:21', e: '39:1', v: 12},
        '6': {k: 'Exodus', b: '39:2', e: '39:7', v: 6},
        '7': {k: 'Exodus', b: '39:8', e: '39:21', v: 14},
        'M': {k: 'Exodus', b: '39:19', e: '39:21', v: 3},
      },
      date: new HDate(736763),
      variation: 'Y.2',
      yearNum: 1,
    },
    {
      readSeparately: true,
      date1: new HDate(737120),
      date2: new HDate(737127),
      variation: 'A.3',
      yearNum: 2,
    },
  ];
  for (let i = 0; i < 3; i++) {
    expect(tri.getReading('Vayakhel-Pekudei', i)).toEqual(expected[i]);
  }
});

test('multi', () => {
  for (let year = 5744; year <= 8744; year += 3) {
    try {
      const tri = new Triennial(year);
      for (let yearNum = 0; yearNum <= 2; yearNum++) {
        expect(typeof tri.getReading('Vayakhel', yearNum)).toBe('object');
        expect(typeof tri.getReading('Pekudei', yearNum)).toBe('object');
      }
    } catch (error) {
      console.log(error);
      expect(true).toBe(false);
    }
  }
});

test('Vayakhel-Pekudei', () => {
  const tri = new Triennial(5831);
  const separate = tri.getReading('Vayakhel-Pekudei', 2);
  const expectedSeparate = {
    readSeparately: true,
    date1: new HDate(756846),
    date2: new HDate(756853),
    variation: 'G.3',
    yearNum: 2,
  };
  expect(separate).toEqual(expectedSeparate);
  const reading = tri.getReading('Vayakhel', 2);
  const expected = {
    aliyot: {
      '1': {k: 'Exodus', b: '37:17', e: '37:19', v: 3},
      '2': {k: 'Exodus', b: '37:20', e: '37:24', v: 5},
      '3': {k: 'Exodus', b: '37:25', e: '37:29', v: 5},
      '4': {k: 'Exodus', b: '38:1', e: '38:3', v: 3},
      '5': {k: 'Exodus', b: '38:4', e: '38:8', v: 5},
      '6': {k: 'Exodus', b: '38:9', e: '38:15', v: 7},
      '7': {k: 'Exodus', b: '38:16', e: '38:20', v: 5},
      'M': {k: 'Exodus', b: '38:18', e: '38:20', v: 3},
    },
    date: new HDate(756846),
    variation: 'G.3',
    yearNum: 2,
  };
  expect(reading).toEqual(expected);
});

test('readTogether', () => {
  const tri = new Triennial(5780);
  expect(tri.getReading('Tazria', 0)).toEqual({
    readTogether: 'Tazria-Metzora',
    date: new HDate(737540),
    variation: 'Y.1',
    yearNum: 0,
  });
  expect(tri.getReading('Tazria', 1)).toEqual({
    readTogether: 'Tazria-Metzora',
    date: new HDate(737897),
    variation: 'Y.2',
    yearNum: 1,
  });
});

test('readSeparately', () => {
  const tri = new Triennial(5780);
  expect(tri.getReading('Tazria-Metzora', 2)).toEqual({
    readSeparately: true,
    date1: new HDate(738247),
    date2: new HDate(738254),
    variation: 'A.3',
    yearNum: 2,
  });
});

test('Vezot Haberakhah', () => {
  const tri = new Triennial(5780);
  const reading = tri.getReading('Vezot Haberakhah', 0);
  const expected = {
    aliyot: {
      '1': {k: 'Deuteronomy', b: '33:1', e: '33:7', v: 7},
      '2': {k: 'Deuteronomy', b: '33:8', e: '33:12', v: 5},
      '3': {k: 'Deuteronomy', b: '33:13', e: '33:17', v: 5},
      '4': {k: 'Deuteronomy', b: '33:18', e: '33:21', v: 4},
      '5': {k: 'Deuteronomy', b: '33:22', e: '33:26', v: 5},
      '6': {k: 'Deuteronomy', b: '33:27', e: '33:29', v: 3},
      '7': {k: 'Deuteronomy', b: '34:1', e: '34:12', v: 12},
    },
    date: new HDate(23, 7, 5780),
    fullParsha: true,
    variation: 'Y.1',
    yearNum: 0,
  };
  expect(reading).toEqual(expected);
});

test('Triennial.debug', () => {
  const tri = new Triennial(5781);
  const lines = tri.debug().split('\n');
  const expected = [
    'Triennial cycle started year 5780',
    '  Vayakhel-Pekudei TTS (A)',
    '  Tazria-Metzora TTS (A)',
    '  Achrei Mot-Kedoshim TTS (A)',
    '  Behar-Bechukotai TTS (A)',
    '  Chukat-Balak TSS (C)',
    '  Matot-Masei TTT (Y)',
    '  Nitzavim-Vayeilech TSS (Y)',
    '',
  ];
  expect(lines).toEqual(expected);
  const tri2 = new Triennial(5797);
  const lines2 = tri2.debug().split('\n');
  const expected2 = [
    'Triennial cycle started year 5795',
    '  Vayakhel-Pekudei STT (F)',
    '  Tazria-Metzora STT (C)',
    '  Achrei Mot-Kedoshim STT (C)',
    '  Behar-Bechukotai STT (C)',
    '  Chukat-Balak SSS (G)',
    '  Matot-Masei STT (C)',
    '  Nitzavim-Vayeilech TST (Y)',
    '',
  ];
  expect(lines2).toEqual(expected2);
});

test('Chukat-Balak 5783', () => {
  const tri = new Triennial(5783);
  const reading = tri.getReading('Chukat-Balak', 0);
  const expected = {
    '1': {k: 'Numbers', b: '19:1', e: '19:9', v: 9},
    '2': {k: 'Numbers', b: '19:10', e: '19:17', v: 8},
    '3': {k: 'Numbers', b: '19:18', e: '20:6', v: 11},
    '4': {k: 'Numbers', b: '20:7', e: '20:13', v: 7},
    '5': {k: 'Numbers', b: '20:14', e: '20:21', v: 8},
    '6': {k: 'Numbers', b: '20:22', e: '21:9', v: 17},
    '7': {k: 'Numbers', b: '21:10', e: '21:20', v: 11},
    'M': {k: 'Numbers', b: '21:17', e: '21:20', v: 4},
  };
  expect(reading.aliyot).toEqual(expected);
});

test('Chukat 5784', () => {
  const tri = new Triennial(5784);
  const r1 = tri.getReading('Chukat', 0);
  const r2 = tri.getReading('Chukat', 1);
  const r3 = tri.getReading('Chukat', 2);
  expect(r1.variation).toBe('Y.1');
  expect(r2.variation).toBe('C.2');
  expect(r3.variation).toBe('C.3');
});


test('Yitro', () => {
  const tri = new Triennial(5783);
  const reading1 = tri.getReading('Yitro', 0);
  const reading2 = tri.getReading('Yitro', 1);
  const reading3 = tri.getReading('Yitro', 2);
  const expected1 = {
    '1': {k: 'Exodus', b: '18:1', e: '18:4', v: 4},
    '2': {k: 'Exodus', b: '18:5', e: '18:8', v: 4},
    '3': {k: 'Exodus', b: '18:9', e: '18:12', v: 4},
    '4': {k: 'Exodus', b: '18:13', e: '18:16', v: 4},
    '5': {k: 'Exodus', b: '18:17', e: '18:19', v: 3},
    '6': {k: 'Exodus', b: '18:20', e: '18:23', v: 4},
    '7': {k: 'Exodus', b: '18:24', e: '18:27', v: 4},
    'M': {k: 'Exodus', b: '18:24', e: '18:27', v: 4},
  };
  const expected23 = {
    '1': {k: 'Exodus', b: '19:1', e: '19:6', v: 6},
    '2': {k: 'Exodus', b: '19:7', e: '19:9', v: 3},
    '3': {k: 'Exodus', b: '19:10', e: '19:13', v: 4},
    '4': {k: 'Exodus', b: '19:14', e: '19:19', v: 6},
    '5': {k: 'Exodus', b: '19:20', e: '20:14', v: 20},
    '6': {k: 'Exodus', b: '20:15', e: '20:18', v: 4},
    '7': {k: 'Exodus', b: '20:19', e: '20:23', v: 5},
    'M': {k: 'Exodus', b: '20:21', e: '20:23', v: 3},
  };
  expect(reading1.aliyot).toEqual(expected1);
  expect(reading2.aliyot).toEqual(expected23);
  expect(reading3.aliyot).toEqual(expected23);
});
