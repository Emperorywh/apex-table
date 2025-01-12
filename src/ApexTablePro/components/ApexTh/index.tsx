import React, { useContext, useEffect, useRef, useState } from 'react'
import ApexContext from '../../utils/ApexContext';
import { IProps } from "./index.types";
import { ApexTableProps } from '../../index.types'

function ApexTh<T>(props: IProps<T>){
    
    const { column } = props;
    
    const {
        columns
    } = useContext<ApexTableProps<T>>(ApexContext);
    
    const thRef = useRef<HTMLTableHeaderCellElement>(null);
    const [classNames, setClassNames] = useState('');
    
    /**
     * 初始化类名
     */
    const initClassNames = () => {
        let className = 'apex-table-thead-th';
        setClassNames(className);
    }
    
    useEffect(() => {
        initClassNames();
    }, [columns])
    
    return <th
        className={classNames}
        ref={thRef}
    >
        <div className={`apex-table-thead-th-content`}>
            <span className={`apex-table-thead-th-text overflow-hidden-one`}>
                {column?.title}
            </span>
        </div>
    </th>
}

export default ApexTh;