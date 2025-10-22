import React, { useState, useMemo, useEffect } from "react";
import { MdSettings, MdBook, MdGroup, MdCheckBox } from "react-icons/md";
import { Table, Select, Button, Tag, Card, Space, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  CreateCourseEnrollmentAction,
  getCourseEnrollmentAction,
} from "../redux/actions/EnrollmentAction";
import { getAllClassAction } from "../redux/actions/ClassAction";
import { getAllSemeterAction } from "../redux/actions/SemesterAction";
import { getAllCourseByStudentAndSemesterAction } from "../redux/actions/CourseAction";

const { Text } = Typography;
const { Option } = Select;

export default function Enrollment() {
  const dispatch = useDispatch();

  const enrollments = useSelector(
    (state) => state.EnrollmentReducer.enrollments
  );
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const classes = useSelector((state) => state.ClassReducer.classes);
  const user = useSelector((state) => state.UserReducer.user);
  const courses = useSelector((state) => state.CourseReducer.courses);

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    dispatch(getAllSemeterAction());
    dispatch(getAllClassAction());
  }, [dispatch]);

  useEffect(() => {
    if (semesters.length > 0 && user?.user_id) {
      dispatch(
        getAllCourseByStudentAndSemesterAction(user.user_id, semesters[0].id)
      );
    }
  }, [dispatch, user, semesters]);

  useEffect(() => {
    if (classes.length > 0 && semesters.length > 0 && user?.class_id) {
      const defaultClass = classes.find((c) => c.id === user.class_id);
      if (defaultClass) {
        setSelectedClass(defaultClass.id);
        dispatch(getCourseEnrollmentAction(defaultClass.id, semesters[0].id));
      }
    }
  }, [classes, semesters, user, dispatch]);

  useEffect(() => {
    if (selectedClass && semesters.length > 0) {
      dispatch(getCourseEnrollmentAction(selectedClass, semesters[0].id));
    }
  }, [selectedClass, dispatch, semesters]);

  useEffect(() => {
    if (enrollments.length > 0 && courses.length > 0) {
      const registeredIds = enrollments
        .filter((enr) => courses.some((c) => c.course.course_id === enr.id))
        .map((enr) => enr.id);

      setSelectedRowKeys(registeredIds);
    }
  }, [enrollments, courses]);

  const filteredCourses = useMemo(() => {
    return enrollments.map((item) => ({
      id: item.id,
      subject_code: item.subject?.code,
      subject_name: item.subject?.name,
      credit: item.subject?.credit,
      major_name: item.class_st?.major?.name,
      room_code: item.room?.room_code,
      teacher_name:
        item.teacher?.user?.last_name + " " + item.teacher?.user?.first_name,
      weekday: item.weekday,
      start_period: item.start_period,
      start_date: item.start_date,
      end_date: item.end_date,
      max_capacity: item.max_capacity,
      quantity: item.quantity || 0,
      remaining: item.max_capacity - (item.quantity ? item.quantity : 0),
    }));
  }, [enrollments]);

  useEffect(() => {
    if (enrollments.length > 0 && courses.length > 0) {
      console.log("=== ENROLLMENTS SAMPLE ===");
      console.log(enrollments[0]);
      console.log("=== COURSES SAMPLE ===");
      console.log(courses);
      const registeredIds = filteredCourses
        .filter((enr) => courses.some((c) => c.course.course_id === enr.id))
        .map((enr) => enr.id);

      setSelectedRowKeys(registeredIds);
    }
  }, [enrollments, courses, filteredCourses]);

  const columns = [
    { title: "Mã MH", dataIndex: "subject_code", key: "subject_code" },
    { title: "Tên môn học", dataIndex: "subject_name", key: "subject_name" },
    {
      title: "Số TC",
      dataIndex: "credit",
      key: "credit",
      align: "center",
    },
    {
      title: "Giảng viên",
      dataIndex: "teacher_name",
      key: "teacher_name",
      align: "center",
    },
    {
      title: "Phòng học",
      dataIndex: "room_code",
      key: "room_code",
      align: "center",
    },
    {
      title: "Thứ",
      dataIndex: "weekday",
      key: "weekday",
      align: "center",
    },
    {
      title: "Tiết bắt đầu",
      dataIndex: "start_period",
      key: "start_period",
      align: "center",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      align: "center",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Còn lại",
      dataIndex: "remaining",
      key: "remaining",
      align: "center",
      render: (remaining) =>
        remaining > 0 ? (
          <Tag color='green'>{remaining}</Tag>
        ) : (
          <Tag color='red'>{remaining}</Tag>
        ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: courses.some((c) => c.course.course_id === record.id),
    }),
  };

  const handleRegister = async () => {
    const selectedCourses = enrollments.filter((c) =>
      selectedRowKeys.includes(c.id)
    );

    const filteredCourses = selectedCourses.filter(
      (course) => !courses.some((c) => c.course.course_id === course.id)
    );

    if (filteredCourses.length === 0) {
      return;
    }

    // Gọi API đăng ký từng môn
    await Promise.all(
      filteredCourses.map((course) =>
        dispatch(CreateCourseEnrollmentAction(user.user_id, course.id))
      )
    );

    // Sau khi đăng ký xong => load lại danh sách
    await dispatch(
      getAllCourseByStudentAndSemesterAction(user.user_id, semesters[0].id)
    );
    await dispatch(getCourseEnrollmentAction(selectedClass, semesters[0].id));
  };

  return (
    <div>
      {/* Header */}
      <Card
        style={{ marginBottom: 24, borderRadius: 12 }}
        headStyle={{
          background: "linear-gradient(to right, #2563eb, #1d4ed8)",
          color: "white",
        }}
        title={
          <Space>
            <MdBook style={{ color: "white", fontSize: 20 }} />
            <span style={{ color: "white", fontWeight: 600 }}>
              Đăng ký môn học học kỳ 1 - Năm học 2025 - 2026
            </span>
          </Space>
        }
        extra={
          <MdSettings
            style={{ color: "white", fontSize: 18, cursor: "pointer" }}
          />
        }
      >
        <Space direction='vertical' style={{ width: "100%" }}>
          <Text strong>
            <MdGroup style={{ marginRight: 6, fontSize: 16 }} />
            Môn học mở theo lớp sinh viên
          </Text>
          <Select
            value={selectedClass || undefined}
            onChange={(v) => setSelectedClass(v)}
            style={{ width: 250 }}
            placeholder='Chọn lớp...'
          >
            {classes.map((cls) => (
              <Option key={cls.id} value={cls.id}>
                {cls.name}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={filteredCourses}
          pagination={false}
          rowKey='id'
          locale={{
            emptyText: (
              <div style={{ textAlign: "center", padding: 24 }}>
                <MdBook style={{ fontSize: 28, color: "#ccc" }} />
                <p>Không tìm thấy môn học phù hợp</p>
              </div>
            ),
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
          }}
        >
          <Text>
            Đã chọn <b>{selectedRowKeys.length}</b> / {filteredCourses.length}{" "}
            môn học
          </Text>
          <Button
            type='primary'
            disabled={selectedRowKeys.length === 0}
            icon={<MdCheckBox style={{ fontSize: 18 }} />}
            onClick={handleRegister}
          >
            Đăng ký các môn đã chọn
          </Button>
        </div>
      </Card>
    </div>
  );
}
