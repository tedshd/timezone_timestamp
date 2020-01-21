# timezone_timestamp

Set any timezone time to timestamp you want to set.

## Intro

tomezone data use [timezonedb](https://timezonedb.com/)

Default save data to localstorage 1 day

Expire 1 day and call api and then save to localstorage again


### Method

* callback(data)

  * data: timezoneDB response data

* initData(arg)

  * arg - Object

    * key: timezoneDB api key
    * updateHours: update call timezoneDB time, unit is hour

* timestamp(zone, ts, dst)

  * zone: timezone you want to set, ex: 'Asia/Taipei'
  * ts: timestamp
  * dst: Daylight Saving Time, if you want to use it, true or false

* timestampOffset(ts, offset)

  * ts: timestamp
  * offset: timezone offset you want to set

* countryCode()

Show all support country code

* zoneName(countryCode)

  * countryCode: response this countryCode timezone

### Usage

Need define `tzts.callback` handle `initData` callback

Must use `tzts.initData` set call timezone data

```JavaScript
var key = '';

tzts.callback = function (data) {
  console.log(data);
  init();
};

tzts.initData({
  key: key,
  updateHours: 24
});

function init() {
  tzts.timestamp('Asia/Tokyo', new Date('2020-01-20 14:00:00').getTime());
  // 1579496400000
  tzts.timestampOffset(new Date('2020-01-20 14:00:00').getTime(), 9);
  // 1579496400000
  tzts.countryCode()
  // ["AD", "AE", "AF", ...]
  tzts.zoneName('tw')
  // ["Asia/Taipei"]
}
```
