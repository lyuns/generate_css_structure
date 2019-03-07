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
    let pushtoJson = (parent, selector) => {
        let childs = getChildList(selector);
        for(let key in childs){
            parent[childs[key].selector] = Object.assign({}, parent[childs[key].selector], childs[key]);
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
            result += `${space}${key} {\n`;
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
    return yield readFile(config.src);
}).then(resolve => {
    writeToDest(resolve);
}, reject => {
    console.log('reject:', reject);
});