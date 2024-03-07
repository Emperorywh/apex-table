import React, { useRef } from "react";
import { IApexTableColumns } from "..";
import { ApexModalRef } from "../types/ApexModal";
import ApexTdWrap from "./ApexTdWrap";
import { Input, Modal } from "antd";

export interface IApexModalProps<T> {
    columnItem: IApexTableColumns<T>;
    dataSourceItem: any;
    columnValue: string;
    onInputChange: (value: string) => void;
}

const ApexModal: React.FC<IApexModalProps<any>> = (props) => {
    const { columnItem, dataSourceItem, columnValue, onInputChange } = props;
    const { modalOptions } = columnItem;
    const modalRef = useRef<ApexModalRef>();
    if (modalOptions) {
        const {
            title,
            content,
            icon = null,
            okText = '确定',
            cancelText = '取消',
            footer = null,
            closable = true,
            onOk,
            onCancel,
            ...modalProps
        } = modalOptions(dataSourceItem, dataSourceItem[columnItem.name], modalRef as unknown as any);
        return <ApexTdWrap>
            <Input
                defaultValue={columnValue}
                onBlur={inputEvent => {
                    const inputValue = inputEvent.target.value;
                    onInputChange && onInputChange(inputValue);
                }}
                onDoubleClick={() => {
                    modalRef.current = Modal.info({
                        title,
                        icon,
                        content,
                        okText,
                        cancelText,
                        footer,
                        closable,
                        onOk,
                        onCancel,
                        ...modalProps
                    });
                }}
            />
        </ApexTdWrap>
    } else {
        return <ApexTdWrap >
            <Input
                defaultValue={columnValue}
                onBlur={inputEvent => {
                    const inputValue = inputEvent.target.value;
                    onInputChange && onInputChange(inputValue);
                }}
            />
        </ApexTdWrap>
    }
}

export default ApexModal;