const common = {};

common.isFunction = function (func)  {
    var getType = {};
    return func && getType.toString.call(func) === '[object Function]';
};

common.dateToFormat = function (format,date) {
    if (!format) format = "[d/N/Y:H:i:s O]";
    if (!date) date = new Date();
    return format.replace(/Y|m|d|H|i|s|O|N/gi,function(match, offset, str){
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var arr = {};
        arr['Y'] = parseInt(date.getFullYear());
        arr['m'] = parseInt(date.getMonth()+1);
        arr['d'] = parseInt(date.getDate());
        arr['H'] = parseInt(date.getHours());
        arr['i'] = parseInt(date.getMinutes());
        arr['s'] = parseInt(date.getSeconds());
        arr['O'] = -parseInt(date.getTimezoneOffset())/60;
        for (k in arr) {
          if (k=='O') {
            var a = Math.abs(arr[k]);
            if (a<10) a = "0"+a;
            if (arr[k]<0) arr[k] = "-"+a+"00"; else arr[k] = "+"+a+"00";
          }
          else if (arr[k]<10)
            arr[k] = "0"+arr[k];
        }
        arr['N'] = months[parseInt(date.getMonth())]; // Month from 0 to 11
        return arr[match];
    });
};

common.dataURItoBlob = function (dataURI){
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
};

common.viceversa = function (a,b) {
    var c = a; a = b; b = c;
    return new Array(a,b);
};

common.concatRepeat = function (str,delim,n) {
		let out = '';
		for (let i=0; i<n; i++) {
				out += str;
				if (i!=n-1)
          out += delim
		}
		return out;
};

common.console_log = function (str) {
    console.log(str);
};

common.replaceAll = function (str,search,replace) {
    return str.split(search).join(replace);
};

common.empty = function (mixed_var) {
    return ( typeof(mixed_var)=='undefined' || typeof(mixed_var)==undefined || mixed_var == 'undefined' || mixed_var == undefined || mixed_var === null || mixed_var == "NaN" || mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === false );
};

common.parseProperties = function (key,val) {
    var res = "";
    if (typeof(val)==='object')
    res += "\n" + key + ": " + this.showProperties(val);
    else
    res += key + " = " + val + "\n";
    return res;
}

common.showProperties = function (obj) {
    var result = "";
    if (obj.size) {
      for (var key of obj.keys()) { 
        var val = obj.get(key);
        result += this.parseProperties(key,val);
      }
    } else {
      for (var key in obj) {
        var val = obj[key];
        result += this.parseProperties(key,val);
      }
    }
    return result;
};

common.convertObjToStr = function (str) {
    var obj = {};
    for (var key in str){
        obj[key] = ((typeof str[key] == "object") && (str[key] != null)) ? "[object " + key + "]" : str[key];
    };
    return obj;
};

common.convertObjToArray = function (obj) {
  return Object.keys(obj).map(function(key) {
    return [key, obj[key]];
  });
};

common.parseXML = function (xml,debug) {
    parseString(xml,function(e,res){
      if (debug && e)
        console.log("parseXML error: " + e);
      return res;
    });
};

common.tryParseJson = function (str,callback) {
    process.nextTick(function(){
      try {
          callback(null,JSON.parse(str));
      }
      catch (ex) {
          callback(ex)
      }
    });
};

common.encode2HTML = function (str) {
  return str.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
    return '&#'+i.charCodeAt(0)+';';
  });
};

common.htmlEntities = function (str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

common.trimText = function (str) {
    if (!str || !str.length) return '';
    var a = str.toString().trim().replace(/^\s+/,'');
    return a.replace(/\s+$/,'');
};

common.cleanVarToNumber = function (v,r) {
    if (!r) r = /([\d]+)([\D]+)/gi;
    v = this.trimText(v); // v = v.trim();
    return v.replace(r,"\$1");
};

module.exports = common;
