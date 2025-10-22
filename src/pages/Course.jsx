import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Dropdown,
  Checkbox,
  Tag,
  Select,
  Popconfirm,
} from "antd";

import {
  SearchOutlined,
  SettingOutlined,
  BookOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import { useDispatch, useSelector } from "react-redux";
import { getAllCourseByStudentAndSemesterAction } from "../redux/actions/CourseAction";
import { getAllSemeterAction } from "../redux/actions/SemesterAction";
import { DeleteCourseEnrollmentAction } from "../redux/actions/EnrollmentAction";

export default function ClassSchedule() {
  const user = useSelector((state) => state.UserReducer.user);
  const courses = useSelector((state) => state.CourseReducer.courses);
  const semesters = useSelector((state) => state.SemesterReducer.semesters);
  const dispatch = useDispatch();

  const [searchText, setSearchText] = useState("");
  const [selectedSemester, setSelectedSemester] = useState(null);

  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    subject: true,
    credit: true,
    start_date: true,
    end_date: true,
    weekday: true,
    action: true,
  });

  // 🔹 Lấy danh sách học kỳ và khóa học
  useEffect(() => {
    if (!user || !user.user_id) return;
    dispatch(getAllSemeterAction());
    dispatch(getAllCourseByStudentAndSemesterAction(user.user_id, selectedSemester));
  }, [dispatch, user, selectedSemester]);

  // 🔹 Sau khi có danh sách học kỳ → chọn mặc định là học kỳ đầu tiên
  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      const firstSemester = semesters[0];
      setSelectedSemester(firstSemester.id);
      if (user?.user_id) {
        dispatch(getAllCourseByStudentAndSemesterAction(user.user_id, firstSemester.id));
      }
    }
  }, [semesters, selectedSemester, user, dispatch]);

  // 🔹 Khi chọn học kỳ khác → gọi API tương ứng
  useEffect(() => {
    if (selectedSemester && user?.user_id) {
      dispatch(getAllCourseByStudentAndSemesterAction(user.user_id, selectedSemester));
    }
  }, [selectedSemester, user, dispatch]);

  // 🔹 Dữ liệu hiển thị sau khi lọc
  const filteredData = courses
    ?.map((item) => ({
      id: item.id,
      subject_code: item.course.subject_code,
      subject_name: item.course.subject_name,
      credit: item.course.subject_credit,
      start_date: item.course.course_start_date,
      end_date: item.course.course_end_date,
      weekday: item.course.course_weekday,
      enrolled_at: item.enrolled_at,
    }))
    .filter((course) => {
      const search = searchText.toLowerCase();
      return (
        course.subject_name.toLowerCase().includes(search) ||
        course.subject_code.toLowerCase().includes(search)
      );
    });

  // 🔹 Bật/tắt cột hiển thị
  const toggleColumn = (key) => {
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const columnMenu = {
    items: Object.keys(visibleColumns).map((key) => ({
      key,
      label: (
        <Checkbox
          checked={visibleColumns[key]}
          onChange={() => toggleColumn(key)}
        >
          {key.replace("_", " ").toUpperCase()}
        </Checkbox>
      ),
    })),
  };

  const handleDelete = async (register_id) => {
    console.log("id", register_id)
    await dispatch(DeleteCourseEnrollmentAction(user.user_id, register_id))
    await dispatch(getAllCourseByStudentAndSemesterAction(user.user_id, selectedSemester));
  };

  const allColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      visible: visibleColumns.id,
      width: 80,
    },
    {
      title: "Subject",
      key: "subject",
      visible: visibleColumns.subject,
      render: (_, record) => (
        <span>
          <Tag color="green">{record.subject_code}</Tag> {record.subject_name}
        </span>
      ),
    },
    {
      title: "Credit",
      dataIndex: "credit",
      key: "credit",
      visible: visibleColumns.credit,
      width: 100,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      visible: visibleColumns.start_date,
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      key: "end_date",
      visible: visibleColumns.end_date,
    },
    {
      title: "Weekday",
      dataIndex: "weekday",
      key: "weekday",
      visible: visibleColumns.weekday,
    },
    {
      title: "Action",
      key: "action",
      visible: visibleColumns.action,
      align: "center",
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this course?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            size="small"
          />
        </Popconfirm>
      ),
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        {/* 🔹 Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Class Schedule</h1>
              <p className="text-sm text-gray-500">Manage and view class schedules</p>
            </div>
          </div>
        </div>

        {/* 🔹 Thanh công cụ */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Space size="middle">
            <Input
              placeholder="Search by subject name or code..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 280 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
            <Select
              placeholder="Select semester"
              size="large"
              allowClear
              value={selectedSemester}
              onChange={(value) => setSelectedSemester(value)}
              style={{ width: 220 }}
              options={semesters.map((s) => ({
                label: `${s.year} - ${s.semesters}`,
                value: s.id,
              }))}
            />
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button
                icon={<SettingOutlined />}
                size="large"
                className="rounded-lg"
              >
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* 🔹 Bảng dữ liệu */}
        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            bordered
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} records`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
