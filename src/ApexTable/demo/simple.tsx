import React, { useEffect, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { IApexTableColumns } from 'apex-table/ApexTable';

interface IProduct {
    productNumber: string;
    productName: string;
    inStock: number;
    unitName: string;
    sellPrice: number;
}

const App: React.FC = () => {

    /**
     * 数据源
     */
    const [dataSource, setDataSource] = useState<IProduct[]>([]);

    /**
     * 表格列
     */
    const columns: IApexTableColumns<IProduct>[] = [
        {
            title: '商品编号',
            name: 'productNumber',
        },
        {
            title: '商品名称',
            name: 'productName',
        },
        {
            title: '库存',
            name: 'inStock',
        },
        {
            title: '单位',
            name: 'unitName',
        },
        {
            title: '售价(元/kg)',
            name: 'sellPrice',
        },
    ];

    useEffect(() => {
        const data: IProduct[] = [];
        for (let i = 0; i < 100; i++) {
            const product: IProduct = {
                productNumber: 'productNumber-' + i,
                productName: '商品名称-' + i,
                inStock: i,
                unitName: '斤',
                sellPrice: 2 * i
            }
            data.push(product);
        }
        setDataSource(data);
    }, []);

    return <>
        <ApexTable
            columns={columns}
            dataSource={dataSource}
            showPagination
            pagination={{ pageSize: 100 }}
        />
    </>
};

export default App;

