"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./plugins");
var combo_1 = require("./combo");
var comboEl = document.querySelector('.js-combobox');
var options = [
    'Apple',
    'Banana',
    'Blueberry',
    'Boysenberry',
    'Cherry',
    'Durian',
    'Eggplant',
    'Fig',
    'Grape',
    'Guava',
    'Huckleberry',
];
function fruitList() {
    return new Promise(function (resolve) {
        var obj = options.map(function (x, i) {
            return { value: i, filtered: false, index: i, displayValue: x };
        });
        resolve(obj);
    });
}
var comboComponent = new combo_1.Combobox(comboEl, function (e) { return console.log(e); }, fruitList);
comboComponent.init();
//# sourceMappingURL=main.js.map