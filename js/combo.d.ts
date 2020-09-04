export declare class Combobox {
    inputEl: HTMLInputElement;
    listboxEl: HTMLElement;
    activeIndex: number;
    open: boolean;
    idBase: string | undefined;
    el: Element;
    optionsStatus?: comboOption[];
    private ignoreBlur;
    private debounce?;
    alertEl: HTMLDivElement;
    callback?: callbackFunc;
    private readonly _getDataFunction;
    private eventHandlersSet;
    private alertActive;
    constructor(el: HTMLElement, callback?: callbackFunc, getDataFunction?: dataFunction);
    refreshDataAsync(...getDataArgs: undefined[]): void;
    init(): void;
    onInput(): void;
    updateFilteredOptions(): void;
    onInputKeyUp(event: KeyboardEvent, clearFilter?: boolean): void;
    filterOptions(filterString?: string, clearFilter?: boolean): void;
    onInputKeyDown(event: KeyboardEvent): void;
    onInputBlur(): void;
    onOptionChange(index: number): void;
    onOptionClick(index: number): void;
    onOptionMouseDown(): void;
    selectOption(index: number): void;
    updateMenuState(open: boolean, callFocus?: boolean): void;
    getUpdatedIndex(current: number, max: number, action: number): number;
    toggleAlert(active: boolean, message?: string): void;
}
export interface comboOption {
    index: number;
    filtered: boolean;
    displayValue: string;
    value?: number;
    active?: boolean;
}
interface callbackFunc {
    (input: string): string | void;
}
interface dataFunction {
    (input?: never): Promise<comboOption[] | undefined>;
}
export {};
//# sourceMappingURL=combo.d.ts.map