import React, { useRef, useState } from 'react';
import { ApexTable } from 'apex-table';
import { ApexTableRef, IApexTableColumns } from '../index.types';
import mockDataJson from './mockData';
import { Button, Space } from 'antd'


const App: React.FC = () => {
    
    const apexTableRef = useRef<ApexTableRef>(null);
    
    /**
     * 数据源
     */
    const [dataSource, setDataSource] = useState<any[]>(mockDataJson.slice(0, 100));
    
    /**
     * 表格列
     */
    const [columns, setColumns] = useState<IApexTableColumns<any>[]>([
        {
            title: '弹窗列',
            name: 'kFullName',
            columnType: 'modal',
            modalOptions: (row, value, modalRef) => {
                return {
                    title: '仓库信息',
                    width: '50vw',
                    content: <div>
                        <h1>仓库列表</h1>
                        <div>{value}</div>
                        <Space>
                            <Button onClick={() => {
                                modalRef.current?.destroy();
                            }}>取消</Button>
                            <Button type='primary' onClick={() => {
                                modalRef.current?.destroy();
                            }}>确定</Button>
                        </Space>
                    </div>
                }
            }
        },
        {
            title: '文本输入框列 （默认）',
            name: 'pUserCode',
            columnType: 'input'
        },
        {
            title: '日期列',
            name: 'produceDate',
            columnType: 'datePicker',
        },
        {
            title: '数字输入框列',
            name: 'validityDay',
            columnType: 'inputNumber',
        },
        {
            title: '下拉框列',
            name: 'unitId',
            columnType: 'select',
            options: (value, row) => {
                const array: any[] = [];
                if (Array.isArray(row.units)) {
                    row.units.forEach((item: any) => {
                        array.push({
                            value: item.unitId,
                            label: item.unitName
                        })
                    })
                }
                return array;
            }
        }
    ]);
    
    return <ApexTable
        ref={apexTableRef}
        columns={columns}
        dataSource={dataSource}
        rowKey='detailId'
        rowHeight={40}
        height={500}
    />
};

export default App;
