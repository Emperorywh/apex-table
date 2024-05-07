import { Button, Checkbox, CheckboxProps, Popover, Tooltip } from "antd";
import React, { useEffect } from "react";
import { SettingOutlined } from '@ant-design/icons';
import { IApexTableColumns } from "..";

interface IProps<T> {
    /**
     * 表格的列配置
     */
    columns: IApexTableColumns<T>[];
}

/**
 * 列设置
 * @returns 
 */
const ColumnSetting: React.FC<IProps<any>> = (props) => {

    return <Popover content={<ColumnSetContent {...props} />} title={<ColumnSetTitle />} trigger="click">
        <Tooltip title="列设置">
            <SettingOutlined />
        </Tooltip>
    </Popover>
}

export default ColumnSetting;

/**
 * 头部
 * @returns 
 */
const ColumnSetTitle: React.FC<any> = () => {
    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
    };
    return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Checkbox onChange={onChange}>列展示</Checkbox>
        <Button type="link">重置</Button>
    </div>
}

/**
 * 列配置表体
 * @returns 
 */
const ColumnSetContent: React.FC<IProps<any>> = (props) => {
    const { columns } = props;
    const [dataSource, setDataSource] = React.useState<any[]>([]);

    const initCoulums = () => {
        const tempColumns = columns.map((item, index) => {
            if (!item.hasOwnProperty('visible')) {
                item.visible = true;
            }
            return item;
        });
        setDataSource(tempColumns);
    }

    useEffect(() => {
        initCoulums();
    }, [columns]);

    return <div>

    </div>
}



