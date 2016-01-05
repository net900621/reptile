var http = require('http');
var fs = require("fs");

var fun = function(url){
    http.get(url, function(res) {
        var _data = '';
        res.on('data', function (data) {
            _data += data;
        });
        res.on('end', function (data) {
            var _crawler = _data.match(/src=\"([^[\"|#]*)\"|src=\'([^[\'|#]]*)\'/g).join('').split('src=');
            _crawler.splice(0, 1);
            for (var i = 0; i < _crawler.length; i++) {
                console.log(!_crawler[i].match(/\.[^\.]*/g).pop().match(/jpg|png/g))

                if (!_crawler[i].match(/\.[^\.]*/g).pop().match(/jpg|png/g)) {
                    return;
                };

                http.get(_crawler[i].replace(/\'|\"/g, ''), function(_res) {
                    var _data = '';
                    _res.setEncoding("binary"); 
                    _res.on('data', function(data){
                        _data += data;
                    }).on('end', function(data){
                        var _tmp = './pic/' + _res.req.path.split('/').pop();
                        fs.writeFileSync(_tmp, _data, "binary");
                    });
                });
            };
        });
    }).on('error', function(e) {
        console.log("错误：" + e.message);
    });
}

fun(process.argv[2]);