import React, { useState } from "react";
import { IProps } from './index.types';
import { Button, Checkbox, Modal, Popconfirm } from "antd";
import ApexTh from "../ApexTh";
import { SettingOutlined } from '@ant-design/icons'
import ApexColumnConfig from 'apex-table/ApexTable/components/ApexColumnConfig'

function ApexThead<T>(props: IProps<T>) {
    const {
        columns,
        originColumns,
        showLineNumber = false,
        showColumnConfig = false,
        allowSelect = false,
        allowResize = false,
        allowFixed = false,
        showHeaderCheckBox = false,
        isSingle = false,
        headerChecked = false,
        indeterminate = false,
        rowHeight,
        onHeaderCheckBoxChange,
        onColWidthChange,
        onChangeColumns
    } = props;
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    /**
     *  点击列配置
     */
    const handleColumnConfig = () => {
        setIsModalOpen(true)
    }
    
    return <thead className='apex-table-thead'>
    <tr style={{ height: rowHeight }}>
        {
            showLineNumber ? <th className='apex-table-thead-th apex-table-thead-th-line-number-head'>
                {
                    showColumnConfig ? <SettingOutlined
                        style={{ fontSize: 18, cursor: 'pointer' }}
                        onClick={handleColumnConfig}
                    /> : <div>行号</div>
                }
            
            </th> : null
        }
        {
            allowSelect && <th className='apex-table-thead-th apex-table-thead-th-checkbox'>
                {
                    showHeaderCheckBox &&
                    <Checkbox disabled={isSingle} checked={headerChecked} indeterminate={indeterminate}
                              onChange={onHeaderCheckBoxChange}/>
                }
            </th>
        }
        {
            columns.map((item, index) => {
                if (item?.visible === false) {
                    return null
                } else {
                    return <ApexTh
                        allowSelect={allowSelect}
                        allowFixed={allowFixed}
                        allowResize={allowResize}
                        key={`${String(item.name)}-${index}`}
                        column={item}
                        columns={columns}
                        rowHeight={rowHeight}
                        showLineNumber={showLineNumber}
                        onColWidthChange={onColWidthChange}
                    />
                }
            })
        }
    </tr>
    <Modal
        title={
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 10px'
            }}>
                <div style={{
                    fontSize: 14,
                    color:'rgba(42, 46, 54, 0.88)',
                }}>列配置</div>
                <Popconfirm
                    title="提示"
                    description="确定要恢复到初始设置吗？"
                    onConfirm={() => {
                        onChangeColumns(originColumns);
                        setIsModalOpen(false);
                    }}
                    okText="确定"
                    cancelText="取消"
                    placement="bottom"
                >
                    <Button type="link" style={{
                        fontWeight: '700'
                    }}>重置</Button>
                </Popconfirm>
            </div>
        }
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
    >
        <ApexColumnConfig
            columns={columns}
            onCancel={() => setIsModalOpen(false)}
            onOk={(columns) => {
                onChangeColumns(columns);
                setIsModalOpen(false);
            }}
        />
    </Modal>
    </thead>
}

export default ApexThead;