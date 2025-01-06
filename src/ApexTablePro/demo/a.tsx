import React, { useRef, useState } from 'react';
import mockDataJson from './mockData';
import { ApexTablePro } from 'apex-table'
import { ApexTableColumns, ApexTableRef } from 'apex-table/ApexTablePro/index.types'

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
    const [columns, setColumns] = useState<ApexTableColumns<Row>[]>([]);
    
    return <ApexTablePro<Row>
        columns={columns}
        ref={apexTableRef}
    />
};

export default App;
