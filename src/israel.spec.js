import test from 'ava';
import {HDate, ParshaEvent} from '@hebcal/core';
import {makeLeyningParts, makeSummaryFromParts} from '@hebcal/leyning';
import {Triennial} from './triennial';
import {getTriennialForParshaHaShavua} from './parshaHaShavua';

test('debug', (t) => {
  const tri5774 = new Triennial(5774, true);
  const actual5774 = tri5774.debug();
  const expected5774 = `Triennial cycle started year 5774
  Vayakhel-Pekudei STS (E)
  Tazria-Metzora STS (D)
  Achrei Mot-Kedoshim STS (D)
  Behar-Bechukotai SSS (IL1)
  Chukat-Balak SSS (G)
  Matot-Masei STS (IL)
  Nitzavim-Vayeilech TSS (Y)
`;
  t.is(actual5774, expected5774);

  const tri5789 = new Triennial(5789, true);
  const actual5789 = tri5789.debug();
  const expected5789 = `Triennial cycle started year 5789
  Vayakhel-Pekudei TST (B)
  Tazria-Metzora TST (B)
  Achrei Mot-Kedoshim TST (B)
  Behar-Bechukotai SST (IL2)
  Chukat-Balak SSS (G)
  Matot-Masei TTT (Y)
  Nitzavim-Vayeilech STT (Y)
`;
  t.is(actual5789, expected5789);
});

test('Matot-Masei STS', (t) => {
  const tri = new Triennial(5774, true);
  const r1 = tri.getReading('Matot-Masei', 0);
  const r2 = tri.getReading('Matot-Masei', 1);
  const r3 = tri.getReading('Matot-Masei', 2);
  t.is(r1.readSeparately, true);
  t.is(r2.readSeparately, undefined);
  t.is(r3.readSeparately, true);
  const expected = {
    aliyot: {
      '1': {k: 'Numbers', b: '32:1', e: '32:4', v: 4},
      '2': {k: 'Numbers', b: '32:5', e: '32:19', v: 15},
      '3': {k: 'Numbers', b: '32:20', e: '32:27', v: 8},
      '4': {k: 'Numbers', b: '32:28', e: '32:42', v: 15},
      '5': {k: 'Numbers', b: '33:1', e: '33:6', v: 6},
      '6': {k: 'Numbers', b: '33:7', e: '33:36', v: 30},
      '7': {k: 'Numbers', b: '33:37', e: '33:49', v: 13},
      'M': {k: 'Numbers', b: '33:47', e: '33:49', v: 3},
    },
    date: new HDate(735797), // day: 2, month: 5, year: 5775
  };
  t.deepEqual(r2, expected);

  const matot1 = tri.getReading('Matot', 0);
  const masei1 = tri.getReading('Masei', 0);
  const matot3 = tri.getReading('Matot', 2);
  const masei3 = tri.getReading('Masei', 2);
  const summary = [
    makeSummaryFromParts(makeLeyningParts(matot1.aliyot)),
    makeSummaryFromParts(makeLeyningParts(masei1.aliyot)),
    makeSummaryFromParts(makeLeyningParts(r2.aliyot)),
    makeSummaryFromParts(makeLeyningParts(matot3.aliyot)),
    makeSummaryFromParts(makeLeyningParts(masei3.aliyot)),
  ];
  t.deepEqual(summary, [
    'Numbers 30:2-31:54',
    'Numbers 33:1-49',
    'Numbers 32:1-33:49',
    'Numbers 31:1-32:42',
    'Numbers 33:50-36:13',
  ]);
});

