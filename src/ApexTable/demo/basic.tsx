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
    remark: string,
    unitId: number,
    brandId: number,
    brand?: IBrand[]
}

interface IBrand {
    id: string | number;
    name: string
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
            "remark": "备注1",
            unitId: 1,
            brandId: 1,
            brand: [
                {
                    id: 1,
                    name: '法拉利'
                },
                {
                    id: 2,
                    name: '劳斯莱斯'
                },
                {
                    id: 3,
                    name: '玛莎拉蒂'
                },
            ]
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
            "remark": "备注2",
            unitId: 2,
            brandId: 3,
            brand: [
                {
                    id: 3,
                    name: '玛莎拉蒂'
                },
                {
                    id: 4,
                    name: '兰博基尼'
                },
                {
                    id: 5,
                    name: '长城'
                },
            ]
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
            "remark": "备注3",
            unitId: 3,
            brandId: 5,
            brand: [
                {
                    id: 5,
                    name: '长城'
                },
                {
                    id: 6,
                    name: '大众'
                },
                {
                    id: 7,
                    name: '吉利'
                },

            ]
        }
    ]);

    const columns: IApexTableColumns<ITableListItem>[] = [
        {
            title: '仓库',
            name: 'kFullName',
        },
        {
            title: '静态下拉框',
            name: 'unitId',
            columnType: 'select',
            options: [
                { value: 1, label: '个' },
                { value: 2, label: '件' },
                { value: 3, label: '箱' }
            ],
            defaultValue: 1,
            onChange: (value, option, options) => {
                console.log(">>>>>>>>>>>>>>", value, option, options)
            },
        },
        {
            title: '动态下拉框',
            name: 'brandId',
            columnType: 'select',
            options: (value, row) => {
                const { brand = [] } = row;
                brand?.forEach((item: any) => {
                    item['value'] = item['id'];
                    item['label'] = item['name'];
                });
                return brand;
            },
            onChange: (value, option, options) => {
                console.log(">>>>>>>>>>>>>>", value, option, options)
            },
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
