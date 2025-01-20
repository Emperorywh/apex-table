import React from 'react'
import { IProps } from "./index.types";
import { DefaultOptionType } from 'antd/es/select'
import dayjs from 'dayjs'

function ApexCell<T>(props: IProps<T>) {
    
    const { row, column, onClick } = props;
    
    const value = row?.[column?.name] || '';
    
    const { columnType = 'input', options } = column;
    
    /**
     * 点击
     * @param event
     */
    const handleClick: React.MouseEventHandler<HTMLDivElement> = (event) =>  {
        onClick?.(event);
    }
    
    
    
    /**
     * 渲染单元格value
     */
    const renderValue = () => {
        switch (columnType) {
            case 'input':
                return value
            case 'inputNumber':
                return value
            case 'select':
                let selectOption: DefaultOptionType[] = [];
                if (typeof options === 'object') {
                    selectOption = options;
                } else if (typeof options === 'function') {
                    selectOption = options({
                        row,
                        value
                    });
                }
                const opt = selectOption.find(item => item.value === value);
                if (opt) {
                    return opt.label;
                }
                return value;
            case 'modal':
                return value
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
                return value
        }
    }
    
    return <div className="apex-show-cell" onClick={handleClick}>
        <div className="overflow-hidden-one">
            {renderValue()}
        </div>
    </div>
}

export default ApexCell;