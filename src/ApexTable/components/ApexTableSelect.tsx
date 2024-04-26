import React, { forwardRef } from "react";
import { ApexTableProps, IApexTableColumns } from "..";
import ApexTdWrap from "./ApexTdWrap";
import { Select } from "antd";

export interface ApexTableSelectProps<T> {
    apexTableProps: ApexTableProps<any>;
    columnItem: IApexTableColumns<T>;
    dataSourceItem: any;
    ref?: React.Ref<any>;
    onSelectChange: (row: any, columnName: any, value: any, option: any, options: any, onChange?: (value: any, option?: any, options?: any) => void) => void;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    onBlur?: React.FocusEventHandler<HTMLElement>;
}

/**
 * 下拉框组件
 * @param props 
 * @returns 
 */
const ApexTableSelect: React.FC<ApexTableSelectProps<any>> = forwardRef((props, ref) => {
    const { columnItem, dataSourceItem, onSelectChange, onFocus, onBlur } = props;
    const { options, defaultValue, onChange } = columnItem;
    let selectOption = [];
    if (typeof options === 'object') {
        selectOption = options;
    } else if (typeof options === 'function') {
        selectOption = options(dataSourceItem[columnItem.name], dataSourceItem)
    }
    return <ApexTdWrap apexTableProps={props.apexTableProps} apexColumn={columnItem}>
        <Select
            defaultValue={defaultValue}
            value={dataSourceItem[columnItem.name]}
            onChange={(value, option) => onSelectChange(dataSourceItem, columnItem.name, value, option, options, onChange)}
            options={selectOption}
            allowClear
            ref={ref}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    </ApexTdWrap>
})

export default ApexTableSelect;