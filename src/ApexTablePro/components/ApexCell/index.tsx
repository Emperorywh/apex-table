import React from 'react'
import { IProps } from "./index.types";

function ApexCell<T>(props: IProps<T>) {
    
    const { row, column } = props;
    
    const value = row?.[column?.name] || '';
    
    return <div className="apex-show-cell">
        <div className="overflow-hidden-one">
            {value}
        </div>
    </div>
}

export default ApexCell;