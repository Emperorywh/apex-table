import React from "react";
import { IPorps } from './index.types';

function ApexColgroup<T>(props: IPorps<T>) {
    const { 
        showLineNumber = false,
        allowSelect = false,
        columns
     } = props;
     
    return <colgroup>
        {
            showLineNumber && <col style={{ width: 50 }}></col>
        }
        {
            allowSelect && <col style={{ width: 50 }}></col>
        }
        {
            columns.map((item, index) => {
                return <col key={`colgroup-${index}`} style={{ width: item.width || 120 }}></col>
            })
        }
    </colgroup>
}

export default ApexColgroup;