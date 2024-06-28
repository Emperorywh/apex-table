import React, { useRef } from "react";
import { ApexTable } from 'apex-table';
import { ApexTableRef } from "../index.types";

const App: React.FC = () => {
    const apexTableRef = useRef<ApexTableRef>(null);

    const columns = [
        {
            title: 'Id',
            name: 'id',
            summaryKind: true,
        },
        {
            title: '姓名',
            name: 'name',
        },
        {
            title: '年龄',
            name: 'age',
            summaryKind: true,
        },
        {
            title: '性别',
            name: 'sex',
        },
        {
            title: '地址',
            name: 'home',
        },
        {
            title: '爱好',
            name: 'hobby',
        },
        {
            title: '入职时间',
            name: 'hiredate',
        },
    ];

    return <ApexTable
        ref={apexTableRef}
        columns={columns}
        request={async (params) => {
            const response = await fetch("http://vango-pro.rwxyun.cn/mock/mockapi/gridpager", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pageSize: params?.pageSize || 10,
                    currentPage: params?.currentPage || 1,
                })
            }).then(res => res.json());
            return {
                data: response?.data?.itemList || [],
                success: response?.success || false,
                total: response?.data?.itemCount || 0
            };
        } }
        showPagination
        readOnly
        rowKey="id"
        showHeaderCheckBox
        allowSelect rowHeight={45}    />
}

export default App;