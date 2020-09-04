"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combo_1 = require("./combo");
var comboEl = document.querySelector('.js-combobox');
var options = ['', 'Apple', 'Banana', 'Blueberry', 'Boysenberry', 'Cherry', 'Durian', 'Eggplant', 'Fig', 'Grape', 'Guava', 'Huckleberry'];
var comboComponent = new combo_1.Combobox(comboEl, function (e) { return console.log(e); });
comboComponent.init();
//# sourceMappingURL=main.js.map