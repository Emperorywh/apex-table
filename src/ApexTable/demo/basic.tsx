import React, { useState } from 'react';
import { ApexTable } from 'apex-table';
import type { IApexTableColumns } from 'apex-table/ApexTable';
import { Space, Switch } from 'antd';
import { apexDeepClone } from '../utils/tool';

interface ITableListItem {
    kFullName: string,
    eFullName: string,
    inOutTypeName: string,
    billSourceName: string,
    sumQty: number,
    statusName: string,
    billIndexId: number,
    billCode: string,
    billDate: [string, string],
    remark: string,
    unitId: number,
    brandId: number,
    brand?: IBrand[],
    createTime?: string,
    option?: any,
    isOpen?: any
}

interface IBrand {
    id: string | number;
    name: string
}

const App: React.FC = () => {

    const [dataSource, setDataSource] = useState<ITableListItem[]>([
        {
            kFullName: "西奥仓库",
            eFullName: "超级管理员",
            inOutTypeName: "采购入库",
            billSourceName: "手工",
            sumQty: 11,
            statusName: "待入库",
            billIndexId: 26,
            billCode: "RKJHD-20231218-0001",
            billDate: ['2024-1-22 17:27:15', '2024-1-22 17:27:20'],
            remark: "备注1",
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
            ],
            createTime: '2024-1-22 17:07:34',
            isOpen: true
        },
        {
            kFullName: "成都01仓",
            eFullName: "超级管理员",
            inOutTypeName: "采购入库",
            billSourceName: "手工",
            sumQty: 12,
            statusName: "已入库",
            billIndexId: 27,
            billCode: "RKJHD-20231218-0002",
            billDate: ['2024-1-22 17:27:15', '2024-1-22 17:27:33'],
            remark: "备注2",
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
            ],
            createTime: '2024-1-22 17:08:06',
            isOpen: false
        },
        {
            kFullName: "西奥仓库1",
            eFullName: "超级管理员2",
            inOutTypeName: "采购入库3",
            billSourceName: "手工4",
            sumQty: 13,
            statusName: "待入库",
            billIndexId: 28,
            billCode: "RKJHD-20231218-0003",
            billDate: ['2024-1-22 17:27:15', '2024-1-22 17:27:37'],
            remark: "备注3",
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

            ],
            createTime: '2024-1-22 17:08:17',
            isOpen: true
        }
    ]);

    const columns: IApexTableColumns<ITableListItem>[] = [
        {
            title: '普通输入框1',
            name: 'kFullName',
        },
        {
            title: '普通输入框2',
            name: 'eFullName',
        },
        {
            title: '普通输入框3',
            name: 'inOutTypeName',
        },
        {
            title: '普通输入框4',
            name: 'billSourceName',
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
            title: '日期列',
            name: 'createTime',
            columnType: 'datePicker'
        },
        {
            title: '日期范围列',
            name: 'billDate',
            columnType: 'rangePicker',
            width: 300
        },
        {
            title: '自定义列1',
            name: 'isOpen',
            columnType: 'customer',
            width: 100,
            onFormatter: (row, value) => {
                return <Switch checked={value} onChange={event => {
                    const tempData: any[] = apexDeepClone(dataSource);
                    const find = tempData.find(item => item.billCode === row.billCode);
                    if (find) {
                        find.isOpen = event;
                        setDataSource(tempData)
                    }
                }} />
            }
        },
        {
            title: '操作列',
            name: 'option',
            columnType: 'customer',
            onFormatter: (row) => {
                return <Space style={{ width: '100%', display: 'flex', justifyContent: 'space-evenly' }}>
                    <a
                        key="editable"
                        onClick={() => {
                            console.log("哈哈哈", Date.now())
                        }}
                    >
                        编辑
                    </a>
                    <a key="view">
                        查看
                    </a>
                </Space>
            }
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
