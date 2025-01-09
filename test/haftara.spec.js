import {expect, test} from 'vitest';
import {getTriennialHaftaraForHoliday} from '../src/haftara';

test('getTriennialHaftaraForHoliday', () => {
  const pesachI = getTriennialHaftaraForHoliday('Pesach I', 0);
  expect(pesachI).toEqual({
    haft: {k: 'Joshua', b: '5:2', e: '5:12', v: 11},
    haftara: 'Joshua 5:2-12',
    haftaraNumV: 11,
  });
  const pesachIII = getTriennialHaftaraForHoliday('Pesach III (CH\'\'M)', 2);
  expect(pesachIII).not.toBeDefined();
  const av9yr1 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 0);
  expect(av9yr1.haftara).toBe('Jeremiah 8:13-23, 9:23');
  const av9yr2 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 1);
  expect(av9yr2.haftara).toBe('Jeremiah 9:1-10, 9:23');
  const av9yr3 = getTriennialHaftaraForHoliday('Tish\'a B\'Av', 2);
  expect(av9yr3.haftara).toBe('Jeremiah 9:11-23');
  const rh1 = getTriennialHaftaraForHoliday('Rosh Hashana I', 0);
  expect(rh1).not.toBeDefined();
  const rh2 = getTriennialHaftaraForHoliday('Rosh Hashana II', 0);
  expect(rh2.haftara).toBe('Jeremiah 31:2-20');
});
