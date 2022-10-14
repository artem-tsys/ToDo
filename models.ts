export interface INote{
    name: string,
    phone: number,
    id: string
}

export type IHandleSubmit<T> = (data: T) => void;
