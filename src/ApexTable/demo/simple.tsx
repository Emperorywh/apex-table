import React, { useEffect, useRef, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { ApexTableRef, IApexTableColumns } from 'apex-table/ApexTable';
import { nanoid } from "nanoid";

const App: React.FC = () => {

    const apexTableRef = useRef<ApexTableRef>(null);

    /**
     * 数据源
     */
    const [dataSource, setDataSource] = useState<any[]>([]);

    /**
     * 表格列
     */
    const [columns, setColumns] = useState<IApexTableColumns<any>[]>([]);

    useEffect(() => {
        const tempColumn: any[] = [];
        const data: any[] = [];
        for (let i = 0; i < 20; i++) {
            tempColumn.push({
                title: '列_' + i,
                name: 'column' + i
            });
        }
        for (let i = 0; i < 100; i++) {
            const row: any = {
                id: nanoid()
            };
            for (let j = 0; j < tempColumn.length; j++) {
                row[`column` + j] = `内容${i}_${j}`
            }
            data.push(row);
        }
        setColumns(tempColumn);
        setDataSource(data);
        setDataSource(data);
    }, []);

    return <>
        <ApexTable
            ref={apexTableRef}
            columns={columns}
            dataSource={dataSource}
            rowKey='id'
            rowHeight={45}
            allowSelect
            showHeaderCheckBox
            isSingle
        />
    </>
};

export default App;
