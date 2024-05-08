import React, { useEffect, useRef, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { ApexTableRef, IApexTableColumns } from 'apex-table/ApexTable';
import { Button, Space } from 'antd';
interface IProduct {
    productNumber: string;
    productName: string;
    inStock: number;
    unitName: string;
    sellPrice: number;
}
const App: React.FC = () => {

    const apexTableRef = useRef<ApexTableRef>(null);

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
            ref={apexTableRef}
            columns={columns}
            dataSource={dataSource}
        />
        <Space style={{ marginTop: 10 }}>
            <Button onClick={() => {
                const cloneColumns = structuredClone(columns);
                cloneColumns[1].visible = false;
                apexTableRef.current?.setColumns(cloneColumns);
            }}>隐藏</Button>
            <Button onClick={() => {
                apexTableRef.current?.resetColumns();
            }}>重置</Button>
            <Button onClick={() => {
                console.log("获取数据源:", apexTableRef.current?.getDataSource())
            }}>获取数据源</Button>
            <Button onClick={() => {
                const news = apexTableRef.current?.pushRows([
                    {
                        "productNumber": "productNumber-" + Date.now(),
                        "productName": "商品名称" + Date.now(),
                        "inStock": 0,
                        "unitName": "斤",
                        "sellPrice": 0,
                        "apexTableId": 0,
                    },
                    {
                        "productNumber": "productNumber-" + Date.now(),
                        "productName": "商品名称-" + Date.now(),
                        "inStock": 0,
                        "unitName": "斤",
                        "sellPrice": 0,
                        "apexTableId": 0,
                    }
                ])
                console.log("获取数据源:", news)
            }}>新增数据</Button>

            <Button onClick={() => {
                const dataSource = apexTableRef.current?.getDataSource();
                apexTableRef.current?.insertRows(dataSource?.[0].apexRowId, [
                    {
                        "productNumber": "productNumber-" + Date.now(),
                        "productName": "商品名称" + Date.now(),
                        "inStock": 0,
                        "unitName": "斤",
                        "sellPrice": 0,
                        "apexTableId": 0,
                    },
                    {
                        "productNumber": "productNumber-" + Date.now(),
                        "productName": "商品名称-" + Date.now(),
                        "inStock": 0,
                        "unitName": "斤",
                        "sellPrice": 0,
                        "apexTableId": 0,
                    }
                ])
                requestAnimationFrame(() => {
                    console.log("获取数据源:", apexTableRef.current?.getDataSource());
                })
            }}>插入数据</Button>
            <Button onClick={() => {
                const dataSource = apexTableRef.current?.getDataSource();
                apexTableRef.current?.updateRow(dataSource?.[0].apexRowId, [
                    {
                        "productName": "商品名称" + Date.now(),
                    }
                ])
                requestAnimationFrame(() => {
                    console.log("获取数据源:", apexTableRef.current?.getDataSource());
                })
            }}>更新数据</Button>
        </Space>
    </>
};

export default App;

