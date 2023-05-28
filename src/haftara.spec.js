import test from 'ava';
import {getTriennialHaftaraForHoliday} from './haftara';

test('getTriennialHaftaraForHoliday', (t) => {
  const pesachI = getTriennialHaftaraForHoliday('Pesach I', 0);
  t.deepEqual(pesachI, {
    haft: {k: 'Joshua', b: '5:2', e: '5:12', v: 11},
    haftara: 'Joshua 5:2-12',
    haftaraNumV: 11,
  });
  const pesachIII = getTriennialHaftaraForHoliday('Pesach III (CH\'\'M)', 2);
  t.is(pesachIII, undefined);
  const av9yr1 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 0);
  t.is(av9yr1.haftara, 'Jeremiah 8:13-23, 9:23');
  const av9yr2 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 1);
  t.is(av9yr2.haftara, 'Jeremiah 9:1-10, 9:23');
  const av9yr3 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 2);
  t.is(av9yr3.haftara, 'Jeremiah 9:11-23');
  const rh1 = getTriennialHaftaraForHoliday('Rosh Hashana I', 0);
  t.is(rh1, undefined);
  const rh2 = getTriennialHaftaraForHoliday('Rosh Hashana II', 0);
  t.is(rh2.haftara, 'Jeremiah 31:2-20');
});
