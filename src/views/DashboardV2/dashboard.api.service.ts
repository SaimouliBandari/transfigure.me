import axios from "axios";

export default function transformFile(format: string,data: string | { base64: string }) {
    return axios.post(`${import.meta.env.MGST_TRANSFIGURE_SERVICE}excel/convert-to-${format}`, { data }, {
        headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        }
    })
}