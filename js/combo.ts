"use strict";

// const exampleOptions = [ 'Apple', 'Banana', 'Blueberry', 'Boysenberry', 'Cherry', 'Durian', 'Eggplant', 'Fig', 'Grape', 'Guava', 'Huckleberry'];

// helpers

const Keys = {
  Backspace: 'Backspace',
  Clear: 'Clear',
  Down: 'ArrowDown',
  End: 'End',
  Enter: 'Enter',
  Escape: 'Escape',
  Home: 'Home',
  Left: 'ArrowLeft',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Right: 'ArrowRight',
  Space: ' ',
  Tab: 'Tab',
  Up: 'ArrowUp'
}

const MenuActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  Previous: 6,
  Select: 7,
  Space: 8,
  Type: 9
}

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(options: string[] = [], filter: string, exclude: string[] = []) {
  return options.filter((option) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
    return matches && exclude.indexOf(option) < 0;
  });
}


// return combobox action from key press
function getActionFromKey(event: KeyboardEvent, menuOpen: any) {
  const {key, altKey, ctrlKey, metaKey} = event;
  // handle opening when closed
  if (!menuOpen && (key === Keys.Down || key === Keys.Enter || key === Keys.Space)) {
    return MenuActions.Open;
  }

  // handle keys when open
  if (key === Keys.Down) {
    return MenuActions.Next;
  } else if (key === Keys.Up) {
    return MenuActions.Previous;
  } else if (key === Keys.Home) {
    return MenuActions.First;
  } else if (key === Keys.End) {
    return MenuActions.Last;
  } else if (key === Keys.Escape) {
    return MenuActions.Close;
  } else if (key === Keys.Enter) {
    return MenuActions.CloseSelect;
  } else if (key === Keys.Space) {
    return MenuActions.Space;
  } else if (key === Keys.Backspace || key === Keys.Clear || (key.length === 1 && !altKey && !ctrlKey && !metaKey)) {
    return MenuActions.Type;
  }
}
function toPromise(f: Function) {
  const origFuncArgs = f.arguments
  return function () {
    return new Promise((resolve, reject) => {
      const result = f.apply(null, Array.from(origFuncArgs));
      try {
        return result.then(resolve, reject); // promise.
      } catch (e) {
        if (e instanceof TypeError) {
          resolve(result); // resolve naked value.
        } else {
          reject(e); // pass unhandled exception to caller.
        }
      }
    });
  };
}

// check if an element is currently scrollable
function isScrollable(element: Element) {
  return element && element.clientHeight < element.scrollHeight;
}

// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement: HTMLElement, scrollParent: HTMLElement) {
  const {offsetHeight, offsetTop} = activeElement;
  const {offsetHeight: parentOffsetHeight, scrollTop} = scrollParent;

  const isAbove = offsetTop < scrollTop;
  const isBelow = (offsetTop + offsetHeight) > (scrollTop + parentOffsetHeight);

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop);
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
  }
}

/*
 * Editable Combobox code
 */
interface comboOption {
  index: number, filtered: boolean, displayValue: string, value?: number
}
interface callbackFunc {
  (input:string):string|void;
}
interface dataFunction {
  (input?: any): Promise<comboOption[]|undefined>  ;

}
export class Combobox {
  inputEl: HTMLInputElement;
  listboxEl: HTMLElement;
  // focused option
  activeIndex: number;
  open: boolean;
  idBase: string | undefined;
  el: Element;
  optionsStatus?: comboOption[];
  private ignoreBlur: boolean = false;
  private debounce?: NodeJS.Timeout;
  alertEl: HTMLDivElement;
  callback?: callbackFunc;

  private readonly _getDataFunction: dataFunction;
  private eventHandlersSet: boolean = false;
  constructor(el: HTMLElement, callback?: callbackFunc, getDataFunction?: dataFunction) {
    this.el = el;
    this._getDataFunction = (getDataFunction == undefined) ? this.fetchDataFromSampleAPIAsync : getDataFunction;
    this.inputEl = el.querySelector('input')!;
    this.listboxEl = el.querySelector('[role=listbox]') as HTMLElement;
    this.alertEl = el.querySelector('[role=alert]') as HTMLDivElement;
    this.callback = callback;
    // data
    this.idBase = this.inputEl?.id;



    // state
    this.activeIndex = 0;
    this.open = false;
  }

