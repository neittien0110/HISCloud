import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/reports';
import { reportService } from 'services';

export default Index;

/**
 * Danh mục các báo cáo xuất
 * @returns 
 */
function Index() {
    const [reports, setReports] = useState(null);

    useEffect(() => {
        reportService.getAll().then(x => setReports(x));
    }, []);


    return (
        <Layout>
            <h1>Danh sách báo cáo xuất</h1>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>Mã loại báo cáo</th>
                        <th style={{ width: '40%' }}>Tên loại báo cáo</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {reports && reports.map(report =>
                        <tr key={report.code}>
                            <td>{report.code}</td>
                            <td>{report.name}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/reports/execute/${report.code}`} className="btn btn-sm btn-primary mr-1">Tạo và    Xem</Link>
                            </td>
                        </tr>
                    )}
                    {!reports &&
                        <tr>
                            <td colSpan="3">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {reports && !reports.length &&
                        <tr>
                            <td colSpan="3" className="text-center">
                                <div className="p-2">Không có báo cáo nào</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}
