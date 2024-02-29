import { Input, Modal } from "antd"
import { IApexTableColumns } from "apex-table/ApexTable";
import React, { useState } from "react";

export interface ApexModalIProps {
    title?: React.ReactNode;                //标题
    destroyOnClose?: boolean;               //关闭时销毁 Modal 里的子元素
    width?: number;                         //宽度
    content: React.ReactNode;               //弹框内容
    showText?: string;                      //在表格中展示的内容
    okText?: React.ReactNode;               //确认按钮文字
    cancelText?: React.ReactNode;           //取消按钮文字
    onOk?: () => void;                      //点击确定回调
    onCancel?: () => void;                  //点击遮罩层或右上角叉或取消按钮的回调
}

const ApexModal: React.FC<ApexModalIProps> = (props) => {
    const {
        title,
        destroyOnClose = true,
        content,
        showText = '',
        okText = '确定',
        cancelText = '取消',
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

    return <td className='apex-table-tbody-td'>
        <Input value={showText} onDoubleClick={handleDoubleClick} readOnly />
        <Modal
            title={title}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={destroyOnClose}
            okText={okText}
            cancelText={cancelText}
        >
            {content}
        </Modal>
    </td>
}

export default ApexModal;