test('Behar-Bechukotai SSS', (t) => {
  const tri = new Triennial(5774, true);
  const r1 = tri.getReading('Behar-Bechukotai', 0);
  const r2 = tri.getReading('Behar-Bechukotai', 1);
  const r3 = tri.getReading('Behar-Bechukotai', 2);
  t.is(r1.readSeparately, true);
  t.is(r2.readSeparately, true);
  t.is(r3.readSeparately, true);

  const actualP1 = [];
  for (let i = 0; i < 3; i++) {
    const reading = tri.getReading('Behar', i);
    actualP1.push(makeSummaryFromParts(makeLeyningParts(reading.aliyot)));
  }
  const expectedP1 = ['Leviticus 25:1-28', 'Leviticus 25:1-28', 'Leviticus 25:29-26:2'];
  t.deepEqual(actualP1, expectedP1);

  const actualP2 = [];
  for (let i = 0; i < 3; i++) {
    const reading = tri.getReading('Bechukotai', i);
    actualP2.push(makeSummaryFromParts(makeLeyningParts(reading.aliyot)));
  }
  const expectedP2 = ['Leviticus 26:3-27:15', 'Leviticus 27:1-34', 'Leviticus 27:1-34'];
  t.deepEqual(actualP2, expectedP2);
});

test('Behar-Bechukotai SST', (t) => {
  const tri = new Triennial(5789, true);
  const r1 = tri.getReading('Behar-Bechukotai', 0);
  const r2 = tri.getReading('Behar-Bechukotai', 1);
  const r3 = tri.getReading('Behar-Bechukotai', 2);
  t.is(r1.readSeparately, true);
  t.is(r2.readSeparately, true);
  t.is(r3.readSeparately, undefined);
});

test('Behar-Bechukotai TSS', (t) => {
  const tri = new Triennial(5777, true);
  const r1 = tri.getReading('Behar-Bechukotai', 0);
  const r2 = tri.getReading('Behar-Bechukotai', 1);
  const r3 = tri.getReading('Behar-Bechukotai', 2);
  t.is(r1.readSeparately, undefined);
  t.is(r2.readSeparately, true);
  t.is(r3.readSeparately, true);

  t.is('Leviticus 25:1-38', makeSummaryFromParts(makeLeyningParts(r1.aliyot)));

  const actualP1 = [];
  for (let i = 1; i < 3; i++) {
    const reading = tri.getReading('Behar', i);
    actualP1.push(makeSummaryFromParts(makeLeyningParts(reading.aliyot)));
  }
  const expectedP1 = ['Leviticus 25:39-26:46', 'Leviticus 25:29-26:2'];
  t.deepEqual(actualP1, expectedP1);

  const actualP2 = [];
  for (let i = 1; i < 3; i++) {
    const reading = tri.getReading('Bechukotai', i);
    actualP2.push(makeSummaryFromParts(makeLeyningParts(reading.aliyot)));
  }
  const expectedP2 = ['Leviticus 26:3-27:15', 'Leviticus 27:1-34'];
  t.deepEqual(actualP2, expectedP2);
});

test('multi', (t) => {
  for (let hyear = 5774; hyear <= 6600; hyear += 3) {
    const tri = new Triennial(hyear, true);
    const str = tri.debug();
    t.is(typeof str, 'string');
  }
  t.pass();
});

test('getTriennialForParshaHaShavua', (t) => {
  const hd = new HDate(7, 'Sivan', 5783);
  const pe = new ParshaEvent(hd, ['Nasso'], true);
  const reading = getTriennialForParshaHaShavua(pe, true);
  const expected = {
    '1': {k: 'Numbers', b: '4:21', e: '4:24', v: 4},
    '2': {k: 'Numbers', b: '4:25', e: '4:28', v: 4},
    '3': {k: 'Numbers', b: '4:29', e: '4:33', v: 5},
    '4': {k: 'Numbers', b: '4:34', e: '4:37', v: 4},
    '5': {k: 'Numbers', b: '4:38', e: '4:49', v: 12},
    '6': {k: 'Numbers', b: '5:1', e: '5:4', v: 4},
    '7': {k: 'Numbers', b: '5:5', e: '5:10', v: 6},
    'M': {k: 'Numbers', b: '5:8', e: '5:10', v: 3},
  };
  t.deepEqual(reading.aliyot, expected);
});
