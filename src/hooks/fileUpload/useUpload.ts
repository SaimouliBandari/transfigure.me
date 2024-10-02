import { useState } from "react";

export interface IFiles {
  name: string;
  size: number;
  lastModified: number;
  data: string;
}

export function useUpload() {
  const [files, setFiles] = useState<IFiles[]>();

  function readFiles(files: FileList | null) {

    console.log("files :>>", files);

    if (!files) {
      console.warn('No File Upload:>>', files); 
      return null;
    }

    const filesArray = Array.from(files);
    const response: Promise<IFiles>[] = filesArray.map((file) => {
      return new Promise<IFiles>((res) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          console.warn("taking time");
          try {
            res({
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              data: (reader.result as string).split("base64,")[1],
            });
          } catch (error) {
            res({
              name: file.name,
              size: file.size,
              lastModified: file.lastModified,
              data: "Error While Reading Files",
            });
          }
        };
      }).then((val) => {
        console.log(val);
        return val;
      });
    });

    console.log("response, ", response);
    Promise.all(response).then((UpFiles) => setFiles(UpFiles));
  }

  return {
    read($event: any) {
        readFiles($event.target.files);
    },
    files
  };
}
