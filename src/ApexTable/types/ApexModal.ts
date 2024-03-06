import { ModalFuncProps } from "antd";

/**
 * 弹窗相关类型
 */

export interface ApexModalRef {
    destroy: () => void;
    update: (props: ModalFuncProps) => void;
}