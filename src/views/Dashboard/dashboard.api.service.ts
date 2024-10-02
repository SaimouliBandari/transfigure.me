import axios from "axios";

export default function transformFile(data:string| {base64: string}){
    data = {
        base64: data as string
    };
    return axios.post(`${process.env.MGST_TRANSFIGURE_SERVICE}upload`, data )
}