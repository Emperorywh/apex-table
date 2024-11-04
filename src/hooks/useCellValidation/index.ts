import { useEffect, useState } from 'react';
import { message } from 'antd';
import { IuseCellValidationType } from 'apex-table/hooks/useCellValidation/index.types'
import { IApexTableCellInfo } from 'apex-table/ApexTable/index.types'

const useCellValidation = (params: IuseCellValidationType): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
    const { rules, rowInfo, isFocus } = params;
    /**
     * 是否通过单元格校验
     */
    const [isCellValid, setIsCellValid] = useState(true);
    
    /**
     * 单元格校验
     */
    const onValid = (params: IApexTableCellInfo) => {
        if (rules) {
            const { isValid = null, noticeMessage = '' } = rules;
            if (typeof isValid === 'function') {
                const result = isValid(params);
                setIsCellValid(result);
                if (!result && noticeMessage && !isFocus) {
                    message.error(noticeMessage)
                }
            }
        }
    }
    
    useEffect(() => {
        onValid(rowInfo);
    }, [isFocus])
    
    return [isCellValid, setIsCellValid]
};

export default useCellValidation;
