import {Combobox} from "./combo";
const comboEl = document.querySelector('.js-combobox');
const options = ['', 'Apple', 'Banana', 'Blueberry', 'Boysenberry', 'Cherry', 'Durian', 'Eggplant', 'Fig', 'Grape', 'Guava', 'Huckleberry'];

let comboComponent = new Combobox(<HTMLElement>comboEl, (e)=>console.log(e));
comboComponent.init();
