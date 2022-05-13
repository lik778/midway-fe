
  
export interface Servicerespone {
    bos:[],
    pending: number,
    sum: string,
    proportion: string,   
}
export interface contact{
    contact:number
}
export interface complaintList{
    page:number,
    size:number
}
export interface updateStatus {
    id:number,
    status:string,
    note:string
}