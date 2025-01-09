import { createContext } from 'react'
import { ApexTableProps } from 'apex-table/ApexTablePro/index.types'

const ApexContext = createContext<ApexTableProps<any>>(null);

export default ApexContext;