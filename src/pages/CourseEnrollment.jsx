"use client"
import { useState, useEffect } from "react"
import { Table, Button, Input, Space, Tag, Card, message, Modal } from "antd"
import { SearchOutlined, BookOutlined, PlusOutlined, UserOutlined, HomeOutlined, CalendarOutlined } from "@ant-design/icons"
import { useDispatch, useSelector } from "react-redux"
import { getAllAvailableCoursesAction, enrollCourseAction } from "../redux/actions/CourseEnrollmentAction"

export default function CourseEnrollment() {
  const dispatch = useDispatch()
  const [messageApi, contextHolder] = message.useMessage()
  const [searchText, setSearchText] = useState("")
  const [loading, setLoading] = useState(false)
  const [enrollModalVisible, setEnrollModalVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Lấy dữ liệu từ Redux store
  const courses = useSelector((state) => state.CourseEnrollmentReducer?.available_courses || [])

  // Lấy danh sách các môn học có sẵn khi component mount
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      const res = await dispatch(getAllAvailableCoursesAction())
      if (!res?.success) {
        messageApi.error("Không thể tải danh sách môn học!")
      }
      setLoading(false)
    }
    fetchCourses()
  }, [dispatch, messageApi])

  // Lọc dữ liệu theo từ khóa tìm kiếm
  const filteredData = courses.filter((item) => {
    const text = searchText.toLowerCase()
    return (
      item.subject?.code?.toLowerCase().includes(text) ||
      item.subject?.name?.toLowerCase().includes(text) ||
      item.teacher?.user?.first_name?.toLowerCase().includes(text) ||
      item.teacher?.user?.last_name?.toLowerCase().includes(text) ||
      item.class_st?.name?.toLowerCase().includes(text)
    )
  })

  // Xử lý đăng ký môn học
  const handleEnrollCourse = async () => {
    if (!selectedCourse?.id) return
    
    setLoading(true)
    const res = await dispatch(enrollCourseAction(selectedCourse.id))
    
    if (res?.success) {
      messageApi.success(res.message || "Đăng ký môn học thành công!")
      setEnrollModalVisible(false)
      setSelectedCourse(null)
      // Refresh lại danh sách
      await dispatch(getAllAvailableCoursesAction())
    } else {
      messageApi.error(res?.message || "Đăng ký môn học thất bại!")
    }
    setLoading(false)
  }

  // Hiển thị modal xác nhận đăng ký
  const showEnrollModal = (course) => {
    setSelectedCourse(course)
    setEnrollModalVisible(true)
  }

  const columns = [
    {
      title: "Subject Code",
      dataIndex: ["subject", "code"],
      key: "subject_code",
      width: 130,
      render: (code) => <Tag color="purple">{code}</Tag>,
    },
    {
      title: "Subject Name",
      dataIndex: ["subject", "name"],
      key: "subject_name",
      width: 250,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: "Credits",
      dataIndex: ["subject", "credit"],
      key: "credit",
      width: 80,
      align: "center",
      render: (credit) => <Tag color="blue">{credit}</Tag>,
    },
    {
      title: "Teacher",
      key: "teacher",
      width: 180,
      render: (_, record) => {
        const teacher = record.teacher?.user
        return teacher ? (
          <span>
            <UserOutlined className="mr-2 text-gray-400" />
            {`${teacher.last_name} ${teacher.first_name}`}
          </span>
        ) : (
          <span className="text-gray-400 italic">N/A</span>
        )
      },
    },
    {
      title: "Class",
      dataIndex: ["class_st", "name"],
      key: "class",
      width: 150,
      render: (className) => <Tag color="cyan">{className}</Tag>,
    },
    {
      title: "Major",
      dataIndex: ["class_st", "major", "name"],
      key: "major",
      width: 200,
      render: (major) => (
        <span className="text-gray-600">{major || "N/A"}</span>
      ),
    },
    {
      title: "Room",
      dataIndex: ["room", "room_code"],
      key: "room",
      width: 100,
      align: "center",
      render: (room) => (
        <Tag color="orange" icon={<HomeOutlined />}>
          {room}
        </Tag>
      ),
    },
    {
      title: "Capacity",
      dataIndex: "max_capacity",
      key: "capacity",
      width: 100,
      align: "center",
      render: (capacity) => (
        <span className="font-semibold text-green-600">{capacity}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showEnrollModal(record)}
          className="bg-green-600 hover:bg-green-700"
          size="small"
        >
          Enroll
        </Button>
      ),
    },
  ]

  return (
    <div className="h-full flex flex-col">
      {contextHolder}
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <BookOutlined className="text-green-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Enrollment</h1>
              <p className="text-sm text-gray-500">Browse and enroll in available courses</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Card className="shadow-sm">
            <div className="flex items-center gap-4">
              <CalendarOutlined className="text-2xl text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Available Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </Card>

          <Space size="middle">
            <Input
              placeholder="Search courses, teachers, classes..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 350 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
          </Space>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(r) => r.id}
            bordered
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} courses`,
              pageSizeOptions: ["10", "20", "50"],
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </div>

      {/* Modal xác nhận đăng ký */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <BookOutlined className="text-green-600" />
            <span>Confirm Course Enrollment</span>
          </div>
        }
        open={enrollModalVisible}
        onOk={handleEnrollCourse}
        onCancel={() => {
          setEnrollModalVisible(false)
          setSelectedCourse(null)
        }}
        okText="Confirm Enrollment"
        cancelText="Cancel"
        okButtonProps={{ className: "bg-green-600 hover:bg-green-700" }}
        confirmLoading={loading}
      >
        {selectedCourse && (
          <div className="space-y-3 mt-4">
            <p className="text-gray-700">
              <strong>Subject:</strong> {selectedCourse.subject?.name} ({selectedCourse.subject?.code})
            </p>
            <p className="text-gray-700">
              <strong>Credits:</strong> {selectedCourse.subject?.credit}
            </p>
            <p className="text-gray-700">
              <strong>Teacher:</strong>{" "}
              {`${selectedCourse.teacher?.user?.last_name || ""} ${selectedCourse.teacher?.user?.first_name || ""}`.trim() || "N/A"}
            </p>
            <p className="text-gray-700">
              <strong>Class:</strong> {selectedCourse.class_st?.name}
            </p>
            <p className="text-gray-700">
              <strong>Room:</strong> {selectedCourse.room?.room_code}
            </p>
            <p className="text-gray-700">
              <strong>Capacity:</strong> {selectedCourse.max_capacity} students
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}