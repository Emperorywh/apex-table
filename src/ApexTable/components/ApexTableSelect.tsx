import React from "react";
import { IApexTableColumns } from "..";
import ApexTdWrap from "./ApexTdWrap";
import { Select } from "antd";

export interface ApexTableSelectProps<T> {
    columnItem: IApexTableColumns<T>;
    dataSourceItem: any;
    onSelectChange: (row: any, columnName: any, value: any, option: any, options: any, onChange?: (value: any, option?: any, options?: any) => void) => void;
}

/**
 * 下拉框组件
 * @param props 
 * @returns 
 */
const ApexTableSelect: React.FC<ApexTableSelectProps<any>> = (props) => {
    const { columnItem, dataSourceItem, onSelectChange } = props;
    const { options, defaultValue, onChange } = columnItem;
    let selectOption = [];
    if (typeof options === 'object') {
        selectOption = options;
    } else if (typeof options === 'function') {
        selectOption = options(dataSourceItem[columnItem.name], dataSourceItem)
    }
    return <ApexTdWrap>
        <Select
            defaultValue={defaultValue}
            value={dataSourceItem[columnItem.name]}
            onChange={(value, option) => onSelectChange(dataSourceItem, columnItem.name, value, option, options, onChange)}
            options={selectOption}
            allowClear
        />
    </ApexTdWrap>
}

export default ApexTableSelect;