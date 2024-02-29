import { Input, Modal } from "antd"
import { IApexTableColumns } from "apex-table/ApexTable";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";

export interface ApexModalIProps {
    title?: React.ReactNode;                //标题
    destroyOnClose?: boolean;               //关闭时销毁 Modal 里的子元素
    width?: number;                         //宽度
    content: React.ReactNode;               //弹框内容
    showText?: string;                      //在表格中展示的内容
    okText?: React.ReactNode;               //确认按钮文字
    cancelText?: React.ReactNode;           //取消按钮文字
    footer?: React.ReactNode | null;        //底部内容，当不需要默认底部按钮时，可以设为 footer={null}
    ref?: React.RefObject<ApexModalRef>;    //弹窗实例
    onOk?: () => void;                      //点击确定回调
    onCancel?: () => void;                  //点击遮罩层或右上角叉或取消按钮的回调
}

export interface ApexModalRef {
    handleOk: () => void;
    handleCancel: () => void;
}

const ApexModal = forwardRef<ApexModalRef, ApexModalIProps>((props, ref) => {

    useImperativeHandle(ref, () => {
        return {
            handleOk,
            handleCancel
        }
    }, []);

    const {
        title,
        destroyOnClose = true,
        width = 520,
        content,
        showText = '',
        okText = '确定',
        cancelText = '取消',
        footer,
        onOk,
        onCancel,
    } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {
        setIsModalOpen(false);
        onOk && onOk();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        onCancel && onCancel();
    };

    const handleDoubleClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        setIsModalOpen(true);
    }

    useEffect(() => {
        console.log("isModalOpen", isModalOpen);
    }, [isModalOpen]);

    return <>
        <Input value={showText} onDoubleClick={handleDoubleClick} readOnly />
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={destroyOnClose}
            okText={okText}
            cancelText={cancelText}
            footer={footer}
            width={width}
        >
            {content}
        </Modal>
    </>
});

export default ApexModal;