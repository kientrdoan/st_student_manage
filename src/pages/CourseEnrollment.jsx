"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Dropdown,
  Checkbox,
  Tag,
  message,
  Spin,
  Empty,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  ReadOutlined,
  PlusOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { getCourseEnrollmentAction } from "../redux/actions/CourseEnrollmentAction";
import { useParams, useNavigate } from "react-router-dom";

export default function CourseEnrollment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // lấy id từ URL (vd: /course-enrollment/9)

  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const enrollments = useSelector(  (state) => state.CourseEnrollmentReducer.course_enrollments    );

  const [visibleColumns, setVisibleColumns] = useState({
    subject_code: true,
    subject_name: true,
    credit: true,
    teacher: true,
    class_name: true,
    major: true,
    room: true,
    capacity: true,
  });

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        const res = await dispatch(getCourseEnrollmentAction(id));
        if (!res?.success) {
          messageApi.error("Không thể tải danh sách môn học!");
          setTimeout(() => navigate(-1), 2000);
        }
        setLoading(false);
      };
      fetchData();
    } else {
      messageApi.warning("Không tìm thấy ID sinh viên trong URL.");
      navigate(-1);
    }
  }, [dispatch, id, navigate, messageApi]);

  const filteredData = enrollments.filter((item) => {
    const text = searchText.toLowerCase();
    return (
      item.subject?.code?.toLowerCase().includes(text) ||
      item.subject?.name?.toLowerCase().includes(text) ||
      item.teacher?.user?.first_name?.toLowerCase().includes(text) ||
      item.class_st?.name?.toLowerCase().includes(text)
    );
  });

  const toggleColumn = (key) =>
    setVisibleColumns((prev) => ({ ...prev, [key]: !prev[key] }));

  const columnMenu = {
    items: Object.keys(visibleColumns).map((key) => ({
      key,
      label: (
        <Checkbox
          checked={visibleColumns[key]}
          onChange={() => toggleColumn(key)}
        >
          {key.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </Checkbox>
      ),
    })),
  };

  const handleRegister = (record) => {
    messageApi.success(`✅ Đã đăng ký môn ${record.subject.name}!`);
    // 🔹 TODO: Gọi API đăng ký môn học tại đây nếu backend có endpoint
  };

  const allColumns = [
    {
      title: "Mã môn học",
      dataIndex: ["subject", "code"],
      key: "subject_code",
      visible: visibleColumns.subject_code,
      render: (code) => <Tag color="purple">{code}</Tag>,
      width: 130,
    },
    {
      title: "Tên môn học",
      dataIndex: ["subject", "name"],
      key: "subject_name",
      visible: visibleColumns.subject_name,
      width: 260,
    },
    {
      title: "Số tín chỉ",
      dataIndex: ["subject", "credit"],
      key: "credit",
      visible: visibleColumns.credit,
      width: 100,
    },
    {
      title: "Giảng viên",
      dataIndex: ["teacher", "user"],
      key: "teacher",
      visible: visibleColumns.teacher,
      render: (user) =>
        user ? (
          <span>
            {user.last_name} {user.first_name}
          </span>
        ) : (
          <span className="text-gray-400 italic">Chưa có</span>
        ),
      width: 180,
    },
    {
      title: "Lớp",
      dataIndex: ["class_st", "name"],
      key: "class_name",
      visible: visibleColumns.class_name,
      width: 160,
    },
    {
      title: "Ngành học",
      dataIndex: ["class_st", "major", "name"],
      key: "major",
      visible: visibleColumns.major,
      render: (major) => <Tag color="blue">{major}</Tag>,
      width: 180,
    },
    {
      title: "Phòng học",
      dataIndex: ["room", "room_code"],
      key: "room",
      visible: visibleColumns.room,
      width: 120,
    },
    {
      title: "Sức chứa",
      dataIndex: "max_capacity",
      key: "capacity",
      visible: visibleColumns.capacity,
      render: (cap) => <Tag color="green">{cap}</Tag>,
      width: 120,
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="rounded-lg"
          onClick={() => handleRegister(record)}
        >
          Đăng ký
        </Button>
      ),
      width: 140,
    },
  ];

  const columns = allColumns.filter((col) => col.visible);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="h-full flex flex-col bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <ReadOutlined className="text-indigo-600 text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Đăng ký môn học
                </h1>
                <p className="text-sm text-gray-500">
                  Danh sách các môn học có thể đăng ký cho sinh viên ID:{" "}
                  <span className="font-medium text-indigo-600">{id}</span>
                </p>
              </div>
            </div>

            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              size="large"
            >
              Quay lại
            </Button>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <Space size="middle">
              <Input
                placeholder="Tìm kiếm môn học..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 320 }}
                size="large"
                allowClear
                className="rounded-lg"
              />
              <Dropdown menu={columnMenu} trigger={["click"]}>
                <Button
                  icon={<SettingOutlined />}
                  size="large"
                  className="rounded-lg"
                >
                  Cột hiển thị
                </Button>
              </Dropdown>
            </Space>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden">
            {filteredData.length > 0 ? (
              <Table
                columns={columns}
                dataSource={filteredData}
                rowKey={(r) => r.id}
                bordered
                pagination={{
                  pageSize: 5,
                  showSizeChanger: true,
                  showTotal: (total) => `Tổng ${total} môn học`,
                }}
              />
            ) : (
              <Empty description="Không có môn học nào để hiển thị" />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
