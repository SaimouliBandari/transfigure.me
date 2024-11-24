import { useRef, useState } from "react";

export function useDownload(props:{autoDownload:boolean}) {
  const downloadButtonRef = useRef<any>();
//   const [data, setDate] = 

  function downloadFromBase64(file:string, name:string) {
    const textFile = new Blob([JSON.stringify(file, null, 2)], {
      type: "text/plain",
    }); //pass data from localStorage API to blob
    const url =  URL.createObjectURL(textFile);

    if(props.autoDownload){
        autoDownload(url, name)
        return;
    }

    downloadButtonRef.current.href =
    downloadButtonRef.current.download = name;

  }

  function downloadFromUrl(data: {url:string, name: string}){
    const {url, name} = data;

    if(props.autoDownload){
        autoDownload(url, name);
        return;
    }

    downloadButtonRef.current.href = url;
    downloadButtonRef.current.download = name;
  }

  function autoDownload(url:string, name:string){
    const element = document.createElement("a");
    element.href = url;
    element.download = name;
    document.body.appendChild(element);
    element.click();
  }

  return {
    fromBase64:downloadFromBase64,
    fromUrl: downloadFromUrl,
    buttonRef: downloadButtonRef
  }


}
