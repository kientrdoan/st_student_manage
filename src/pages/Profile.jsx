"use client";
import { TOKEN } from "../../utils/Config";

const token = localStorage.getItem(TOKEN);
console.log("Access token:", token);

import { useEffect, useState } from "react";
import {
  Form,
  Input,
  Select,
  Card,
  Row,
  Col,
  DatePicker,
  Spin,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getDetailStudentByUserIdAction } from "../redux/actions/ProfileAction";

export default function ProfileDetail() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null); // <== avatar
  const [messageApi, contextHolder] = message.useMessage();

  const user = useSelector((state) => state.UserReducer.user);
  console.log("user", user.user_id);

  useEffect(() => {
    const fetchProfileData = async () => {
      // setLoading(true);
      if (user.user_id) {
        const res = await dispatch(
          getDetailStudentByUserIdAction(user.user_id)
        );

        if (res?.success && res?.data) {
          const profileData = res.data;

          // --- LẤY URL ẢNH AVATAR ---
          const fullAvatarUrl = profileData.user?.url
            ? `http://localhost:8000${profileData.user.url}`
            : null;

          setAvatar(fullAvatarUrl);

          const formData = {
            student_code: profileData.student_code,
            class_student_name: profileData.class_student?.name,
            full_name: `${profileData.user?.last_name || ""} ${
              profileData.user?.first_name || ""
            }`.trim(),
            email: profileData.user?.email,
            phone: profileData.user?.phone,
            address: profileData.user?.address,
            identity_number: profileData.user?.identity_number,
            birthday: profileData.user?.birthday
              ? moment(profileData.user.birthday)
              : null,
            gender: profileData.user?.gender,
          };

          form.setFieldsValue(formData);
        } else {
          messageApi.error(
            "Không thể tải thông tin hồ sơ hoặc hồ sơ không tồn tại!"
          );
          setTimeout(() => navigate(-1), 2000);
        }
      }
    };

    fetchProfileData();
  }, [dispatch, form, navigate, messageApi, user.user_id]);

  // if (loading) {
  //   return (
  //     <div className='flex justify-center items-center h-full'>
  //       <Spin size='large' />
  //     </div>
  //   );
  // }

  return (
    <>
      {contextHolder}
      <div className='h-full overflow-auto bg-gray-50'>
        <div className='max-w-6xl mx-auto'>
          <Card className='shadow-md border border-gray-200 p-6'>
            <div className='flex'>
              {/* ---- AVATAR USER ---- */}
              <div className='mb-8'>
                <img
                  src={avatar || "https://via.placeholder.com/150"}
                  alt='Avatar'
                  className='w-36 h-36 rounded-full object-cover border shadow'
                />
              </div>

              <Form
                form={form}
                layout='vertical'
                style={{ flex: 1, marginLeft: 30 }}
              >
                <h3 className='text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200'>
                  Thông tin sinh viên
                </h3>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label='Mã sinh viên' name='student_code'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Lớp' name='class_student_name'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label='Họ và tên' name='full_name'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Email' name='email'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label='Số điện thoại' name='phone'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Số CCCD/CMND' name='identity_number'>
                      <Input readOnly size='large' />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={24}>
                  <Col span={12}>
                    <Form.Item label='Ngày sinh' name='birthday'>
                      <DatePicker
                        style={{ width: "100%" }}
                        format='DD/MM/YYYY'
                        size='large'
                        disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label='Giới tính' name='gender'>
                      <Select size='large' disabled>
                        <Select.Option value='M'>Nam</Select.Option>
                        <Select.Option value='F'>Nữ</Select.Option>
                        <Select.Option value='O'>Khác</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label='Địa chỉ' name='address'>
                  <Input.TextArea rows={3} readOnly />
                </Form.Item>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
