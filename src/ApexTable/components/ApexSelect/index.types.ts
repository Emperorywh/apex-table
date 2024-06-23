import { ICommonProps, IComponentsRef } from "../index.types";

export interface IProps extends ICommonProps {
    
}

export interface IApexSelect extends IComponentsRef {
    
}

export interface BaseSelectRef {
    focus: () => void;
    blur: () => void;
    scrollTo: any;
}