import React, { useEffect, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { IApexTableColumns } from 'apex-table/ApexTable';
import { Button, Space, Switch, message } from 'antd';

interface ITableListItem {
    input_1: string;
    input_2: string;
    input_3: string;
    input_number_1: number;
    input_number_2: number;
    input_number_3: number;
    datePicker_1: string;
    datePicker_2: string;
    datePicker_3: string;
    rangePicker_1: [string, string];
    rangePicker_2: [string, string];
    rangePicker_3: [string, string];
    select_1: number;
    select_2: number;
    select_3: number;
    modal_1: string;
    modal_2: string;
    modal_3: string;
}


const App: React.FC = () => {

    // 表格数据源
    const [dataSource, setDataSource] = useState<ITableListItem[]>([]);

    /**
     * 初始化数据
     */
    const initDataSource = () => {
        const array: ITableListItem[] = [];
        for (let i = 0; i < 100; i++) {
            const data: ITableListItem = {
                input_1: `输入框${i + 1}`,
                input_2: `输入框${i + 2}`,
                input_3: `输入框${i + 3}`,
                input_number_1: i,
                input_number_2: i + 1,
                input_number_3: i + 2,
                datePicker_1: new Date().toLocaleDateString(),
                datePicker_2: new Date().toLocaleDateString(),
                datePicker_3: new Date().toLocaleDateString(),
                rangePicker_1: [new Date().toLocaleDateString(), new Date().toLocaleDateString()],
                rangePicker_2: [new Date().toLocaleDateString(), new Date().toLocaleDateString()],
                rangePicker_3: [new Date().toLocaleDateString(), new Date().toLocaleDateString()],
                select_1: 1,
                select_2: 2,
                select_3: 3,
                modal_1: `弹窗${i + 1}`,
                modal_2: `弹窗${i + 1}`,
                modal_3: `弹窗${i + 1}`,
            }
            array.push(data);
        }
        setDataSource(array);
    }

    // 表格列
    const columns: IApexTableColumns<ITableListItem>[] = [
        {
            title: '输入框_1',
            name: 'input_1'
        },
        {
            title: '输入框_2（只读）',
            name: 'input_2',
            readOnly: true
        },
        {
            title: '输入框_3',
            name: 'input_3'
        },
        {
            title: '数字输入框_1',
            name: 'input_number_1',
            columnType: 'inputNumber'
        },
        {
            title: '数字输入框_2',
            name: 'input_number_2',
            columnType: 'inputNumber'
        },
        {
            title: '数字输入框_3',
            name: 'input_number_3',
            columnType: 'inputNumber'
        },
        {
            title: '日期列_1',
            name: 'datePicker_1',
            columnType: 'datePicker'
        },
        {
            title: '日期列_2',
            name: 'datePicker_2',
            columnType: 'datePicker'
        },
        {
            title: '日期列_3',
            name: 'datePicker_3',
            columnType: 'datePicker'
        },
        {
            title: '日期范围列_1',
            name: 'rangePicker_1',
            columnType: 'rangePicker',
            width: 250
        },
        {
            title: '日期范围列_2',
            name: 'rangePicker_2',
            columnType: 'rangePicker',
            width: 250
        },
        {
            title: '日期范围列_3',
            name: 'rangePicker_3',
            columnType: 'rangePicker',
            width: 250
        },
        {
            title: '下拉列_1',
            name: 'select_1',
            columnType: 'select',
            options: [
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 },
                { label: '选项3', value: 3 },
            ]
        },
        {
            title: '下拉列_2',
            name: 'select_2',
            columnType: 'select',
            options: [
                { label: '选项1', value: 1 },
                { label: '选项2', value: 2 },
                { label: '选项3', value: 3 },
            ]
        },
        {
            title: '下拉列_3',
            name: 'select_3',
            columnType: 'select',
            options: (row) => {
                return [
                    { label: '选项1', value: 1 },
                    { label: '选项2', value: 2 },
                    { label: '选项3', value: 3 },
                ]
            }
        },
        {
            title: '弹窗列_1',
            name: 'modal_1',
            columnType: 'modal',
            modalOptions: (row, value, modalRef) => {
                return {
                    title: '标题1',
                    content: <div>
                        <div>哈哈哈哈{value}</div>
                        <Space>
                            <Button onClick={() => {
                                modalRef.current?.destroy();
                            }}>取消</Button>
                            <Button type='primary' onClick={() => { }}>确定</Button>
                        </Space>
                    </div>,
                    onOk: () => {
                        message.info("点击确定");
                    },
                    onCancel: () => {
                        message.info("点击取消");
                    },
                }
            }
        },
        {
            title: '弹窗列_2',
            name: 'modal_2',
            columnType: 'modal',
            modalOptions: (row, value, modalRef) => {
                return {
                    title: '标题2',
                    content: <div>
                        <div>哈哈哈哈{value}</div>
                        <Space>
                            <Button onClick={() => {
                                modalRef.current?.destroy();
                            }}>取消</Button>
                            <Button type='primary' onClick={() => { }}>确定</Button>
                        </Space>
                    </div>,
                    onOk: () => {
                        message.info("点击确定");
                    },
                    onCancel: () => {
                        message.info("点击取消");
                    },
                }
            }
        },
        {
            title: '弹窗列_3',
            name: 'modal_3',
            columnType: 'modal',
            modalOptions: (row, value, modalRef) => {
                return {
                    title: '标题3',
                    content: <div>
                        <div>哈哈哈哈{value}</div>
                        <Space>
                            <Button onClick={() => {
                                modalRef.current?.destroy();
                            }}>取消</Button>
                            <Button type='primary' onClick={() => { }}>确定</Button>
                        </Space>
                    </div>,
                    onOk: () => {
                        message.info("点击确定");
                    },
                    onCancel: () => {
                        message.info("点击取消");
                    },
                }
            }
        },
    ]

    useEffect(() => {
        initDataSource();
    }, []);

    return <ApexTable
        allowSelect
        columns={columns}
        dataSource={dataSource}
        showHeaderCheckBox
        isSingle
    />
};

export default App;

