/**
 *
 * @authors Ted Shiu (tedshd@gmail.com)
 * @date    2020-01-16 13:32:40
 * @version $Id$
 */

(function() {

  var tzts = {
    'initData': function (key) {
      if (!key) {
        console.error('timezone_timestamp: key not set');
        return;
      }

      var timezoneData = JSON.parse(localStorage.getItem('tzts_timezone')),
        expire = cookieControl('get', {
        name: 'tzts_expire'
      });

      if (!expire || !timezoneData) {
        var script = document.createElement('script');
        script.src = 'https://api.timezonedb.com/v2.1/list-time-zone?key=' + key + '&format=json&fields=countryCode,countryName,zoneName,gmtOffset,dst&callback=tzts.response';
        document.querySelector('head').appendChild(script);
      } else {
          this.callback(timezoneData);
          window.timezoneData = timezoneData;
      }
    },
    'response': function (data) {
      if (data.status !== 'OK') {
        console.error('timezone_timestamp: timezoneDb ERROR');
        console.log(data.message);
        return;
      }
      var timezoneData = timezoneMapInit(data.zones);
      localStorage.setItem('tzts_timezone', JSON.stringify(timezoneData));
      cookieControl('set', {
        name: 'tzts_expire',
        value: '1',
        expiredTime: 24*60*60
      });
      this.callback(timezoneData);
      window.timezoneData = timezoneData;

      function timezoneMapInit(data) {
        var obj = {};
        for (var x = 0; x < data.length; x++) {
          obj[data[x]['zoneName']] = data[x];
        }
        return obj;
      }
    },
    'timestamp': function (zone, ts, dst) {
      var timezoneData = window.timezoneData || JSON.parse(localStorage.getItem('tzts_timezone'));
      if (!timezoneData[zone]) {
        console.error('timezone_timestamp: ts zone error');
        return;
      }
      var currentTimeZoneOffset = (0 - (new Date().getTimezoneOffset())/60)*60*60*1000,
        targetTimeZoneOffset = timezoneData[zone]['gmtOffset']*1000,
        dst = (dst && timezoneData[zone]['dst']) ? 1*60*60*1000: 0;
      ts = ts + currentTimeZoneOffset - targetTimeZoneOffset - dst;
      return ts;
    },
    'timestampOffset': function (ts, offset) {
      var currentTimeZoneOffset = (0 - (new Date().getTimezoneOffset())/60)*60*60*1000,
        targetTimeZoneOffset = offset*60*60*1000;
      ts = ts + currentTimeZoneOffset - targetTimeZoneOffset;
      return ts;
    },
    'countryCode': function () {
      var timezoneData = window.timezoneData || JSON.parse(localStorage.getItem('tzts_timezone')),
        tmpObj = {};
      for (var x in timezoneData) {
        tmpObj[timezoneData[x]['countryCode']] = true;
      }
      return Object.keys(tmpObj);
    },
    'zoneName': function (countryCode) {
      var timezoneData = window.timezoneData || JSON.parse(localStorage.getItem('tzts_timezone')),
        tmpArr = [],
        countryCode = countryCode.toLocaleUpperCase();
      for (var x in timezoneData) {
        if (timezoneData[x]['countryCode'] === countryCode) {
          tmpArr.push(timezoneData[x]['zoneName']);
        }
      }
      return tmpArr;
    }
  };

  window.tzts = tzts;


  function cookieControl(method, option) {

    var name = option.name || '',
      value = option.value || '',
      extime = option.expiredTime || '',
      domain = option.domain || '',
      path = option.path || '/',
      currentTimeZone = 0,
      day = '',
      expires = '';

    if (!name) {
      console.error('cookieControl: not set name');
      return;
    }

    if (extime) {
      day = new Date();
      currentTimeZone = 0 - (day.getTimezoneOffset() / 60);
      day.setTime(day.getTime() + (extime * 1000) + currentTimeZone * 60 * 60 * 1000);
      expires = 'expires=' + day.toUTCString() + ';';
    }
    if (domain) {
      domain = 'domain=' + domain + ';';
    }
    if (path) {
      path = 'path=' + path + ';';
    }

    switch (method) {
      case 'set':
        document.cookie = name + '=' + value + ';' + domain + path + expires;
        break;
      case 'get':
        var cname = name + '=',
          ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i].trim();
          if (c.indexOf(cname) === 0) {
            return c.substring(cname.length, c.length);
          }
        }
        return '';
      case 'delete':
        document.cookie = name + '=;' + domain + path + ' expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        break;
      default:
        console.error('cookieControl: not set method');
        break;

    }
  }
})();
