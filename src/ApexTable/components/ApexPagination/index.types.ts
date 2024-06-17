import { PaginationProps } from "antd";

export interface IPorps {
    currentPage: number;
    pageSize: number;
    total: number;
    showPagination: boolean;
    pagination: PaginationProps;
    onChange: (page: number, pageSize: number) => void
}