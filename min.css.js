/**
 * min.css
 *
 * min.css is a tiny, fast and efficient JavaScript library for minifying CSS
 * files that really makes your website faster
 *
 * Site: https://github.com/w3core/min.css/
 * Online: https://w3core.github.io/min.css/
 *
 * @version 1.3.1
 *
 * @license BSD License
 * @author Max Chuhryaev
 */
function mincss (css) {
  function hue2rgb (m1, m2, hue) {
    var v;
    if (hue < 0) hue += 1;
    else if (hue > 1) hue -= 1;
    if (6 * hue < 1) v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1) v = m2;
    else if (3 * hue < 2) v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    else v = m1;
    return 255 * v;
  }
  function hsl2rgb (h, s, l) {
    var m1, m2, hue, r, g, b, M=Math; s/=100; l/=100;
    if (!s) r = g = b = (l * 255);
    else {
      if (l <= 0.5) m2 = l * (s + 1);
      else m2 = l + s - l * s;
      m1 = l * 2 - m2;
      hue = h / 360;
      r = M.ceil(hue2rgb(m1, m2, hue + 1/3));
      g = M.ceil(hue2rgb(m1, m2, hue));
      b = M.ceil(hue2rgb(m1, m2, hue - 1/3));
    }
    return {r: r, g: g, b: b};
  }
  function rgb2hex (r, g, b) {
    return '#' + ((1 << 24) + ((1*r) << 16) + ((1*g) << 8) + (1*b)).toString(16).slice(1);
  }

  return String(css)
  .replace(/\/\*[\s\S]*?\*\//g, ' ') // Comments
  .replace(/\s+/g, ' ') // Extra spaces
  .replace(/^\s+/g, '') // Extra spaces
  .replace(/ \{/g, '{') // Extra spaces
  .replace(/\;\}/g, '}') // Last semicolon
  .replace(/ ([+~>]) /g, '$1') // Extra spaces
  .replace(/([\: ,\(\)\\/])(\-*0+)(%|px|pt|pc|rem|em|ex|cm|mm|in)([, ;\(\)}\/]*?)/g, '$10$4') // Units for zero values
  .replace(/([: ,=\-\(\{\}])0+\.(\d)/g, '$1.$2') // Lead zero for float values
  .replace(/([^\}]*\{\s*?\})/g, '') // Empty rules
  .replace(/(\*)([.:\[])/g, '$2') // Remove * in selector
  .replace(/(\[)([^"' \]]+)(["'])([^"' \]]+)(\3)(\])/g, '$1$2$4$6') // Quote wrapped attribute values
  .replace(/(?:{)([^{}]+?)(?:})/g, function(m,s){
    var url = [], r = [];
    s = s.replace(/(url\s*\([^)]*\))/g, function(m){
      url.push(m);
      return '$'+(url.length-1)+'$';
    });
    s = s.match(/([a-z\-]+)\:(.+?)(;|$)/gi);
    for(var i=0; i<s.length; i++) {
      s[i] = /([a-z\-]+)\:(.+?)(;|$)/i.exec(s[i]);
      if (s[i]) s[i][2] = s[i][2].replace(/\$([0-9]+)\$/g, function(m,k){
        return url[k] || '';
      });
    }
    m = {};
    for(var i=0; i<s.length; i++) {
      if(s[i]) {
        if(s[i][1] == "background" || s[i][1] == "background-image") { // skip background gradients
          r.push(s[i][1] + ':' + s[i][2]);
          continue;
        }
        m[s[i][1]] = s[i][2];
      }
    }
    for(var i in m) r.push(i + ":" + m[i]);
    return "{" + r.join(";") + "}";
  })
  .replace(/ (\!important)/g, '$1')
  .replace(/\:(\:before|\:after)/g, '$1')
  .replace(/(rgb|rgba|hsl|hsla)\s*\(\s*(\d+)[, %]+(\d+)[, %]+(\d+)[, %]+?([0-1]?)\s*\)/g, function (m, t, v1, v2, v3, v4) { // RGB|RGBA-1|HSL|HSLA-1 to HEX
    if (v4 === "0") return " transparent ";
    t = t.toLowerCase();
    if (!t.indexOf('hsl')) {
      var o = hsl2rgb(v1, v2, v3);
      v1 = o.r; v2 = o.g; v3 = o.b;
    }
    return rgb2hex(v1, v2, v3);
  })
  .replace(/([,: \(]#)([0-9a-f])\2([0-9a-f])\3([0-9a-f])\4/gi, '$1$2$3$4') // HEX color reducing
  .replace(/ ?([\(\)\{\}\:\;\,]) /g, '$1') // Extra spaces
  .replace(/(margin|padding|border-width|border-color|border-style)\:([^;}]+)/gi, function (m,k,v){
    function chk () {
      var a = arguments, o = a.length > 1 ? a : a.length == 1 ? a[0] : [];
      for (var i=0; i<o.length; i++) {
        if (i==0) continue;
        if (o[i] != o[i-1]) return false;
      }
      return true;
    }
    var o = v.toLowerCase().split(' ');
    var r = v;
    if (chk(o)) r = o[0];
    else if ( (o.length == 4 && chk(o[0], o[2]) && chk(o[1],o[3])) || (o.length == 3 && chk(o[0],o[2])) ) r = o[0] + ' ' + o[1];
    else if (o.length == 4 && chk(o[1],o[3])) r = o[0] + ' ' + o[1] + ' ' + o[2];
    r = k + ':' + r;
    return r;
  })
  .replace(/\:\s*calc\(([^;}]+)/g, function ($0) { // Repair CSS3 calc conditions
    return $0.replace(/\s+/g, "").replace(/([-+*/]+)/g, " $1 ");
  })
  ;
}

if (typeof module !== 'undefined' && module.exports) module.exports = mincss;
