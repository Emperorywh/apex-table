import { PaginationProps } from "antd";

export interface IProps {
    currentPage: number;
    pageSize: number;
    total: number;
    showPagination: boolean;
    pagination: PaginationProps;
    onChange: (page: number, pageSize: number) => void
}