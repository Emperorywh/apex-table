import React, { useContext } from "react";
import { IProps } from "./index.types";
import ApexContext from '../../utils/ApexContext'
import ApexTr from '../ApexTr';
import { ApexTableExtendProps, ApexTableProps } from '../../index.types';

function ApexTbody<T>(props: IProps) {
    const {
        tableDataSource
    } = useContext<ApexTableProps<T> & ApexTableExtendProps<T>>(ApexContext);
    
    debugger;
    
    return <tbody className='apex-table-tbody'>
    {
        tableDataSource.map((row, rowIndex) => {
            return <ApexTr
                key={`apex-table-tbody-tr-${rowIndex}`}
                row={row}
            />
        })
    }
    </tbody>
}

export default ApexTbody;