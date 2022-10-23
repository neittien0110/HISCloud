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
    function ViewPDF() {
        console.log(`pages/reports/execute/[id].js/ ViewPDF(${id}`)
        return reportService.getPDFByCode(id)
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
                <div className="card-body">
                    <button disabled={false} className="btn btn-success" onClick={ViewPDF}>
                        Xem
                    </button>    
                </div>
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
