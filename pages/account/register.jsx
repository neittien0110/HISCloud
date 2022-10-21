import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { Link } from 'components';
import { Layout } from 'components/account';
import { userService, alertService } from 'services';

export default Register;

/**
 * Component đăng kí tài khoản mới
 * @returns 
 */
function Register() {
    const router = useRouter();

    /** định nghĩa các ràng buộc dữ liệu  */
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('Bắt buộc phải có'),
        lastName: Yup.string()
            .required('Bắt buộc phải có'),
        username: Yup.string()
            .required('Bắt buộc phải có'),
        password: Yup.string()
            .required('Bắt buộc phải có')
            .min(6, 'Mật khẩu phải gồm ít nhất 6 kí tự.')
    });
    const formOptions = { resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;

    /**
     * Hàm sự kiện khi nút Đăng kí được bấm
     * @param {*} user 
     * @returns 
     */
    function onSubmit(user) {
        return userService.register(user)
            .then(() => {
                alertService.success('Đăng ký tài khoản mới thành công.', { keepAfterRouteChange: true });
                router.push('login');
            })
            .catch(alertService.error);
    }

    return (
        <Layout>
            <div className="card">
                <h4 className="card-header">Đăng ký tài khoản</h4>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Tên</label>
                            <input name="firstName" type="text" {...register('firstName')} className={`form-control ${errors.firstName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.firstName?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Họ đệm</label>
                            <input name="lastName" type="text" {...register('lastName')} className={`form-control ${errors.lastName ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.lastName?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Tài khoản đăng nhập (*)</label>
                            <input name="username" type="text" {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.username?.message}</div>
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu (*)</label>
                            <input name="password" type="password" {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                            <div className="invalid-feedback">{errors.password?.message}</div>
                        </div>
                        <button disabled={formState.isSubmitting} className="btn btn-primary">
                            {formState.isSubmitting && <span className="spinner-border spinner-border-sm mr-1"></span>}
                            Đăng ký
                        </button>
                        <Link href="/account/login" className="btn btn-link">Bỏ qua</Link>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
