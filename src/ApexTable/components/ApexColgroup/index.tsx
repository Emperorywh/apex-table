import React from "react";
import { IProps } from './index.types';

function ApexColgroup<T>(props: IProps<T>) {
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