import React, { forwardRef, useEffect, useState } from 'react'
import { IProps } from "./index.types";

function ApexTd<T>(props: IProps<T>, ref: React.Ref<HTMLTableDataCellElement>) {
    
    const { row, column, children } = props;
    
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
        {children}
    </td>
}

const ForwardedApexTd = forwardRef(ApexTd) as <T>(props: IProps<T> & { ref?: React.Ref<HTMLTableDataCellElement> }) => JSX.Element;

export default ForwardedApexTd;