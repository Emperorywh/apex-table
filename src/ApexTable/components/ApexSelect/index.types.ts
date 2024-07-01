import { ICommonProps, IComponentsRef } from "../index.types";

export interface IProps<T> extends ICommonProps<T> {
    
}

export interface IApexSelect extends IComponentsRef {
    
}

export interface BaseSelectRef {
    focus: () => void;
    blur: () => void;
    scrollTo: any;
}