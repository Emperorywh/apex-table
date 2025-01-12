import React, { useRef, useState } from 'react';
import mockDataJson from './mockData';
import { ApexTablePro } from 'apex-table'
import { ApexTableColumn, ApexTableRef } from 'apex-table/ApexTablePro/index.types'

interface Row {
    kFullName: string;
    pUserCode: string;
    pFullName: string;
    standard: string;
    barCode: string;
    brandName: string;
    factoryName: string;
    goodsNumber: string;
    produceDate: string;
    endDate: string;
    validityDay: string;
    serialNumberList: string;
    cargoName: string;
    kAreaName: string;
    unitId: number;
    price: number;
    preOnShelfQty: number;
    preInStockQty: number;
    unitConvert: string;
    unitConvertRst: string;
    volume: number;
    weight: number;
    isGift: number;
    remark: string;
    assQty: number;
}


const App: React.FC = () => {
    
    const apexTableRef = useRef<ApexTableRef<Row>>(null);
    
    /**
     * 数据源
     */
    const [dataSource, setDataSource] = useState<Row[]>(mockDataJson.slice(0, 100));
    
    /**
     * 表格列
     */
    const [columns, setColumns] = useState<ApexTableColumn<Row>[]>([
        {
            title: '仓库',
            name: 'kFullName',
        },
        {
            title: '商品编号',
            name: 'pUserCode',
        },
        {
            title: '商品名称',
            name: 'pFullName',
        },
        {
            title: '规格',
            name: 'standard',
        },
        {
            title: '条码',
            name: 'barCode',
        },
        {
            title: '品牌',
            name: 'brandName',
        },
        {
            title: '生产厂家',
            name: 'factoryName',
        },
        {
            title: '批次',
            name: 'goodsNumber',
        },
        {
            title: '生产日期',
            name: 'produceDate',
            columnType: 'datePicker',
        },
        {
            title: '保质期',
            name: 'validityDay',
            columnType: 'inputNumber',
        },
        {
            title: '到期日期',
            name: 'endDate',
            columnType: 'datePicker',
        },
        {
            title: '序列号',
            name: 'serialNumberList',
        },
        {
            title: '货位',
            name: 'cargoName',
        },
        {
            title: '库区',
            name: 'kAreaName',
        },
        {
            title: '单位',
            name: 'unitId',
        },
        {
            title: '单价',
            name: 'price',
        },
        {
            title: '计划数量',
            name: 'assQty',
        },
        {
            title: '已入数量',
            name: 'preOnShelfQty',
        },
        {
            title: '未入数量',
            name: 'preInStockQty',
        },
        {
            title: '换算关系',
            name: 'unitConvert',
        },
        {
            title: '换算结果',
            name: 'unitConvertRst',
        },
        {
            title: '体积（M³）',
            name: 'volume',
        },
        {
            title: '重量（Kg）',
            name: 'weight',
        },
        {
            title: '是否赠品',
            name: 'isGift',
        },
        {
            title: '明细备注',
            name: 'remark',
        },
    ]);
    
    return <ApexTablePro
        allowSelect
        showHeaderCheckBox
        columns={columns}
        ref={apexTableRef}
        rowHeight={50}
        rowKey="detailId"
        dataSource={dataSource}
    />
};

export default App;
