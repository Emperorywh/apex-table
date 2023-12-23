import React, { useState } from 'react';
import { ApexTable } from 'apex-table';
import type { IApexTableColumns } from 'apex-table/ApexTable';

interface ITableListItem {
    kFullName: string,
    eFullName: string,
    inOutTypeName: string,
    billSourceName: string,
    sumQty: number,
    statusName: string,
    billIndexId: number,
    billCode: string,
    billDate: string,
    remark: string
}

const App: React.FC = () => {

    const [dataSource, setDataSource] = useState<ITableListItem[]>([
        {
            "kFullName": "西奥仓库",
            "eFullName": "超级管理员",
            "inOutTypeName": "采购入库",
            "billSourceName": "手工",
            "sumQty": 11,
            "statusName": "待入库",
            "billIndexId": 26,
            "billCode": "RKJHD-20231218-0001",
            "billDate": "2023-12-18 21:56:03",
            "remark": "备注1"
        },
        {
            "kFullName": "成都01仓",
            "eFullName": "超级管理员",
            "inOutTypeName": "采购入库",
            "billSourceName": "手工",
            "sumQty": 12,
            "statusName": "已入库",
            "billIndexId": 27,
            "billCode": "RKJHD-20231218-0002",
            "billDate": "2023-12-18 21:55:58",
            "remark": "备注2"
        },
        {
            "kFullName": "西奥仓库1",
            "eFullName": "超级管理员2",
            "inOutTypeName": "采购入库3",
            "billSourceName": "手工4",
            "sumQty": 13,
            "statusName": "待入库",
            "billIndexId": 28,
            "billCode": "RKJHD-20231218-0003",
            "billDate": "2023-12-18 21:56:11",
            "remark": "备注3"
        }
    ]);

    const columns: IApexTableColumns<ITableListItem>[] = [
        {
            title: '仓库',
            name: 'kFullName',
        },
        {
            title: '经手人',
            name: 'eFullName',
        },
        {
            title: '入库类型',
            name: 'inOutTypeName',
        },
        {
            title: '单据来源',
            name: 'billSourceName',
        },
        {
            title: '计划数量',
            name: 'sumQty',
        },
        {
            title: '单据状态',
            name: 'statusName',
        },
        {
            title: '单据编号',
            name: 'billCode',
        },
        {
            title: '单据日期',
            name: 'billDate',
        },
        {
            title: '备注',
            name: 'remark',
        }
    ]

    return <ApexTable
        allowSelect
        columns={columns}
        dataSource={dataSource}
        showHeaderCheckBox
    />
};

export default App;
