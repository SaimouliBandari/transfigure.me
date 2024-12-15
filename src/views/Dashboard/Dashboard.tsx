import classNames from "classnames";
import { useUpload } from "hooks/files/useUpload";
import { useState } from "react";
import { toast } from "sonner";
import transformFile from "./dashboard.api.service";
import "./dashboard.scss";
import excelImg from "/src/assets/web/upload-cloud.svg";

type IOutFormat = "json" | "xls" | "csv" | "html";
type IColOptions = "simple" | "advance";

function Dashboard() {
  const [outputFormat, setOutputFormat] = useState<IOutFormat>("json");
  const [files, setFile] = useUpload();
  const [data, setData] = useState(null);

  console.log(files);

  const transform = () => {
    if (files) {
      const promiseHolder = Promise.all([
        transformFile(outputFormat, files[0].data).then((d) => d.data),
        new Promise((res) =>
          setTimeout(() => {
            res(true);
          }, 1000)
        ),
      ]);

      toast.promise(promiseHolder, {
        loading: "Converting...",
        success: "Successfully converted.",
        error: "Error while converting.",
      });

      promiseHolder.then((v) => {
        setData(v[0]);
        console.log(v[0]);
      });
    }
  };

  const onDownload = () => {
    const formTypeMapping: Record<IOutFormat, string> = {
      json: "application/json",
      csv: "text/csv",
      html: "text/html",
      xls: "text/csv",
    };

    const dataTransformationMapping = {
      json: () => JSON.stringify(data, null, 2),
      csv: () => data as unknown as string,
      html: () => data as unknown as string,
      xls: () => data as unknown as string,
    };

    const fileName = new Date().getTime() + "." + outputFormat;
    const dataString = dataTransformationMapping[outputFormat]();
    const blob = new Blob([dataString], {
      type: formTypeMapping[outputFormat],
    });

    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  return (
    <div className="h-full w-full">
      <nav className="w-full bg-secondary-2 h-[64px] border-b-1 shadow-sm mb-12"></nav>

      <div className="w-[80%] min-h-[400px] max-w-[1300px] shadow-md bg-secondary-2 rounded-lg mx-auto p-12 relative">
        <div className="flex flex-col justify-center">
          <div className="upload w-full border-border-g3 border-dashed rounded-md h-[80px] border-[1px] mx-auto relative flex items-center">
            <img src={excelImg} className="h-[60%] ms-6" />
            <div className="mx-auto flex justify-center items-center flex-col">
              {!files && (
                <>
                  <div>Select File</div>
                  <div>xlsx, xls, File size no more than 10MB</div>
                </>
              )}
              {files && <>{files.map((f) => f.name)}</>}
            </div>
            <input
              accept="*"
              id="icon-button-file"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e)}
            />
            <label
              htmlFor="icon-button-file"
              className="select flex justify-center items-center w-[120px] h-[40px] rounded-lg text-text-g2 me-6 border-solid-1 border-[1px]"
            >
              Select
            </label>
          </div>

          <div className="my-3">Select Output Format</div>
          <div className="format">
            <span
              className={classNames(
                { active: outputFormat == "json" },
                "toggle"
              )}
              onClick={() => setOutputFormat("json")}
            >
              <text className="ml-3">JSON</text>
            </span>
            <span
              className={classNames(
                { active: outputFormat == "xls" },
                "toggle"
              )}
              onClick={() => setOutputFormat("xls")}
            >
              <text className="ml-3">EXCEL</text>
            </span>
            <span
              className={classNames(
                { active: outputFormat == "csv" },
                "toggle"
              )}
              onClick={() => setOutputFormat("csv")}
            >
              <text className="ml-3">CSV</text>
            </span>
            <span
              className={classNames(
                { active: outputFormat == "html" },
                "toggle"
              )}
              onClick={() => setOutputFormat("html")}
            >
              <text className="ml-3">HTML</text>
            </span>
          </div>

          {/* <div className="my-3">Column Customization</div> */}

          <div className="table-container rounded-md">
            <div className="options">
              <input
                className="my-3 p-1 w-[46%] bg-secondary-1 rounded-md border-[1px]"
                type="text"
                name="search"
                id="search"
              />
              <span>
                <button
                  className=" w-[120px] bg-[var(--blue-track)] text-white p-1 rounded-md me-2"
                  type="button"
                >
                  + Columns
                </button>
                <button
                  className=" w-[120px] bg-secondary-1 p-1 rounded-md border-[1px]"
                  type="button"
                >
                  Filter
                </button>
              </span>
            </div>
            <table className="column-customization table-auto w-[100%] ">
              <thead>
                <tr className="bg-secondary-1 ">
                  <td>Column Name</td>
                  <td>Modified name</td>
                  <td>Data Type</td>
                  <td>Custom Value</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>username</td>
                  <td>String</td>
                  <td>Mouli.</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>address</td>
                  <td>String</td>
                  <td>vskp</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Number</td>
                  <td>---</td>
                  <td>Number</td>
                  <td>89223423232</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pagination">
              <div>Showing 1-5 of 50</div>
              <div></div>
            </div>
          </div>
        </div>
        <div className="flex justify-end absolute left-0 right-0 bottom-0">
          <div className="button-container">
            <button
              type="button"
              className="ring"
              onClick={transform}
              disabled={!files}
            >
              <div>Convert</div>
            </button>
            <button
              type="button"
              className="default"
              disabled={data == null}
              onClick={onDownload}
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
