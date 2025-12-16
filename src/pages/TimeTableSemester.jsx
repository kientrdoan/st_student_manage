import React, { useEffect, useState } from "react";
import { Table, Select, Card, Spin, message } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllSemeterAction,
  getCurrentSemeterAction,
} from "../redux/actions/SemesterAction";
import { getAllCourseByStudentAndSemesterAction } from "../redux/actions/CourseAction";

export default function TimeTableSemester() {
  const [semester, setSemester] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.UserReducer.user);
  const courses = useSelector((state) => state.CourseReducer.courses);
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const semester_detail = useSelector(
    (state) => state.SemesterReducer.semester_detail
  );

  const dispatch = useDispatch();

  // 🧩 Lấy danh sách học kỳ và học kỳ hiện tại
  useEffect(() => {
    (async () => {
      await dispatch(getAllSemeterAction());
      await dispatch(getCurrentSemeterAction());
    })();
  }, [dispatch]);

  // 🧩 Khi có học kỳ hiện tại, chỉ set nếu state chưa có
  useEffect(() => {
    if (semester_detail && semester_detail.id && semester === null) {
      setSemester(semester_detail.id);
    }
  }, [semester_detail, semester]);

  // 🧩 Khi semester thay đổi → gọi API
  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.user_id || !semester) return;
      try {
        setLoading(true);
        console.log("📡 Gọi API với semester =", semester);
        await dispatch(
          getAllCourseByStudentAndSemesterAction(user.user_id, semester)
        );
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        message.error("Lỗi khi tải danh sách lớp học!");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [dispatch, user?.user_id, semester]);

  // 🧩 Dữ liệu bảng
  const mappedCourses = courses?.map((item, index) => {
    const c = item.course || {};
    return {
      key: index + 1,
      maMH: c.subject_code,
      tenMH: c.subject_name,
      tinChi: c.subject_credit,
      thu: c.course_weekday,
      tietBD: c.start_period,
      phong: c.room,
      gv: c.teacher,
      thoiGian: `${new Date(c.course_start_date).toLocaleDateString(
        "vi-VN"
      )} đến ${new Date(c.course_end_date).toLocaleDateString("vi-VN")}`,
    };
  });

  const columns = [
    {
      title: "STT",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
    { title: "Mã MH", dataIndex: "maMH", key: "maMH", align: "center" },
    { title: "Tên môn học", dataIndex: "tenMH", key: "tenMH" },
    {
      title: "Số tín chỉ",
      dataIndex: "tinChi",
      key: "tinChi",
      align: "center",
    },
    { title: "Thứ", dataIndex: "thu", key: "thu", align: "center" },
    {
      title: "Tiết bắt đầu",
      dataIndex: "tietBD",
      key: "tietBD",
      align: "center",
    },
    { title: "Phòng", dataIndex: "phong", key: "phong", align: "center" },
    { title: "Giảng viên", dataIndex: "gv", key: "gv", align: "center" },
    {
      title: "Thời gian học",
      dataIndex: "thoiGian",
      key: "thoiGian",
      align: "center",
    },
  ];

  return (
    <Card
      title={
        <div className='flex items-center text-white'>
          <SettingOutlined className='mr-2' />
          <span className='font-semibold'>THỜI KHÓA BIỂU DẠNG HỌC KỲ</span>
        </div>
      }
      headStyle={{
        backgroundColor: "#1890ff",
        borderRadius: "6px 6px 0 0",
      }}
      bodyStyle={{ backgroundColor: "#f9f9f9" }}
      className='shadow-md rounded-lg'
    >
      <div className='flex flex-col md:flex-row gap-3 mb-4'>
        <Select
          value={semester ?? undefined}
          onChange={(value) => {
            console.log("🎯 Chọn semester:", value);
            setSemester(value);
          }}
          options={semesters.map((s) => ({
            value: s.id,
            label: `${s.semesters} - Năm học ${s.year}`,
          }))}
          placeholder='Chọn học kỳ'
          className='w-full md:w-1/3'
        />
      </div>

      <Spin spinning={loading} tip='Đang tải dữ liệu...'>
        <Table
          bordered
          size='middle'
          columns={columns}
          dataSource={mappedCourses}
          pagination={false}
          scroll={{ x: true }}
          className='bg-white'
        />
      </Spin>
    </Card>
  );
}
