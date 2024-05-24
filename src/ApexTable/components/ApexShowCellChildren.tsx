import React from "react";
import { IApexTableColumns } from "..";
import dayjs from "dayjs";

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
            let selectOption: { value: number, label: string }[] = [];
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
                {dayjs(value).format("YYYY-MM-DD")}
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