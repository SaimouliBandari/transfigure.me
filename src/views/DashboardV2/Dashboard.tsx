
import excelImg from '/src/assets/web/upload-cloud.svg';
// import json from '/src/assets/web/i8json.svg'
// import excel from '/src/assets/web/ixls.svg'
// import csv from '/src/assets/web/icsv.svg'
// import html from '/src/assets/web/html-5.svg'
import './dashboardv2.scss'
import { useState } from 'react';
import classNames from 'classnames';

type IOutFormat = 'json' | 'xls' | 'csv' | 'html';
type IColOptions = 'simple' | 'advance';

function Dashboard() {

  const [outputFormat, setOutputFormat] = useState<IOutFormat>('json');
  const [colOptions, setColOptions] = useState<IColOptions>('simple');


  return (
    <div className="h-full w-full">
      <nav className="w-full bg-[#FFFFFF] h-[64px] border-b-1 shadow-sm mb-12">
      </nav>

      <div className="w-[80%] min-h-[400px] shadow-md bg-[#FFFFFF] rounded-lg mx-auto p-12">
        <div className='flex flex-col justify-center'>
          <div className="w-full border-gray-500 border-dashed rounded-md h-[80px] border-[1px] mx-auto relative flex items-center">
            <img src={excelImg} className="h-[60%] ms-6" />
            <div className="mx-auto flex justify-center items-center flex-col">
              <div>
                Select File or Drag and Drop
              </div>
              <div>
                xlsx, xls, File size no more than 10MB
              </div>
            </div>
            <button className='w-[120px] h-[40px] rounded-lg text-primary me-6 border-primary border-[1px]'>
              Select
            </button>
          </div>

          <div className='my-3'>
            Select Output Format
          </div>
          <div className='format'>
            <span className={classNames({ 'active': outputFormat == 'json' })} onClick={() => setOutputFormat('json')}>
              <text className="ml-3">
                JSON
              </text>
              {/* <img src={json} className=' fill-transparent'/> */}

            </span >
            <span className={classNames({ 'active': outputFormat == 'xls' })} onClick={() => setOutputFormat('xls')}>
              <text className="ml-3">
                EXCEL
              </text>
              {/* <img src={excel} /> */}
            </span>
            <span className={classNames({ 'active': outputFormat == 'csv' })} onClick={() => setOutputFormat('csv')}>
              <text className="ml-3">
                CSV
              </text>
              {/* <img src={csv} /> */}
            </span>
            <span className={classNames({ 'active': outputFormat == 'html' })} onClick={() => setOutputFormat('html')}>
              <text className="ml-3">
                HTML
              </text>
              {/* <img src={html} /> */}
            </span>

          </div>

          <div className="my-3">
            Column Customization
          </div>

          {/* <div className="flex my-1 rounded-md border-primary border-2 w-fit shadow-lg">
            <span className={classNames("py-2 px-4", {"bg-primary text-white" : colOptions == "simple"})} onClick={() => setColOptions('simple')}>
              Simple
            </span>
            <span className={classNames("py-2 px-4", {"bg-primary text-white" : colOptions == "advance"})} onClick={() => setColOptions('advance')}>
              Advance
            </span>
          </div> */}

          <div className="table-container rounded-md">
            <div className='options'>
              <input className='my-3 p-1 w-[46%] bg-slate-100 rounded-md border-[1px]' type="text" name="search" id="search" />
              <span>
                <button className=' w-[120px] bg-[var(--blue-track)] text-white p-1 rounded-md me-2' type="button">+ Columns</button>
                <button className=' w-[120px] bg-white p-1 rounded-md border-[1px]' type="button">Filter</button>
              </span>

            </div>
            {/* <div className='w-[100%] flex justify-between items-center'>
              <span>Column Name</span>
              <span>Data Type</span>
              <span>Custom Value</span>
              <span>Action</span>
              <span></span>

            </div> */}

            <table className="column-customization table-auto w-[100%]">
              <thead>
                <tr>
                  <td>Column Name</td>
                  <td>Data Type</td>
                  <td>Custom Value</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
                  <td>Malcolm Lockyer</td>
                  <td>1961</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Witchy Woman</td>
                  <td>The Eagles</td>
                  <td>1972</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Shining Star</td>
                  <td>Earth, Wind, and Fire</td>
                  <td>1975</td>
                  <td>
                    <button>Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='pagination'>
              <div>
                Showing 1-5 of 50
              </div>

              <div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

{/* <a target="_blank" href="https://icons8.com/icon/111774/xls">XLS</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */ }