import React, { useRef, useState } from "react";
import { ApexTable } from 'apex-table';
import { ApexTableRef, IApexTableColumns } from "../index.types";
import { Button, Space } from 'antd'

const App: React.FC = () => {
    const apexTableRef = useRef<ApexTableRef>();
    
    /**
     * 表格列
     */
    const [columns, setColumns] = useState<IApexTableColumns<any>[]>([
        {
            title: '操作',
            name: 'action',
            columnType: 'customer',
            onFormatter: (row) => {
                return <Space>
                    <Button type="link" onClick={() => {
                    
                    }}>修改</Button>
                </Space>
            }
        },
        {
            title: '单据日期',
            name: 'billDate',
            columnType: 'datePicker'
        },
        {
            title: '计划单编号',
            name: 'billCode',
        },
        {
            title: '原单据编号',
            name: 'sourceBillCode',
        },
        {
            title: '往来单位',
            name: 'bFullName',
        },
        {
            title: '单据状态',
            name: 'statusName',
        },
        {
            title: '上架状态',
            name: 'shelfStatusName',
        },
        {
            title: '入库类型',
            name: 'inOutTypeName',
        },
        {
            title: '单据来源',
            name: 'fromBillTypeName',
        },
        {
            title: '仓库',
            name: 'kFullName',
        },
        {
            title: '货主',
            name: 'oFullName',
        },
        {
            title: '经手人',
            name: 'eFullName',
        },
        {
            title: '计划数量',
            name: 'sumAssQty',
            showSummary: true
        },
        {
            title: '已入库数量',
            name: 'sumAssInstockQty',
            showSummary: true
        },
        {
            title: '未入库数量',
            name: 'sumAssPreInstockQty',
            showSummary: true
        },
        {
            title: '已上架数量',
            name: 'sumAssOnShelfQty',
            showSummary: true
        },
        {
            title: '未上架数量',
            name: 'sumAssPreOnShelfQty',
            showSummary: true
        },
        {
            title: '单据金额',
            name: 'total',
            showSummary: true
        },
        {
            title: '折扣金额',
            name: 'disTotal',
            showSummary: true
        },
        {
            title: '含税金额',
            name: 'taxedTotal',
            showSummary: true
        },
        {
            title: '总体积(M³)',
            name: 'sumVolume',
            showSummary: true
        },
        {
            title: '总重量(Kg)',
            name: 'sumWeight',
            showSummary: true
        },
        {
            title: '承运单位',
            name: 'deliveryName',
        },
        {
            title: '联系方式',
            name: 'tel',
        },
        {
            title: '预计到货日期',
            name: 'preInDate',
        },
        
        {
            title: '制单时间',
            name: 'createTime',
        },
        {
            title: '备注',
            name: 'remark',
        },
        {
            title: '平台名称',
            name: 'sourceShopName',
        },
        {
            title: '制单人',
            name: 'createrName',
        },
        {
            title: '回传状态',
            name: 'syncStatusName',
        },
        {
            title: '回传单号',
            name: 'syncBillNo',
        },
        {
            title: '单据打印次数',
            name: 'printCount',
            showSummary: true
        },
        {
            title: '打印时间',
            name: 'lastPrintTime',
        }
    ]);
    
    
    return <ApexTable
        request={async (params) => {
            const response = await fetch("/apis/instock/BuyOrderPlan/getPage", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Client-Info': 'pc-h5',
                    'Token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJDb21wYW55TmFtZSI6Iua1i-ivleWFrOWPuCIsIkNvbXBhbnlDb2RlIjoiVGVzdCIsIkNvbXBhbnlJZCI6MiwiREJJZCI6MSwiVXNlcklkIjoyLCJXbXNVc2VySWQiOjcsIlVzZXJOYW1lIjoiYWRtaW4iLCJTZXJ2ZXJHcm91cElkIjoxLCJMb2dpblRpbWUiOjYzODcwMDIzMzM3ODAxMzcyNiwiRUlkIjoyNSwiUm9JZHMiOlsxXSwiT3duZXJJZCI6MCwiSXNPd25lciI6ZmFsc2UsIkxzdEtpZCI6W10sIkxzdEVpZCI6WzAsMjUsMjUsOTIsOTMsOTQsOTUsOTYsOTcsOTgsOTksMTAwXSwiRGVmYXVsdEtpZCI6bnVsbCwiSXNBcHAiOmZhbHNlLCJDbGllbnRJbmZvIjpudWxsLCJDb21wYW55Q2ZnIjpudWxsLCJDaGF0SWQiOiJjdWMwYTJhOTdkZTJhYTRjNGY5MGEzZTU4OGRjZGIwNWRiIiwiTWNoaWQiOiJrdGYxZTJhMGQ0OTRlMzQzZGViYTNiNDY2NDVhNDVkMWY2IiwiSXNFbmFibGVPd25lciI6dHJ1ZSwiT3duZXJDb3VudCI6MH0.w-VbqjwndGbB7wB_LSwyW9WKb-NJ1HSrKGVbTWGtZNk',
                },
                body: JSON.stringify({
                    pageSize: params?.pageSize || 10,
                    pageIndex: params?.currentPage || 1,
                })
            }).then(res => res.json()).catch(error => console.error('Fetch Error:', error));
            const { data } = response;
            return {
                data: data?.pageData || [],
                success: true,
                total: data?.count || 0
            };
        }}
        ref={apexTableRef}
        columns={columns}
        rowKey='billIndexId'
        rowHeight={40}
        height={745}
        showPagination
        pagination={{
            showSizeChanger: true
        }}
        allowResize
        showSummary
        showLineNumber
        readOnly
        allowSelect
        showHeaderCheckBox
    />
}

export default App;