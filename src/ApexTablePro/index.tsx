import React, { forwardRef, useImperativeHandle } from 'react'
import { ApexTableProps, ApexTableRef } from 'apex-table/ApexTablePro/index.types'

/**
 * 表格组件
 * @constructor
 */
const ApexTablePro = forwardRef(<T, >(props: ApexTableProps<T>, ref?: React.ForwardedRef<ApexTableRef<T>>) => {
    
    const {
        columns
    } = props;
    
    useImperativeHandle(ref, () => ({
        getColumns: () => columns
    }))
    
    return <h1>ApexTablePro</h1>
})

export default ApexTablePro;