  // sample api used if no alternative provided in constructor
  async fetchDataFromSampleAPIAsync(filterString?: string): Promise<comboOption[] | undefined> {
    const r = await fetch('https://dummy.restapiexample.com/api/v1/employees', {mode:"cors"});
    r.headers.forEach(function(value, name) {
      console.log(name + ": " + value);
    });
    if (r.status == 429) {
      const retryAfter = r.headers.get('retry-after') as unknown as number ?? 5;
      console.log(`backing off, waiting for ${retryAfter} seconds; headers are ${r.headers}`);
      // @ts-ignore

      const he = await r.trailer;
      console.debug(he);
      setTimeout(async ()=> await this.fetchDataFromSampleAPIAsync(), retryAfter * 1000);
      return;
    }
    let jsonResponse = await r.json(), optionsLise = [{display: '', value: undefined}];
    const resp = jsonResponse.data.map((x:any) => {return {display:x['employee_name'], value:x['id'] }});
    console.debug(resp);
    optionsLise = optionsLise.concat(resp);

    return  optionsLise.map((x, i) => {
      return {index: i, filtered: false, displayValue: x.display, value: x.value};
    });
  }
  async refreshDataAsync(getDataArgs?:any) {
    console.log('refreshing data');
    try {
      this.optionsStatus = await this._getDataFunction(...getDataArgs);

    }
    catch (e) {
      console.error(e);
    }
    if (this.optionsStatus) {
      this.inputEl.value = `${this.optionsStatus[0].value ?? ''}`;
    }
    this.optionsStatus?.map((option, index: number) => {
      const optionEl = document.createElement('li');
      optionEl.setAttribute('role', 'option');
      optionEl.id = `${this.idBase}-${index}`;
      optionEl.className = index === 0 ? 'combo-option option-current' : 'combo-option';
      optionEl.setAttribute('aria-selected', `${index === 0}`);
      optionEl.innerText = option.displayValue;
      if (option.value != null) {
        optionEl.value = option.value;
      }

      optionEl.addEventListener('click', () => {
        this.onOptionClick(index);
      });
      optionEl.addEventListener('mousedown', this.onOptionMouseDown.bind(this));

      this.listboxEl.appendChild(optionEl);
    });
    if (!this.eventHandlersSet) {
      this.inputEl.addEventListener('input', this.onInput.bind(this));
      this.inputEl.addEventListener('blur', this.onInputBlur.bind(this));
      this.inputEl.addEventListener('click', () => this.updateMenuState(true));
      this.inputEl.addEventListener('keydown', this.onInputKeyDown.bind(this));
      this.inputEl.addEventListener('keyup', this.onInputKeyUp.bind(this));
      this.eventHandlersSet = true;
    }
  }

  async init() {
    console.log('initializing')
    await this.refreshDataAsync();



  }

  onInput() {
    const curValue = this.inputEl.value;
    const matches = filterOptions(this.optionsStatus?.map(x=>x.displayValue), curValue);


    // set activeIndex to first matching option
    // (or leave it alone, if the active option is already in the matching set)
    const filterCurrentOption = matches.filter((option) => option === this.optionsStatus?.[this.activeIndex].displayValue);
    if (matches.length > 0 && !filterCurrentOption.length && this.optionsStatus) {
      this.onOptionChange(this.optionsStatus.map(x=>x.displayValue).indexOf(matches[0]));
    }

    const menuState = this.optionsStatus?.length ?? 0 > 0;
    if (this.open !== menuState) {
      this.updateMenuState(menuState, false);
    }
  }

  updateFilteredOptions() {

    const opElements = this.el.querySelectorAll('[role=option]');
    if (this.optionsStatus) {
      for (const i of this.optionsStatus) {
        const el = opElements[i.index];
        el.classList.toggle('option-hidden', i.filtered);
      }
    }
  }

  onInputKeyUp(event: KeyboardEvent, clearFilter: boolean = false) {
    const actionKey = getActionFromKey(event, this.open);
    if (!(actionKey == MenuActions.Open || actionKey == MenuActions.Type))
      return;

    if (actionKey == MenuActions.Open)
      clearFilter = true;

    if (!this.debounce) {
      this.debounce = setTimeout(()=>this.filterOptions(undefined, clearFilter), 700);
    }
  }
  filterOptions(filterString?:string, clearFilter: boolean = false) {
    const filter = filterString ? filterString : this.inputEl.value;
    this.optionsStatus?.forEach((t)=>{
              t.filtered = clearFilter ? false : !((t.displayValue.toLowerCase().indexOf(filter.toLowerCase()) ?? -1) >= 0);
    });
    this.updateFilteredOptions();
    if ((this.optionsStatus?.filter(x=>!x.filtered).length ?? 1) < 1)
    {
        this.toggleAlert(true, `No results found for\"${this.inputEl.value}\"`);
    }
    else
    {
      this.toggleAlert(false, );
    }
    this.debounce = undefined;
  }


