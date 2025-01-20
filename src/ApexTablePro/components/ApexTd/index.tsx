import React, { forwardRef, useContext, useEffect, useState } from 'react'
import { IProps } from "./index.types";
import ApexInput from '../ApexInput'
import { ApexTableExtendProps, ApexTableProps } from '../../index.types'
import ApexContext from '../../utils/ApexContext'

function ApexTd<T>(props: IProps<T>, ref: React.Ref<HTMLTableDataCellElement>) {
    console.log("渲染")
    const { row, column } = props;
    
    const {
        rowHeight,
        focusAxis
    } = useContext<ApexTableProps<T>  & ApexTableExtendProps<T>>(ApexContext);
    
    /**
     * 单元格的Key值
     */
    const cellKey = `${row.apexTableRowIndex}-${column.name}`;
    /**
     * 聚焦的单元格
     */
    const focusKey = `${focusAxis.x}-${focusAxis.y}`;
    
    const [classNames, setClassNames] = useState('');
    
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-tbody-td';
        setClassNames(className);
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
            borderColor: cellKey === focusKey ? '#40a9ff' : 'rgba(5, 5, 5, 0.06)'
        }}
    >
        <ApexInput row={row} column={column}/>
    </td>
}

const ForwardedApexTd = forwardRef(ApexTd) as <T>(props: IProps<T> & { ref?: React.Ref<HTMLTableDataCellElement> }) => JSX.Element;

export default ForwardedApexTd;