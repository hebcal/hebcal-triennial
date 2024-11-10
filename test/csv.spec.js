/* eslint-disable require-jsdoc */
import {Writable} from 'stream';
import {flags} from '@hebcal/core/dist/esm/event';
import {ParshaEvent} from '@hebcal/core/dist/esm/ParshaEvent';
import {HolidayEvent} from '@hebcal/core/dist/esm/HolidayEvent';
import {HDate, months} from '@hebcal/hdate';
import {writeTriennialEvent} from '../src/csv';

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this.chunks = [];
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }
  toString() {
    return Buffer.concat(this.chunks).toString();
  }
}

test('writeTriennialEvent-parsha', () => {
  const ev = new ParshaEvent(new HDate(new Date(2022, 3, 30)), ['Achrei Mot']);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '30-Apr-2022,"Achrei Mot",1,"Leviticus 17:1-17:7",7',
    '30-Apr-2022,"Achrei Mot",2,"Leviticus 17:8-17:12",5',
    '30-Apr-2022,"Achrei Mot",3,"Leviticus 17:13-17:16",4',
    '30-Apr-2022,"Achrei Mot",4,"Leviticus 18:1-18:5",5',
    '30-Apr-2022,"Achrei Mot",5,"Leviticus 18:6-18:21",16',
    '30-Apr-2022,"Achrei Mot",6,"Leviticus 18:22-18:25",4',
    '30-Apr-2022,"Achrei Mot",7,"Leviticus 18:26-18:30",5',
    '30-Apr-2022,"Achrei Mot","maf","Leviticus 18:26-18:30",5',
    '30-Apr-2022,"Achrei Mot","Haftara","I Samuel 20:18-42 | Shabbat Machar Chodesh",25',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeTriennialEvent-holiday', () => {
  const ev = new HolidayEvent(new HDate(6, months.SIVAN, 5777),
      'Shavuot I', flags.CHAG | flags.LIGHT_CANDLES_TZEIS | flags.CHUL_ONLY);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '31-May-2017,"Shavuot I",1,"Exodus 19:1-19:6",6',
    '31-May-2017,"Shavuot I",2,"Exodus 19:7-19:13",7',
    '31-May-2017,"Shavuot I",3,"Exodus 19:14-19:19",6',
    '31-May-2017,"Shavuot I",4,"Exodus 19:20-20:14",20',
    '31-May-2017,"Shavuot I",5,"Exodus 20:15-20:23",9',
    '31-May-2017,"Shavuot I","maf","Numbers 28:26-28:31",6',
    '31-May-2017,"Shavuot I","Haftara","Ezekiel 1:1-28; 3:12",29',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeTriennialEvent-parsha-alt-haftara', () => {
  const ev = new ParshaEvent(new HDate(new Date(2016, 10, 19)), ['Vayera']);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '19-Nov-2016,"Vayera",1,"Genesis 18:1-18:5",5',
    '19-Nov-2016,"Vayera",2,"Genesis 18:6-18:8",3',
    '19-Nov-2016,"Vayera",3,"Genesis 18:9-18:14",6',
    '19-Nov-2016,"Vayera",4,"Genesis 18:15-18:21",7',
    '19-Nov-2016,"Vayera",5,"Genesis 18:22-18:26",5',
    '19-Nov-2016,"Vayera",6,"Genesis 18:27-18:30",4',
    '19-Nov-2016,"Vayera",7,"Genesis 18:31-18:33",3',
    '19-Nov-2016,"Vayera","maf","Genesis 18:31-18:33",3',
    '19-Nov-2016,"Vayera","Haftara for Ashkenazim","II Kings 4:1-37",37',
    '19-Nov-2016,"Vayera","Haftara for Sephardim","II Kings 4:1-23",23',
    '19-Nov-2016,"Vayera","Alternate Haftara","II Kings 4:8-17",10',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeTriennialEvent-holiday-alt-haftara', () => {
  const ev = new HolidayEvent(new HDate(16, months.TISHREI, 5789),
      'Sukkot II', flags.CHAG | flags.YOM_TOV_ENDS | flags.CHUL_ONLY);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '06-Oct-2028,"Sukkot II",1,"Leviticus 22:26-23:3",11',
    '06-Oct-2028,"Sukkot II",2,"Leviticus 23:4-23:14",11',
    '06-Oct-2028,"Sukkot II",3,"Leviticus 23:15-23:22",8',
    '06-Oct-2028,"Sukkot II",4,"Leviticus 23:23-23:32",10',
    '06-Oct-2028,"Sukkot II",5,"Leviticus 23:33-23:44",12',
    '06-Oct-2028,"Sukkot II","maf","Numbers 29:12-29:16",5',
    '06-Oct-2028,"Sukkot II","Haftara","I Kings 8:2-21",20',
    '06-Oct-2028,"Sukkot II","Alternate Haftara","I Kings 8:2-13",12',
    '', ''];
  expect(lines).toEqual(expected);
});

test('writeTriennialEvent-il', () => {
  const hd = new HDate(7, 'Sivan', 5783);
  const ev = new ParshaEvent(hd, ['Nasso'], true);
  const stream = new StringWritable();
  writeTriennialEvent(stream, ev, true);
  const lines = stream.toString().split('\r\n');
  const expected = [
    '27-May-2023,"Nasso",1,"Numbers 4:21-4:24",4',
    '27-May-2023,"Nasso",2,"Numbers 4:25-4:28",4',
    '27-May-2023,"Nasso",3,"Numbers 4:29-4:33",5',
    '27-May-2023,"Nasso",4,"Numbers 4:34-4:37",4',
    '27-May-2023,"Nasso",5,"Numbers 4:38-4:49",12',
    '27-May-2023,"Nasso",6,"Numbers 5:1-5:4",4',
    '27-May-2023,"Nasso",7,"Numbers 5:5-5:10",6',
    '27-May-2023,"Nasso","maf","Numbers 5:8-5:10",3',
    '27-May-2023,"Nasso","Haftara","Judges 13:2-25",24',
    '27-May-2023,"Nasso","Alternate Haftara","Joshua 6:5-14; 6:12",11',
    '', ''];
  expect(lines).toEqual(expected);
});
