import { Button, Checkbox, CheckboxProps, Popover, Tooltip } from "antd";
import React from "react";
import { SettingOutlined } from '@ant-design/icons';

/**
 * 列设置
 * @returns 
 */
const ColumnSetting: React.FC<any> = () => {
    return <Popover content={<ColumnSetContent />} title={<ColumnSetTitle />} trigger="click">
        <Tooltip title="列设置">
            <SettingOutlined />
        </Tooltip>
    </Popover>
}

export default ColumnSetting;


const ColumnSetTitle: React.FC<any> = () => {
    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Checkbox onChange={onChange}>列展示</Checkbox>
        <Button type="link">重置</Button>
    </div>
}

const ColumnSetContent: React.FC<any> = () => {
    return <div>

    </div>
}