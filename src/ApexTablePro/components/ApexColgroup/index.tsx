import React, { useContext } from "react";
import ApexContext from "../../utils/ApexContext";
import { ApexTableProps } from '../../index.types';
function ApexColgroup<T>() {
    
    const {
        allowSelect,
        columns,
        showLineNumber
    } = useContext<ApexTableProps<T>>(ApexContext);
    
    return <colgroup>
        {
            showLineNumber && <col style={{ width: 50 }}/>
        }
        {
            allowSelect && <col style={{ width: 50 }}/>
        }
        {
            columns.map((item, index) => {
                return <col key={`colgroup-${index}`} style={{ width: item.width || 120 }}/>
            })
        }
    </colgroup>
}

export default ApexColgroup;