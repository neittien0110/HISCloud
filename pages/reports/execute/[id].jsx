import { Layout } from 'components/reports';
import { Spinner } from 'components';

export default Execute;

function Execute({ id }) {
    return (
        <Layout>
            <h1>Xuất báo cáo {id}</h1>
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: "Kết quả " + params.id }
    }
}
