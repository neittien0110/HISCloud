import { Layout, AddEdit } from 'components/users';

export default Add;

function Add() {
    return (
        <Layout>
            <h1>Thêm tài khoản</h1>
            <AddEdit />
        </Layout>
    );
}