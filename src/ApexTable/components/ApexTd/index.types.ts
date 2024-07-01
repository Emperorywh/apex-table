import { ITdThCommonProps } from "../index.types";

export interface IProps<T> extends ITdThCommonProps<T> {
    children: React.ReactNode;
}
