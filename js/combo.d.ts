interface comboOption {
    index: number;
    filtered: boolean;
    displayValue: string;
    value?: number;
}
interface callbackFunc {
    (input: string): string | void;
}
interface dataFunction {
    (input?: any): Promise<comboOption[] | undefined>;
}
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
    constructor(el: HTMLElement, callback?: callbackFunc, getDataFunction?: dataFunction);
    fetchDataFromSampleAPIAsync(filterString?: string): Promise<comboOption[] | undefined>;
    refreshDataAsync(getDataArgs?: any): Promise<void>;
    init(): Promise<void>;
    onInput(): void;
    updateFilteredOptions(): void;
    onInputKeyUp(event: KeyboardEvent, clearFilter?: boolean): void;
    filterOptions(filterString?: string, clearFilter?: boolean): void;
    onInputKeyDown(event: KeyboardEvent): void;
    onInputBlur(): void;
    onOptionChange(index: number): void;
    onOptionClick(index: any): void;
    onOptionMouseDown(): void;
    selectOption(index: number): void;
    updateMenuState(open: any, callFocus?: boolean): void;
    getUpdatedIndex(current: number, max: number, action: number): number;
    toggleAlert(active: boolean, message?: string): void;
}
export {};
//# sourceMappingURL=combo.d.ts.map