  onInputKeyDown(event: KeyboardEvent) {
    const max = this.optionsStatus?.filter(x=>!x.filtered).pop()?.index ?? this.optionsStatus?.length ?? 1 -1;

    const action = getActionFromKey(event, this.open);

    switch (action) {
      case MenuActions.Next:
      case MenuActions.Last:
      case MenuActions.First:
      case MenuActions.Previous:
        event.preventDefault();
        return this.onOptionChange(this.getUpdatedIndex(this.activeIndex, max, action));
      case MenuActions.CloseSelect:
        event.preventDefault();
        this.selectOption(this.activeIndex);
        return this.updateMenuState(false);
      case MenuActions.Close:
        event.preventDefault();
        return this.updateMenuState(false);
      case MenuActions.Open:
        return this.updateMenuState(true);

      default:
        return;
    }
  }


  onInputBlur() {
    if (this.ignoreBlur) {
      this.ignoreBlur = false;
      return;
    }

    if (this.inputEl.value == null || this.inputEl.value == '') {
      if (this.inputEl.labels) {
        this.inputEl.labels[0].classList.toggle('sr-only', false);
      }
    }
    if (this.open) {
      this.selectOption(this.activeIndex);
      this.updateMenuState(false, false);
    }
  }

  onOptionChange(index: number) {
    this.activeIndex = index;
    this.inputEl.setAttribute('aria-activedescendant', `${this.idBase}-${index}`);

    // update active style
    const options = this.el.querySelectorAll('[role=option]');
    // @ts-ignore
    for (const optionEl of [...options]) {
      optionEl.classList.remove('option-current');
    }
    options[index].classList.add('option-current');

    if (this.open && isScrollable(this.listboxEl)) {
      maintainScrollVisibility(options[index] as HTMLElement, this.listboxEl);
    }
  }

  onOptionClick(index: any) {
    this.onOptionChange(index);
    this.selectOption(index);
    this.updateMenuState(false);
  }

  onOptionMouseDown() {
    this.ignoreBlur = true;
  }

  selectOption(index: number) {
    this.inputEl.value = this.optionsStatus?.[index].displayValue ?? '';
    this.activeIndex = index;

    // update aria-selected
    const options = this.el.querySelectorAll('[role=option]');
    // @ts-ignore
    [...options].forEach((optionEl) => {
      optionEl.setAttribute('aria-selected', 'false');
    });
    options[index].setAttribute('aria-selected', 'true');
    this.callback?.(options[index]?.getAttribute('value') ?? options[index]?.textContent ?? '');
  }

  updateMenuState(open: any, callFocus = true) {
    this.open = open;

    this.inputEl.setAttribute('aria-expanded', `${open}`);
    open ? this.el.classList.add('open') : this.el.classList.remove('open');

    if (this.inputEl?.labels) {
      this.inputEl.labels[0].classList.toggle('sr-only', (this.activeIndex != 0 || this.inputEl.value != ''));
    }


    callFocus && this.inputEl.focus();
  }

  getUpdatedIndex(current: number, max: number, action: number) {
    switch (action) {
      case MenuActions.First:
        return 1;
      case MenuActions.Last:
        return max;
      case MenuActions.Previous:
        // go backwards to find the next enabled option
        for (let i = current - 1; i > 0; i--) {
          if (!this.optionsStatus?.[i].filtered) {
            return i;
          }
        }
        return max;
      case MenuActions.Next:
        // find the next enabled option
        for (let i = current + 1; i <= max; i++) {
          if (!this.optionsStatus?.[i].filtered) {
            return i;
          }
        }
        return 1;
      default:
        return current;
    }
  }
  toggleAlert(active:boolean, message?: string) {
    if (active)
      this.alertEl.textContent = message ?? "No results found";

    this.alertEl.classList.toggle('active', active);
  }
}


