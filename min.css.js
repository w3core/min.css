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
    var m1, m2, hue, r, g, b; s/=100; l/=100;
    if (!s) r = g = b = (l * 255);
    else {
      if (l <= 0.5) m2 = l * (s + 1);
      else m2 = l + s - l * s;
      m1 = l * 2 - m2;
      hue = h / 360;
      r = Math.ceil(hue2rgb(m1, m2, hue + 1/3));
      g = Math.ceil(hue2rgb(m1, m2, hue));
      b = Math.ceil(hue2rgb(m1, m2, hue - 1/3));
    }
    return {r: r, g: g, b: b};
  }
  function rgb2hex (r, g, b) {
    return '#' + ((1 << 24) + ((1*r) << 16) + ((1*g) << 8) + (1*b)).toString(16).slice(1);
  }

  return String(css)
  .replace(/\/\*[\s\S]*?\*\//g, ' ') // Comments
  .replace(/\s+/g, ' ') // Extra spaces
  .replace(/([\(\)\{\}\:\;\,]) /g, '$1') // Extra spaces
  .replace(/ \{/g, '{') // Extra spaces
  .replace(/\;\}/g, '}') // Last semicolon
  .replace(/ ([+~>]) /g, '$1') // Extra spaces
  .replace(/([^{][,: \(\)]0)(%|px|pt|pc|rem|em|ex|cm|mm|in)([, };\(\)])/g, '$1$3') // Units for zero values
  .replace(/([: ,=\-\(])0\.(\d)/g, '$1.$2') // Lead zero for float values
  .replace(/([^\}]*\{\s*?\})/g, '') // Empty rules
  .replace(/(rgb|hsl)\((\d+)\D{1,2}(\d+)\D{1,2}(\d+)\D{0,1}\)/g, function (m, t, v1, v2, v3) { // RGB|HSL to HEX
    if (t.toLowerCase() == 'hsl') {
      var o = hsl2rgb(v1, v2, v3);
      v1 = o.r; v2 = o.g; v3 = o.b;
    }
    return rgb2hex(v1, v2, v3);
  })
  .replace(/([,: \(])#([0-9a-f]{6})/gi, function (m, pfx, clr) { // HEX code reducing
    if (clr[0] == clr[1] && clr[2] == clr[3] && clr[4] == clr[5]) return pfx + '#' + clr[0] + clr[2] + clr[4];
    return pfx + '#' + clr;
  })
  .replace(/(margin|padding|border-width|border-color|border-style)\:([^;}]+)/gi, function (m,k,v){
    function chk () {
      var o = arguments.length > 1 ? arguments : arguments.length == 1 ? arguments[0] : [];
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
  });
}

if (typeof module !== 'undefined' && module.exports) module.exports = mincss;