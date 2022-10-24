/**
 * Chạy xuất báo cáo, đồng thời hiển thị toàn bộ các file pdf tương ứng đã có
 * @see pasteimages/2022-10-24-11-48-38.png
 */
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/reports';
import { Spinner } from 'components';


import { reportService, alertService } from 'services';


import { useState } from 'react'



//const util = require('util');
//const exec_promiss = util.promisify(require('child_process').exec);

export default Execute;




function Execute({ id }) {

    const router = useRouter();

    /** định nghĩa các ràng buộc dữ liệu  */
    const validationSchema = Yup.object().shape({
        fromDateTime: Yup.string()
            .required('Bắt buộc phải có'),
        toDateTime: Yup.string()
            .required('Bắt buộc phải có'),
    });
    
    const formOptions = { resolver: yupResolver(validationSchema) };
    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    // Trạng thái của nút PDF
    const [PDFStatus, setPDFStatus] = useState(0);

    // Dữ liệu tạm, giả định có danh sách các file pdf ở server
    const pdfs = [{code:{id}, filename:"MRS00272.pdf",fromDateTime:123, toDateTime:456}, {code:{id}, filename:"MRS00272_20221024_010203_20221024_040506.pdf",fromDateTime:123, toDateTime:456}];

    /**
     * Hàm sự kiện khi nút Thực hiện được bấm
     * @param {*} reportParams    (Tên bất kì) Tham số mặc định do hàm gọi handleSubmit luôn ném cho
     * @returns 
     */
    function onSubmit(reportParams) {
        console.log("pages/reports/execute/[id].js/onSubmit("+ reportParams+")")
        console.log("    " + id)
        console.log("    " + JSON.stringify(reportParams))
        setPDFStatus(1)
        return reportService.execute(id, reportParams)
            .then(() => {
                setPDFStatus(2);                
                alertService.success('Xuất báo cáo thành công.', { keepAfterRouteChange: true });
            })
            .catch(alertService.error);
    }

    /**
     * Hàm sự kiện khi nút xem pdf được bấm
     * @returns 
     */
    function ViewPDF(filename) {
        console.log(`pages/reports/execute/[id].js/ ViewPDF(${filename}`)
        return reportService.getPDFByFileName(filename)
            .then(() => {             
                alertService.success('Xem PDF thành công.', { keepAfterRouteChange: true });
            })
            .catch(alertService.error);
    }
    

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Báo cáo {id}</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}> {/** handleSubmit sẽ tự động ném toàn bộ các tham số của form cho hàm onSubmit*/}
                        {/** {...register('fromDateTime')}  là quan trọng, sẽ tạo nên cấu trúc json của trường này và gửi về server */}
                        <div className="form-group">
                            <label>Từ ngày (*)</label>
                            <input name="fromDateTime" type="text" {...register('fromDateTime')} className={`form-control ${errors.fromDateTime ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.fromDateTime?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Tới ngày (*)</label>
                            <input name="toDateTime" type="text" {...register('toDateTime')} className={`form-control ${errors.toDateTime ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.toDateTime?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Mô tả chi tiết</label>
                            <input name="name" type="text"  {...register('name')} className={`form-control`} />
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {/**  Hiện vòng tròn xoay ở nút bấm nếu việc submit chưa hoàn tất */}
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Xuất báo cáo
                        </button>
                        <Link href="/reports/" className="btn btn-link">Bỏ qua</Link>
                    </form>                     
                </div>
            </div>
            <br/>
            <div className="card">
                <h4 className="card-header">Báo cáo đã sẵn sàng</h4>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th style={{ width: '30%' }}>File</th>
                            <th style={{ width: '30%' }}>Từ ngày</th>
                            <th style={{ width: '30%' }}>Tới ngày</th>
                            <th style={{ width: '10%' }}>...</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pdfs && pdfs.map(report =>
                            <tr key={report.filename}>
                                <td>{report.filename}</td>
                                <td>{report.fromDateTime}</td>
                                <td>{report.toDateTime}</td>
                                <td style={{ whiteSpace: 'nowrap' }}>
                                <button disabled={false} className="btn btn-success" onClick={() => {ViewPDF(report.filename)}}>
                                    Xem
                                </button>                                        
                                </td>
                            </tr>
                        )}
                        {!pdfs &&
                            <tr>
                                <td colSpan="3">
                                    <Spinner />
                                </td>
                            </tr>
                        }
                        {pdfs && !pdfs.length &&
                            <tr>
                                <td colSpan="3" className="text-center">
                                    <div className="p-2">Không có báo cáo nào</div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}

/**
 * Hàm tĩnh chỉ chạy một lần
 * @param {*} param0   {id} là mã loại báo báo
 * @returns 
 */
export async function getServerSideProps({ params }) {
    // mã loai báo cáo. ví dụ MRS00272
    let reportCode = params.id
    var stdout
    console.log("reports /execute/[id].jsx / getServerSideProps(" + JSON.stringify(params) + ")") 
    return {
        props: { id: params.id}
    }
}
