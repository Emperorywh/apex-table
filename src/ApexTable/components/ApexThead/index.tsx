import React, { useState } from "react";
import { IProps } from './index.types';
import { Checkbox, Modal } from "antd";
import ApexTh from "../ApexTh";
import { SettingOutlined } from '@ant-design/icons'
import ApexColumnConfig from 'apex-table/ApexTable/components/ApexColumnConfig'

function ApexThead<T>(props: IProps<T>) {
    const {
        columns,
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
        onColWidthChange
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
        title="列配置"
        centered
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
    >
        <ApexColumnConfig
            columns={columns}
            onCancel={() => setIsModalOpen(false)}
            onOk={(columns) => {
                console.log("columns", JSON.parse(JSON.stringify(columns)))
                setIsModalOpen(false);
            }}
        />
    </Modal>
    </thead>
}

export default ApexThead;