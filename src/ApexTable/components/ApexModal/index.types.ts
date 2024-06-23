import { ModalFuncProps } from "antd";
import { ICommonProps, IComponentsRef } from "../index.types";

export interface IProps extends ICommonProps {
    
}

export interface IApexModal extends IComponentsRef {
    
}

export interface ApexModalRef  {
    destroy: () => void;
    update: (props: ModalFuncProps) => void;
}