import React, { useEffect, useRef, useState } from 'react';
import { ApexTable } from 'apex-table';
import type { ApexTableRef, IApexTableColumns } from 'apex-table/ApexTable';
import { nanoid } from "nanoid";
import { ApexVirtualList } from '../components';

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
        // const tempColumn: any[] = [];
        // const data: any[] = [];
        // for (let i = 0; i < 20; i++) {
        //     tempColumn.push({
        //         title: '列_' + i,
        //         name: 'column' + i
        //     });
        // }
        // for (let i = 0; i < 100; i++) {
        //     const row: any = {
        //         id: nanoid()
        //     };
        //     for (let j = 0; j < tempColumn.length; j++) {
        //         row[`column` + j] = `内容${i}_${j}`
        //     }
        //     data.push(row);
        // }
        // setColumns(tempColumn);
        // setDataSource(data);
        const data: any[] = [];
        for (let i = 0; i < 1000; i++) {
            data.push({
                id: nanoid(),
                num: i
            })
        }
        setDataSource(data);
    }, []);

    return <>
        {/* <ApexTable
            ref={apexTableRef}
            columns={columns}
            dataSource={dataSource}
            rowKey='id'
            allowSelect
            showHeaderCheckBox
            isSingle
        /> */}
        <ApexVirtualList dataSource={dataSource} rowKey='id'></ApexVirtualList>
    </>
};

export default App;
