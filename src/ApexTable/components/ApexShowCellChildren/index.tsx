import React from "react";
import dayjs from "dayjs";
import { IApexTableColumns } from "apex-table/ApexTable/index.types";
import { DefaultOptionType } from "antd/es/select";

interface IProps<T> {
    columnItem: IApexTableColumns<T>;
    dataSourceItem: any;
}

const ApexShowCellChildren: React.FC<IProps<any>> = (props) => {
    const { columnItem, dataSourceItem } = props;
    const value = dataSourceItem[columnItem.name];
    switch (columnItem.columnType) {
        case 'input':
            return <>
                {value}
            </>
        case 'inputNumber':
            return <>
                {value}
            </>
        case 'select':
            const { options } = columnItem;
            let selectOption: DefaultOptionType[] = [];
            if (typeof options === 'object') {
                selectOption = options;
            } else if (typeof options === 'function') {
                selectOption = options(value, dataSourceItem)
            }
            const opt = selectOption.find(item => item.value === value);
            if (opt) {
                return opt.label;
            }
            return value;
        case 'modal':
            return <>
                {value}
            </>
        case 'datePicker':
            return <>
                {value ? dayjs(value).format("YYYY-MM-DD") : value}
            </>
        case 'rangePicker':
            return <>
                <span style={{ marginRight: 5 }}>{value?.[0]}</span>/
                <span style={{ marginLeft: 5 }}>{value?.[1]}</span>
            </>
        default:
            return <>
                {value}
            </>
    }
}

export default ApexShowCellChildren;