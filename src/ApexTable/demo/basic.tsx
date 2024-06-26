import React, { useEffect, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { IApexTableColumns } from 'apex-table/ApexTable';
import { Button, Space } from 'antd';
import { nanoid } from "nanoid";
interface ITableListItem {
    kFullName: string;
    kid: number;
    pUserCode: string;
    pFullName: string;
    pid: number;
    cargoName: string;
    cargoId: number;
    unitName: string;
    unitId: number;
    assQty: number;
    produceDate: string;
    endDate: string;
    validityDay: number;
    id: string;
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
            array.push({
                id: nanoid(),
                kFullName: '默认仓库' + i,
                kid: i,
                pUserCode: 'SP000' + i,
                pFullName: '商品名称' + i,
                pid: i,
                cargoName: '货位' + i,
                cargoId: i,
                unitName: '单位' + i,
                unitId: i % 3 > 0 ? i % 3 : 3,
                assQty: i,
                produceDate: new Date().toLocaleDateString(),
                endDate: new Date().toLocaleDateString(),
                validityDay: i
            })
        }
        setDataSource(array);
    }

    // 表格列
    const columns: IApexTableColumns<ITableListItem>[] = [
        {
            title: '仓库',
            name: 'kFullName',
            columnType: 'modal',
            modalOptions: (row, value, modalRef) => {
                return {
                    title: '仓库信息',
                    content: <div>
                        <h1>仓库列表</h1>
                        <div>{value}</div>
                        <Space>
                            <Button onClick={() => {
                                modalRef.current?.destroy();
                            }}>取消</Button>
                            <Button type='primary' onClick={() => {modalRef.current?.destroy();}}>确定</Button>
                        </Space>
                    </div>
                }
            }
        },
        {
            title: '商品编号',
            name: 'pUserCode',
        },
        {
            title: '商品名称',
            name: 'pFullName'
        },
        {
            title: '货位',
            name: 'cargoName',
        },
        {
            title: '单位',
            name: 'unitId',
            columnType: 'select',
            options: [
                { value: 1, label: '个' },
                { value: 2, label: '件' },
                { value: 3, label: '箱' },
            ]
        },
        {
            title: '数量',
            name: 'assQty',
            columnType: 'inputNumber'
        },
        {
            title: '生产日期',
            name: 'produceDate',
            columnType: 'datePicker'
        },
        {
            title: '保质期（天）',
            name: 'validityDay',
        },
        {
            title: '到期日期',
            name: 'endDate',
            columnType: 'datePicker'
        }
    ]

    useEffect(() => {
        initDataSource();
    }, []);

    return <ApexTable
        allowSelect
        columns={columns}
        dataSource={dataSource}
        showHeaderCheckBox
        showPagination
        pagination={{ pageSize: 50 }}
        rowKey='id'
    />
};

export default App;

