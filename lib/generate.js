const fs = require('fs')
    ,co = require('co')
    ,thunkify = require('thunkify'),
    cheerio = require('cheerio');

let readFile = thunkify(fs.readFile);
let config = require('../config');

const Box = x => ({
    map: f => Box(f(x)),
    fold: f => f(x),
    toString: () => `Box(${x})`
});

let transJson = (html) => {
    let $ = cheerio.load(html);
    let childJson = {};

    let getChildList = (selector) => {
        let childList = [];
        $(selector).children().each((index, item) => {
            let className = item.attribs.class;
            if(className !== undefined && className !== ''){
                childList.push({type: 'class', value: item.attribs.class, selector: '.' + item.attribs.class.split(' ')[0]});
            }else{
                childList.push({type: 'tag', value: item.name, selector: item.name});
            }
        });
        return childList;
    };
    let isExist = (arr, str) => {
        for(let item in arr){
            if(str === arr[item]){
                return true
            }
        }
        return false;
    };
    let merge = (container, obj1, obj2) => {
        if(obj1 === undefined && obj2 === undefined){
            return container;
        }
        if(obj1 === undefined){
            for(let key in obj2){
                container[key] = obj2[key];
            }
            return container;
        }
        for(let key in obj1){
            container[key] = obj1[key];
        }
        if(obj2 !== undefined){
            for(let key in obj2){
                if(container[key]){
                    if(Object.prototype.toString.call(container[key]) === '[object Array]'){
                        if(!isExist(container[key], obj2[key])){
                            container[key].push(obj2[key]);
                        }
                    }else{
                        if(container[key] !== obj2[key]){
                            container[key] = [container[key], obj2[key]];
                        }
                    }
                }
            }
        }
        return container;
    };
    let pushtoJson = (parent, selector) => {
        let childs = getChildList(selector);
        for(let key in childs){
            parent[childs[key].selector] = merge({}, parent[childs[key].selector], childs[key]);
            if(!parent[childs[key].selector].childs){
                parent[childs[key].selector].childs = {};
            }
            pushtoJson( parent[childs[key].selector].childs, `${selector} ${childs[key].selector}`);
        }
    };
    pushtoJson(childJson, config.selector);
    return childJson;
};

let transCssStructure = (data) => {
    let result = '';
    let getSelectors = (list, depth) => {
        for(let key in list){
            let space = '';
            for(let i = 0; i < depth; i++){
                space += '  ';
            }
            if(Object.prototype.toString.call(list[key].value) === '[object Array]'){
                if(list[key].value[0].split(' ').length === 1){
                    result += `${space}.${list[key].value[0]} {\n`;
                }else{
                    result += `${space}.${list[key].value[0].split(' ')[0]} {\n`;
                }
                for(let item in list[key].value){
                    let className = '';
                    let arr = (list[key].value[item]).split(' ').slice(1);
                    if(arr.length > 0){
                        className = arr.join('.');
                        result += `${space}  &.${className} {\n${space}  }\n`;
                    }
                }
            }else{
                result += `${space}${key} {\n`;
            }
            if(JSON.stringify(list[key].childs) !== '{}'){
                getSelectors(list[key].childs, depth + 1);
            }
            result += `${space}}\n`;
        }
    }
    getSelectors(data, 0);
    return result;
};

let writeToDest = resolve => {
    Box(resolve).map(s => transJson(s)).map(s => transCssStructure(s)).fold(result => {
        if(result.length === 0){
            console.log('请检查根选择器selector是否配置正确！');
            return;
        }
        fs.mkdir(config.dest, { recursive: true }, err => {
            if(err){
                console.log(err.message);
            }
            fs.writeFile(`${config.dest}/${config.filename}`, result, err=>{
                if(err){
                    console.log(err.message);
                }else{
                    console.log('写入成功！');
                }
            });
        });
    })
};

co(function *() {
    let html = yield readFile(config.src);
    return html.toString();
}).then(resolve => {
    writeToDest(resolve);
}, reject => {
    console.log('reject:', reject);
});
