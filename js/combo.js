'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Combobox = void 0;
// helpers
var Keys = {
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
    Up: 'ArrowUp',
};
var MenuActions = {
    Close: 0,
    CloseSelect: 1,
    First: 2,
    Last: 3,
    Next: 4,
    Open: 5,
    Previous: 6,
    Select: 7,
    Space: 8,
    Type: 9,
};
var Combobox = /** @class */ (function () {
    function Combobox(el, callback, getDataFunction) {
        var _a;
        this.ignoreBlur = false;
        this.eventHandlersSet = false;
        this.alertActive = false;
        this.el = el;
        this._getDataFunction = getDataFunction == undefined ? fetchDataFromSampleAPIAsync : getDataFunction;
        var inputElement = el.querySelector('input');
        if (!inputElement)
            throw new Error('Unable to find related input element for combobox');
        else
            this.inputEl = inputElement;
        this.listboxEl = el.querySelector('[role=listbox]');
        this.alertEl = el.querySelector('[role=alert]');
        this.callback = callback;
        // data
        this.idBase = (_a = this.inputEl) === null || _a === void 0 ? void 0 : _a.id;
        // state
        this.activeIndex = 0;
        this.open = false;
    }
    Combobox.prototype.refreshDataAsync = function () {
        var _this = this;
        var getDataArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            getDataArgs[_i] = arguments[_i];
        }
        console.debug('refreshing data');
        try {
            this._getDataFunction.apply(this, getDataArgs).then(function (x) {
                var _a, _b, _c;
                _this.optionsStatus = [{ index: 0, displayValue: '', filtered: false }];
                // if data is undefined, propagate that information
                _this.optionsStatus = x ? _this.optionsStatus.concat(x) : undefined;
                (_a = _this.optionsStatus) === null || _a === void 0 ? void 0 : _a.map(function (option, index) {
                    var _a;
                    var optionEl = document.createElement('li');
                    optionEl.setAttribute('role', 'option');
                    optionEl.id = _this.idBase + "-" + index;
                    optionEl.className = index === 0 ? 'combo-option option-current' : 'combo-option';
                    optionEl.setAttribute('aria-selected', "" + (index === 0));
                    optionEl.innerText = option.displayValue;
                    if (option.value != null) {
                        optionEl.value = (_a = option.value) !== null && _a !== void 0 ? _a : 0;
                    }
                    optionEl.addEventListener('click', function () {
                        _this.onOptionClick(index);
                    });
                    optionEl.addEventListener('mousedown', _this.onOptionMouseDown.bind(_this));
                    _this.listboxEl.appendChild(optionEl);
                });
                if (!_this.eventHandlersSet) {
                    _this.inputEl.addEventListener('input', _this.onInput.bind(_this));
                    _this.inputEl.addEventListener('blur', _this.onInputBlur.bind(_this));
                    _this.inputEl.addEventListener('click', function () { return _this.updateMenuState(true); });
                    _this.inputEl.addEventListener('keydown', _this.onInputKeyDown.bind(_this));
                    _this.inputEl.addEventListener('keyup', _this.onInputKeyUp.bind(_this));
                    _this.eventHandlersSet = true;
                }
                if (_this.optionsStatus) {
                    _this.inputEl.value = "" + ((_c = (_b = _this.optionsStatus) === null || _b === void 0 ? void 0 : _b[0].displayValue) !== null && _c !== void 0 ? _c : '');
                }
            })
                .catch(function (x) {
                throw x;
            });
        }
        catch (e) {
            console.error(e);
        }
    };
    Combobox.prototype.init = function () {
        this.refreshDataAsync();
    };
    Combobox.prototype.onInput = function () {
        var _this = this;
        var _a, _b, _c;
        var curValue = this.inputEl.value;
        var matches = filterOptions((_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a.map(function (x) { return x.displayValue; }), curValue);
        // set activeIndex to first matching option
        // (or leave it alone, if the active option is already in the matching set)
        var filterCurrentOption = matches.filter(function (option) { var _a; return option === ((_a = _this.optionsStatus) === null || _a === void 0 ? void 0 : _a[_this.activeIndex].displayValue); });
        if (matches.length > 0 && !filterCurrentOption.length && this.optionsStatus) {
            this.onOptionChange(this.optionsStatus.map(function (x) { return x.displayValue; }).indexOf(matches[0]));
        }
        var menuState = ((_c = (_b = this.optionsStatus) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0) > 0;
        if (this.open !== menuState) {
            this.updateMenuState(menuState, false);
        }
    };
    Combobox.prototype.updateFilteredOptions = function () {
        var _this = this;
        var _a;
        (_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a.forEach(function (v) {
            _this.listboxEl.children[v.index].classList.toggle('option-hidden', v.filtered);
        });
    };
    Combobox.prototype.onInputKeyUp = function (event, clearFilter) {
        var _this = this;
        if (clearFilter === void 0) { clearFilter = false; }
        var actionKey = getActionFromKey(event, this.open);
        if (!(actionKey == MenuActions.Open || actionKey == MenuActions.Type))
            return;
        if (actionKey == MenuActions.Open)
            clearFilter = true;
        if (!this.debounce) {
            this.debounce = setTimeout(function () { return _this.filterOptions(undefined, clearFilter); }, 700);
        }
    };
    Combobox.prototype.filterOptions = function (filterString, clearFilter) {
        var _a, _b, _c;
        if (clearFilter === void 0) { clearFilter = false; }
        var filter = filterString ? filterString : this.inputEl.value;
        (_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a.forEach(function (t) {
            var _a;
            t.filtered = clearFilter
                ? false
                : !(((_a = t.displayValue.toLowerCase().indexOf(filter.toLowerCase())) !== null && _a !== void 0 ? _a : -1) >= 0);
        });
        this.updateFilteredOptions();
        if (((_c = (_b = this.optionsStatus) === null || _b === void 0 ? void 0 : _b.filter(function (x) { return !x.filtered; }).length) !== null && _c !== void 0 ? _c : 1) < 1) {
            this.toggleAlert(true, "No results found for\"" + this.inputEl.value + "\"");
        }
        else {
            this.toggleAlert(false);
        }
        this.debounce = undefined;
    };
    Combobox.prototype.onInputKeyDown = function (event) {
        var _a, _b, _c, _d, _e;
        var max = (_e = (_c = (_b = (_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return !x.filtered; }).pop()) === null || _b === void 0 ? void 0 : _b.index) !== null && _c !== void 0 ? _c : (_d = this.optionsStatus) === null || _d === void 0 ? void 0 : _d.length) !== null && _e !== void 0 ? _e : 1 - 1;
        var action = getActionFromKey(event, this.open);
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
    };
    Combobox.prototype.onInputBlur = function () {
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
    };
    Combobox.prototype.onOptionChange = function (index) {
        this.inputEl.setAttribute('aria-activedescendant', this.idBase + "-" + index);
        // update active style
        this.listboxEl.children[this.activeIndex].classList.remove('option-current');
        this.listboxEl.children[index].classList.add('option-current');
        this.activeIndex = index;
        if (this.open && isScrollable(this.listboxEl)) {
            maintainScrollVisibility(this.listboxEl.children[index], this.listboxEl);
        }
    };
    Combobox.prototype.onOptionClick = function (index) {
        this.onOptionChange(index);
        this.selectOption(index);
        this.updateMenuState(false);
    };
    Combobox.prototype.onOptionMouseDown = function () {
        this.ignoreBlur = true;
    };
    Combobox.prototype.selectOption = function (index) {
        var _a, _b, _c, _d, _e, _f, _g;
        this.inputEl.value = (_b = (_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a[index].displayValue) !== null && _b !== void 0 ? _b : '';
        // update aria-selected
        this.listboxEl.children[this.activeIndex].setAttribute('aria-selected', 'false');
        this.listboxEl.children[index].setAttribute('aria-selected', 'true');
        this.activeIndex = index;
        (_c = this.callback) === null || _c === void 0 ? void 0 : _c.call(this, (_g = (_e = (_d = this.listboxEl.children[index]) === null || _d === void 0 ? void 0 : _d.getAttribute('value')) !== null && _e !== void 0 ? _e : (_f = this.listboxEl.children[index]) === null || _f === void 0 ? void 0 : _f.textContent) !== null && _g !== void 0 ? _g : '');
    };
    Combobox.prototype.updateMenuState = function (open, callFocus) {
        var _a;
        if (callFocus === void 0) { callFocus = true; }
        this.open = open;
        this.inputEl.setAttribute('aria-expanded', "" + open);
        open ? this.el.classList.add('open') : this.el.classList.remove('open');
        if (this.inputEl.value) {
            this.toggleAlert(false);
        }
        if ((_a = this.inputEl) === null || _a === void 0 ? void 0 : _a.labels) {
            this.inputEl.labels[0].classList.toggle('sr-only', this.activeIndex != 0 || this.inputEl.value != '');
        }
        callFocus && this.inputEl.focus();
    };
    Combobox.prototype.getUpdatedIndex = function (current, max, action) {
        var _a, _b;
        switch (action) {
            case MenuActions.First:
                return 1;
            case MenuActions.Last:
                return max;
            case MenuActions.Previous:
                // go backwards to find the next enabled option
                for (var i = current - 1; i > 0; i--) {
                    if (!((_a = this.optionsStatus) === null || _a === void 0 ? void 0 : _a[i].filtered)) {
                        return i;
                    }
                }
                return max;
            case MenuActions.Next:
                // find the next enabled option
                for (var i = current + 1; i <= max; i++) {
                    if (!((_b = this.optionsStatus) === null || _b === void 0 ? void 0 : _b[i].filtered)) {
                        return i;
                    }
                }
                return 1;
            default:
                return current;
        }
    };
    Combobox.prototype.toggleAlert = function (active, message) {
        // if requested state is the same as current, skip the work
        if (this.alertActive == active)
            return;
        if (active)
            this.alertEl.textContent = message !== null && message !== void 0 ? message : 'No results found';
        this.alertEl.classList.toggle('active', active);
        this.alertActive = active;
    };
    return Combobox;
}());
exports.Combobox = Combobox;
// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
function filterOptions(options, filter, exclude) {
    if (options === void 0) { options = []; }
    if (exclude === void 0) { exclude = []; }
    return options.filter(function (option) {
        var matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0;
        return matches && exclude.indexOf(option) < 0;
    });
}
// return combobox action from key press
function getActionFromKey(event, menuOpen) {
    var key = event.key, altKey = event.altKey, ctrlKey = event.ctrlKey, metaKey = event.metaKey;
    // handle opening when closed
    if (!menuOpen && (key === Keys.Down || key === Keys.Enter || key === Keys.Space)) {
        return MenuActions.Open;
    }
    // handle keys when open
    if (key === Keys.Down) {
        return MenuActions.Next;
    }
    else if (key === Keys.Up) {
        return MenuActions.Previous;
    }
    else if (key === Keys.Home) {
        return MenuActions.First;
    }
    else if (key === Keys.End) {
        return MenuActions.Last;
    }
    else if (key === Keys.Escape) {
        return MenuActions.Close;
    }
    else if (key === Keys.Enter) {
        return MenuActions.CloseSelect;
    }
    else if (key === Keys.Space) {
        return MenuActions.Space;
    }
    else if (key === Keys.Backspace || key === Keys.Clear || (key.length === 1 && !altKey && !ctrlKey && !metaKey)) {
        return MenuActions.Type;
    }
}
function toPromise(f) {
    return function () {
        return new Promise(function (resolve, reject) {
            var result = f.apply(f.arguments);
            try {
                return result.then(resolve, reject); // promise.
            }
            catch (e) {
                if (e instanceof TypeError) {
                    resolve(result); // resolve naked value.
                }
                else {
                    reject(e); // pass unhandled exception to caller.
                }
            }
        });
    };
}
// check if an element is currently scrollable
function isScrollable(element) {
    return element && element.clientHeight < element.scrollHeight;
}
// ensure given child element is within the parent's visible scroll area
function maintainScrollVisibility(activeElement, scrollParent) {
    var offsetHeight = activeElement.offsetHeight, offsetTop = activeElement.offsetTop;
    var parentOffsetHeight = scrollParent.offsetHeight, scrollTop = scrollParent.scrollTop;
    var isAbove = offsetTop < scrollTop;
    var isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;
    if (isAbove) {
        scrollParent.scrollTo(0, offsetTop);
    }
    else if (isBelow) {
        scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
}
// sample api used if no alternative provided in constructor
function fetchDataFromSampleAPIAsync(filterString) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var r, retryAfter, he, jsonResponse, optionsLise, resp;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetch('https://dummy.restapiexample.com/api/v1/employees', { mode: 'cors' })];
                case 1:
                    r = _b.sent();
                    r.headers.forEach(function (value, name) {
                        console.log(name + ': ' + value);
                    });
                    if (!(r.status == 429)) return [3 /*break*/, 5];
                    retryAfter = (_a = r.headers.get('retry-after')) !== null && _a !== void 0 ? _a : 5;
                    console.debug("backing off, waiting for " + retryAfter + " seconds; headers are " + r.headers);
                    return [4 /*yield*/, r.trailer];
                case 2:
                    he = _b.sent();
                    console.debug(he);
                    return [4 /*yield*/, delay(retryAfter * 1000)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, fetchDataFromSampleAPIAsync(filterString)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, r.json()];
                case 6:
                    jsonResponse = _b.sent(), optionsLise = [{ display: '', value: undefined }];
                    resp = jsonResponse.data.map(function (x) {
                        return { display: x['employee_name'], value: x['id'] };
                    });
                    return [2 /*return*/, optionsLise.concat(resp).map(function (x, i) {
                            return { index: i, filtered: false, displayValue: x.display, value: x.value };
                        })];
            }
        });
    });
}
// sleep function
function delay(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
//# sourceMappingURL=combo.js.map