import './plugins';
import { Combobox, comboOption } from './combo';

const comboEl = document.querySelector('.js-combobox');
const options = [
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

function fruitList(): Promise<comboOption[] | undefined> {
    return new Promise(resolve => {
        const obj = options.map((x, i) => {
            return { value: i, filtered: false, index: i, displayValue: x };
        });
        resolve(obj);
    });
}

const comboComponent = new Combobox(<HTMLElement>comboEl, (e) => console.log(e), fruitList);
comboComponent.init();
