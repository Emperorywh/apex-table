import ApexContext from "../../utils/ApexContext";
import React from 'react';
import { IProps } from "./index.types";

/**
 * 上下文组件
 * @param props
 * @constructor
 */
function ApexContextProvider<T>(props: IProps<T>) {
    const { children, value } = props;
    return <ApexContext.Provider value={value}>
        {children}
    </ApexContext.Provider>
}

export default ApexContextProvider;
