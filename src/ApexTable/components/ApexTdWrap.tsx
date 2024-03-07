import React from "react";


export interface IApexTdWrap {
    children?: React.ReactNode
}

/**
 * 包装td
 * @param props 
 * @returns 
 */
const ApexTdWrap: React.FC<IApexTdWrap> = (props) => {
    return <td className='apex-table-tbody-td'>
        {props.children}
    </td>
};

export default ApexTdWrap;