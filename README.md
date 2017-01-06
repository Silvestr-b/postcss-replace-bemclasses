# PostCSS Replace BEMClasses [![Build Status][ci-img]][ci]

[PostCSS] This plugin replace CSS classes by JSON like: { "className": "newName" } 

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/Silvestr-b/postcss-replace-bemclasses.svg
[ci]:      https://travis-ci.org/Silvestr-b/postcss-replace-bemclasses

From:
```css
.button {
    background: #0099cc; 
}
.button .icon {
	margin: 4px;
}
```
With:
```js
// path/to/file.json
{
	"button": "btn",
	"icon": "_j2s"
}
```
To:
```css
.btn {
    background: #0099cc; 
}
.btn ._j2s {
	margin 4px;
}
```

## Usage

```js
const options = {
	file: 'path/to/file.json' 
}

postcss([ require('postcss-replace-bemclasses')(options) ])
```

See [PostCSS] docs for examples for your environment.
