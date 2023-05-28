import test from 'ava';
import {HDate} from '@hebcal/core';
import {Triennial} from './triennial';

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
  console.log(actual5789);
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
});

test('Behar-Bechukotai SSS', (t) => {
  const tri = new Triennial(5774, true);
  const r1 = tri.getReading('Behar-Bechukotai', 0);
  const r2 = tri.getReading('Behar-Bechukotai', 1);
  const r3 = tri.getReading('Behar-Bechukotai', 2);
  t.is(r1.readSeparately, true);
  t.is(r2.readSeparately, true);
  t.is(r3.readSeparately, true);
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
});

test('multi', (t) => {
  for (let hyear = 5774; hyear <= 6600; hyear += 3) {
    const tri = new Triennial(hyear, true);
    const str = tri.debug();
    t.is(typeof str, 'string');
  }
  t.pass();
});
