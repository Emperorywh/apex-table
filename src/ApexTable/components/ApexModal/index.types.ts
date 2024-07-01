import { ModalFuncProps } from "antd";
import { ICommonProps, IComponentsRef } from "../index.types";

export interface IProps<T> extends ICommonProps<T> {
    
}

export interface IApexModal extends IComponentsRef {
    
}

export interface ApexModalRef  {
    destroy: () => void;
    update: (props: ModalFuncProps) => void;
}