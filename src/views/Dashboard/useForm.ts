import { ChangeEvent, useState } from "react";

export function useForm (formData: any = {}){
    const [data, setData] = useState(formData || {});

    return {
        setValue($event:any){
            console.log($event.target, "event");
            
        }
    }
}