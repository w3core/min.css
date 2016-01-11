[![npm](https://img.shields.io/npm/v/min.css.svg)](https://www.npmjs.com/package/min.css)
[![npm](https://img.shields.io/npm/l/min.css.svg)](https://www.npmjs.com/package/min.css)

## What is the min.css?

[min.css] is a tiny, ultrafast and efficient JavaScript library for minifying CSS files
that really makes your website faster - [Online service](https://w3core.github.io/min.css/).

## Installation

### What are the requirements?

Any version of [Node.js] and nothing more. [min.css] is a JavaScript library and
has not any dependencies. So it can be used anywhere, in any platform that 
JavaScript supports.

### How to install [min.css]?

```
npm install -g min.css
```

## Usage

### How to use [min.css] via CLI?

```
min.css [input-file1] [input-file2] [input-fileN] > [output-file]
```

Also `min.css` accepts the following command line arguments:

```
-h, --help     output usage information
-v, --version  output the version number
```

For example, to minify a `main.css`, `icons.css` and `theme.css` files into `style.min.css` do:

```
min.css main.css icons.css theme.css > style.min.css
```

### How to use [min.css] via [Node.js]?

```javascript
var mincss = require('min.css');
var input = 'html, body {  }';
var output = mincss(input);
```
## What [min.css] do?
* Removes all comments
* Removes all empty declarations
* Removes all rules that was redeclared (excluding background, background-image).
* Removes all whitespaces that are unnecessary (including around the meta characters, such as { } ( ) : ; > ~ + etc.)
* Removes the last ";" in a rule declaration
* Removes leading zero in float value. For example: 0.5 > .5
* Convert RGB|RGBA-1 color to HEX and RGBA-0 to transparent
* Convert HSL|HSLA-1 color to HEX and HSLA-0 to transparent
* Convert HEX color to short value when it's possible. For example: #CCCCCC > #CCC
* Removes for all zero values units (such as %,px,pt,pc,rem,em,ex,cm,mm,in) that are unnecessary (excluding CSS keyframes). For example: border: 1px 0px > border:1px 0
* Reduces values for margin,padding,border-width,border-color,border-style. For example: 1px 2px 1px 2px => 1px 2px

[node.js]: https://nodejs.org/
[min.css]: https://www.npmjs.com/package/min.css
