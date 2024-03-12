import React, { forwardRef, useRef } from "react";
import { IApexTableColumns } from "..";
import { ApexModalRef } from "../types/ApexModal";
import ApexTdWrap from "./ApexTdWrap";
import { Input, InputRef, Modal } from "antd";
import { MoreOutlined } from '@ant-design/icons';

export interface IApexModalProps<T> {
    columnItem: IApexTableColumns<T>;
    dataSourceItem: any;
    columnValue: string;
    onInputChange: (value: string) => void;
    ref?: React.Ref<InputRef>;
    onFocus?: React.FocusEventHandler<HTMLInputElement>;
}

const ApexModal: React.FC<IApexModalProps<any>> = forwardRef((props, ref) => {
    const { columnItem, dataSourceItem, columnValue, onInputChange, onFocus } = props;
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
                suffix={<MoreOutlined />}
                ref={ref}
                onFocus={onFocus}
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
                suffix={<MoreOutlined />}
                ref={ref}
                onFocus={onFocus}
            />
        </ApexTdWrap>
    }
});

export default ApexModal;