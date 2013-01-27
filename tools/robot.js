 /**
 * @overview
 *
 * @author 闲耘™ (hotoo.cn[AT]gmail.com)
 * @version 2013/01/27
 */

var remote = require("./remote");
var URLEncoder = require("./urlencode");
var WORDS = require("./data-words");

var words = "";
var words_loaded = {};
for(var i=0,a,l=WORDS.length; i<l; i++){
  a = WORDS[i][1].split("");
  for(var j=0,w,m=a.length; j<m; j++){
    w = a[j];
    if(words_loaded.hasOwnProperty(w)){continue;}
    words_loaded[w] = w;

    words += w;
  }
}
console.log("words count:", words.length);

// 从快典网查询，带注音的 GBK 编码拼音，Iconv 无法正常转换编码，
// 而其注音格式参数无效，未完成。
function getKDDPinyinDict(han){
  remote("http://py.kdd.cc/index.asp?zy=1&u=3&dy=red&ps=gray&zs=blue&kd=55&wz="+
    URLEncoder.encode(han), "POST", function(html){
      var py_start = "<font color=gray>";
      var py_end = "</font>";
      var idx = html.indexOf(py_start);
      var idx2 = html.indexOf(py_end, idx);
      if(idx < 0){
        console.log(han, "No Found.")
        return;
      }
      console.log(han, ":", html.substring(idx+py_start.length, idx2));
      //console.log(html);
    }, function(response){
    });
}
function getPinyinDict(han){
  remote("http://zi.artx.cn/zi/search/?dsearch_kind=1&dsearch_main="+
    encodeURIComponent(han)+"&x=0&y=0", "POST", function(html){
      var py_start = '<span class="style1">拼音：';
      var py_end = '</span>';
      var idx = html.indexOf(py_start);
      var idx2 = html.indexOf(py_end, idx);
      if(idx < 0){
        console.log('"'+han+'": "No Found.",');
        return;
      }
      var py = html.substring(idx+py_start.length, idx2);
      console.log('"'+han+'": "'+py+'",');
    },
    function(response){
    }
  );
}

function chunk(array, process, context){
    var items = array.concat();   //clone the array
    setTimeout(function(){
        var item = items.shift();
        process.call(context, item);

        if (items.length > 0){
            setTimeout(arguments.callee, 100);
        }
    }, 25);
}

chunk(words.split(""), getPinyinDict);

//for(var i=0,l=words.length; i<l; i++){
  //getPinyinDict(words.charAt(i));
//}
