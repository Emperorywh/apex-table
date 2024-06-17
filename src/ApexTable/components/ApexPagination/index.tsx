import React from "react";
import { IPorps } from './index.types';
import { Pagination } from "antd";

function ApexPagination(props: IPorps) {
    const {
        pagination,
        showPagination,
        currentPage,
        pageSize,
        total,
        onChange
    } = props;

    return <>
        {
            showPagination && <div className='apex-table-pagination'>
                <Pagination
                    {...pagination}
                    current={currentPage}
                    pageSize={pageSize}
                    total={total}
                    onChange={onChange}
                />
            </div>
        }
    </>
}

export default ApexPagination;