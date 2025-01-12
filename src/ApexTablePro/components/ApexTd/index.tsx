import React, { forwardRef, useEffect, useState } from 'react'
import { IProps } from "./index.types";
import ApexCell from 'apex-table/ApexTablePro/components/ApexCell'

function ApexTd<T>(props: IProps<T>, ref: React.Ref<HTMLTableDataCellElement>) {
    
    const { row, column } = props;
    
    const [classNames, setClassNames] = useState('');
    
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-tbody-td';
        setClassNames(className);
    }
    
    useEffect(() =>{
        initClassNames();
    }, [])
    
    return <td
        className={classNames}
        ref={ref}
        id={`td-${row.apexTableRowIndex}-${column.name}`}
    >
        <ApexCell row={row} column={column} />
    </td>
}

const ForwardedApexTd = forwardRef(ApexTd) as <T>(props: IProps<T> & { ref?: React.Ref<HTMLTableDataCellElement> }) => JSX.Element;

export default ForwardedApexTd;