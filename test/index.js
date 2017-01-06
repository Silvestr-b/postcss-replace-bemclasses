'use strict'

const postcss = require('postcss');
const expect = require('chai').expect;
const plugin = require('../index');
const path = require('path');
const fs = require('fs-extra');
const pathToFile = path.join(__dirname, 'tmpl', 'bemclasses.json');
const options = { file: pathToFile };


describe('postcss-replace-bemclasses', () => {

	describe('Должен корректно заменять имя класса на соответствующее значение из списка:', () => {
	
		it('если класс один в селекторе', () => {
		    return run(p().singleClass.input, p().singleClass.output, p().singleClass.json, options)
		})
		
		it('если класов несколько в селекторе', () => {
		    return run(p().manyClasses.input, p().manyClasses.output, p().manyClasses.json, options)
		})

		it('если в селекторе есть другие правила (# a)', () => {
		    return run(p().withOtherRules.input, p().withOtherRules.output, p().withOtherRules.json, options)
		})

		it('если заменяемый селектор обладает псевдоклассом или псевдоселектором', () => {
		    return run(p().pseudo.input, p().pseudo.output, p().pseudo.json, options)
		})

		it('если у нового значения класса нет точки, то при вставке точка добавится', () => {
		    return run(p().valWithoutDot.input, p().valWithoutDot.output, p().valWithoutDot.json, options)
		})

		it('если у старого значения класса нет точки, то при поиске он ее подставит', () => {
		    return run(p().propWithoutDot.input, p().propWithoutDot.output, p().propWithoutDot.json, options)
		})     
			
	})

	describe('Должен бросать исключение:', () => {
		
		it('если не переданы опции', () => {
			return expect(() => { run(p().manyClasses.input, p().manyClasses.output, p().manyClasses.json) }).to.throw(Error, 'Can`t find file with new CSS-classes') 
		})

		it('если в опциях не указан file', () => {
			return expect(() => { run(p().manyClasses.input, p().manyClasses.output, p().manyClasses.json, {}) }).to.throw(Error, 'Can`t find file with new CSS-classes') 
		})

		it('если не удалось найти указанный файл', () => {
			return expect(() => { run(p().manyClasses.input, p().manyClasses.output, p().manyClasses.json, {file: 'path/to/file.json'}) })
				.to.throw(Error, 'Can`t find file with new CSS-classes') 
		})

		it('eсли в JSON нет ни одного правила', () => {
			return expect(() => { run(p().emptyJSON.input, p().emptyJSON.output, p().emptyJSON.json, options) }).to.throw(Error, 'JSON of CSS-classes is empty') 
		})

	})

	after(() => {
		deleteFile()
	})

})




function p(){
	return {
		singleClass: { 
			input: '.button {}',
			output: '.btn {}',
			json: {
		        ".button": ".btn"
		    }
		},
		manyClasses: { 
			input: '.form .button .icon {}',
			output: '.form .btn .icon {}',
			json: {
		        ".button": ".btn"
		    }
		},
		withOtherRules: { 
			input: 'a.button #id {}',
			output: 'a.btn #id {}',
			json: {
		        ".button": ".btn"
		    }
		},
		pseudo: { 
			input: '.button:hover .button:before {}',
			output: '.btn:hover .btn:before {}',
			json: {
		        ".button": ".btn"
		    }
		},
		valWithoutDot: { 
			input: '.button {}',
			output: '.btn {}',
			json: {
		        ".button": "btn"
		    }
		},
		propWithoutDot: { 
			input: '.button {}',
			output: '.btn {}',
			json: {
		        "button": ".btn"
		    }
		},
		emptyJSON: { 
			input: '.button {}',
			output: '.button {}',
			json: {}
		}
	}
} 




function toFormat(code){
	return code.replace(/[\s\t\n]+/gi, '')
}

function createFile(obj){
	fs.ensureFileSync(pathToFile);
	fs.writeFileSync(pathToFile, JSON.stringify(obj));
}

function deleteFile(){
	fs.removeSync(path.parse(pathToFile).dir);
}

function run(input, output, obj, options) {
	deleteFile();
	createFile(obj);
    return postcss([ plugin(options) ]).process(input)
        .then(result => {
            expect(toFormat(result.css)).to.equal(toFormat(output));
            expect(result.warnings().length).to.equal(0);
        })
}