#!./node

var tjs = require('translation.js').google;

var source = process.argv[2] || 'auto';
var target = process.argv[3] || 'auto';
var query = process.argv[4] || '';
var target_display_name = process.argv[5];


/**
 * 识别语言
 */
tjs.detect(query).then(lang => {
    source = lang;
    if (source === 'en') {
        target = 'zh-CN'
    } else {
        target = 'en'
    }

    translate();
}).catch(e => {
    var code = e.code;
    var error = code + ': ' + ERROR_CODE[code];

    var output = {
        items: []
    };

    output.items.push({
        title: ERROR_CODE[code],
        subtitle: code,
        arg: error
    });

    console.error(JSON.stringify(output));
});

/**
 * 翻译
 */
function translate() {
    tjs.translate({
        text: query,
        from: source,
        to: target
    })
        .then(res => {
            // console.log(JSON.stringify(res, null, "\t"));

            var output = {
                items: []
            };

            if (res.result) {
                res.result.forEach((data) => {
                    if (data !== query) {
                        output.items.push({
                            title: data,
                            subtitle: query,
                            arg: data
                        });
                    }
                });
            }

            if (res.dict) {
                res.dict.forEach((data) => {
                    if (data !== query) {
                        output.items.push({
                            title: data,
                            subtitle: query,
                            arg: data
                        });
                    }
                });
            }

            console.log(JSON.stringify(output));
        }).catch(e => {
            var code = e.code;
            var error = code + ': ' + ERROR_CODE[code];

            var output = {
                items: []
            };

            output.items.push({
                title: ERROR_CODE[code],
                subtitle: code,
                arg: error
            });

            console.error(JSON.stringify(output));
        });
}

const ERROR_CODE = {
    'NETWORK_ERROR': '网络错误，可能是运行环境没有网络连接造成的',
    'API_SERVER_ERROR': '网页翻译接口返回了错误的数据',
    'UNSUPPORTED_LANG': '接口不支持的语种',
    'NO_THIS_API': '没有找到你需要的接口',
    'NETWORK_TIMEOUT': '查询网页接口超时了。由于目前没有设置超时时间，所以暂时不会出现这个错误'
};