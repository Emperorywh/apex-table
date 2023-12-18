import React, { type FC } from 'react';
import "./index.less"

interface IProps {

}

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

interface IApexTableColumn<T> {
    title: string;
    name: keyof T;
}

const ApexTable: FC<IProps> = (props) => {

    const dataSource: ITableListItem[] = [
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
        },
    ]

    const columns: IApexTableColumn<ITableListItem>[] = [
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

    return <div className='apex-table-container'>
        <div className='apex-table-content'>
            <table className='apex-table'>
                <colgroup>

                </colgroup>
                <caption>这是表格的标题</caption>
                <thead className='apex-table-thead'>
                    <tr>
                        {
                            columns.map((item, index) => {
                                return <th key={item['name'] + index} className='apex-table-thead-th'>{item['title']}</th>
                            })
                        }
                    </tr>
                </thead>
                <tbody className='apex-table-tbody'>
                    {
                        dataSource.map((dataSourceItem, dataSourceIndex) => {
                            return <tr key={dataSourceIndex} className='apex-table-tbody-tr'>
                                {
                                    columns.map((columnItem, columnIndex) => {
                                        return <td key={columnItem['name'] + "-" + columnIndex} className='apex-table-tbody-td'>{dataSourceItem[columnItem['name']]}</td>
                                    })
                                }
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
};

export default ApexTable;
