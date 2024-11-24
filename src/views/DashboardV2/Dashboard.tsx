
import excelImg from '/src/assets/web/upload-cloud.svg';
import './dashboardv2.scss'
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Pagination } from '@mui/material';
import CustomModal from 'components/Modal/Modal';
import { useUpload } from 'hooks/files/useUpload';
import transformFile from './dashboard.api.service';
import {toast}  from 'sonner';

type IOutFormat = 'json' | 'xls' | 'csv' | 'html';
type IColOptions = 'simple' | 'advance';



function Dashboard() {

  const [outputFormat, setOutputFormat] = useState<IOutFormat>('json');
  const [files, setFile] = useUpload();

  console.log(files);

  // useEffect(() => {
  //   if (files) {
  //     transformFile(outputFormat, files[0].data)
  //   }
  // }, [files?.[0]?.data])

  const transform = () => {
    if(files){
      const promiseHolder = Promise.all([
        transformFile(outputFormat, files[0].data),
        new Promise(res => setTimeout(() => {
          res(true);
        }, 1000))
      ])

      toast.promise(promiseHolder, {
        'loading': 'Converting...',
        'success': 'Successfully converted.',
        'error': 'Error while converting.'
      })
    }
  }


  return (
    <div className="h-full w-full">
      <nav className="w-full bg-secondary-2 h-[64px] border-b-1 shadow-sm mb-12">
      </nav>

      <div className="w-[80%] min-h-[400px] max-w-[1300px] shadow-md bg-secondary-2 rounded-lg mx-auto p-12 relative">
        <div className='flex flex-col justify-center'>
          <div className="upload w-full border-border-g3 border-dashed rounded-md h-[80px] border-[1px] mx-auto relative flex items-center">
            <img src={excelImg} className="h-[60%] ms-6" />
            <div className="mx-auto flex justify-center items-center flex-col">
              <div>
                Select File or Drag and Drop
              </div>
              <div>
                xlsx, xls, File size no more than 10MB
              </div>
            </div>
            <input
              accept="*"
              id="icon-button-file"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e)}
            />
            {/* <label htmlFor="icon-button-file"> */}

            <label htmlFor="icon-button-file" className='select flex justify-center items-center w-[120px] h-[40px] rounded-lg text-text-g2 me-6 border-solid-1 border-[1px]'>
              Select
            </label>
            {/* </label> */}
          </div>

          <div className='my-3'>
            Select Output Format
          </div>
          <div className='format'>
            <span className={classNames({ 'active': outputFormat == 'json' })} onClick={() => setOutputFormat('json')}>
              <text className="ml-3">
                JSON
              </text>

            </span >
            <span className={classNames({ 'active': outputFormat == 'xls' })} onClick={() => setOutputFormat('xls')}>
              <text className="ml-3">
                EXCEL
              </text>
            </span>
            <span className={classNames({ 'active': outputFormat == 'csv' })} onClick={() => setOutputFormat('csv')}>
              <text className="ml-3">
                CSV
              </text>
            </span>
            <span className={classNames({ 'active': outputFormat == 'html' })} onClick={() => setOutputFormat('html')}>
              <text className="ml-3">
                HTML
              </text>
            </span>
          </div>

          {/* <div className="my-3">
            Column Customization
          </div> */}

          {/* <div className="table-container rounded-md">
            <div className='options'>
              <input className='my-3 p-1 w-[46%] bg-slate-100 rounded-md border-[1px]' type="text" name="search" id="search" />
              <span>
                <button className=' w-[120px] bg-[var(--blue-track)] text-white p-1 rounded-md me-2' type="button">+ Columns</button>
                <button className=' w-[120px] bg-white p-1 rounded-md border-[1px]' type="button">Filter</button>
              </span>
            </div>
            <table className="column-customization table-auto w-[100%]">
              <thead>
                <tr>
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
                    <button onClick={() => setOpen(!open)}>Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>address</td>
                  <td>String</td>
                  <td>vskp</td>
                  <td>
                    <button onClick={() => setOpen(!open)}>Edit</button>

                  </td>
                </tr>
                <tr>
                  <td>Number</td>
                  <td>---</td>
                  <td>Number</td>
                  <td>89223423232</td>
                  <td>
                    <button onClick={() => setOpen(!open)}>Edit</button>

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
          </div> */}


        </div>
        <div className='flex justify-end absolute my-6 mx-12 left-0 right-0'>
          {/* <div className='btn-backdrop'> */}
            <button type="button" className='convert' onClick={transform}>
              Convert
            </button>
          {/* </div> */}
        </div>
      </div>
      {/* <CustomModal open={open} setOpen={setOpen} /> */}
    </div>

  )
}

export default Dashboard
