'use strict'

const postcss = require('postcss');
const fs = require('fs-extra');

module.exports = postcss.plugin('postcss-reverse-props', (options = {}) => {
	if(!options.file || !fs.existsSync(options.file)){ throw new Error('Can`t find file with new CSS-classes') };

	const json = fs.readFileSync(options.file, 'utf-8');

	if(json.length <= 2){ throw new Error('JSON of CSS-classes is empty') }

	const classes = JSON.parse(json);

	return root => {
		root.walkRules(rule => {
			(rule.selector.match(/\.[a-z0-9\-\_]+/gi) || []).forEach(cls => {
				const newClass = classes[cls] || classes[cls.slice(1)] 

				if(!newClass) return  
              	
            	rule.selector = rule.selector.replace(cls, newClass[0] === '.'? newClass : '.' + newClass)

            })
		});
	};
});