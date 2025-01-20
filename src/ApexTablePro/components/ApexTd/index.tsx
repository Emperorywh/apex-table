import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { IProps } from "./index.types";
import ApexInput from '../ApexInput'
import { ApexTableExtendProps, ApexTableProps } from '../../index.types'
import ApexContext from '../../utils/ApexContext'

function ApexTd<T>(props: IProps<T>, ref: React.Ref<HTMLTableDataCellElement>) {
    console.log("渲染");
    
    const { row, column } = props;
    
    const {
        rowHeight,
        onChangeFocusAxis
    } = useContext<ApexTableProps<T>  & ApexTableExtendProps<T>>(ApexContext);
    
    const [classNames, setClassNames] = useState('');
    
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-tbody-td';
        setClassNames(className);
    }
    
    /**
     * 点击单元格
     */
    const handleClick = () => {
        onChangeFocusAxis?.({
            x: row.apexTableRowIndex,
            y: column.name
        });
    }
    
    useEffect(() => {
        initClassNames();
    }, [])
    
    return <td
        className={classNames}
        ref={ref}
        id={`td-${row.apexTableRowIndex}-${column.name}`}
        style={{
            height: rowHeight,
        }}
        tabIndex={-1}
        onClick={handleClick}
    >
        <ApexInput row={row} column={column}/>
    </td>
}

const ForwardedApexTd = forwardRef(ApexTd) as <T>(props: IProps<T> & { ref?: React.Ref<HTMLTableDataCellElement> }) => JSX.Element;

export default ForwardedApexTd;