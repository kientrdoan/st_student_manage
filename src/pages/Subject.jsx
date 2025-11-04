import { useState, useEffect } from "react"
import { Table, Button, Input, Space, Dropdown, Checkbox, Tag } from "antd"
import { SearchOutlined, SettingOutlined, BookOutlined, EditOutlined } from "@ant-design/icons"
import { Link } from "react-router-dom"
import { getAllSubjectAction } from "../redux/actions/SubjectAction"
import { useDispatch, useSelector } from "react-redux"

export default function SubjectList() {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState("")

  const user = useSelector((state) => state.UserReducer.user)
  const subjects = useSelector((state) => state.SubjectReducer.subjects)

  const [visibleColumns, setVisibleColumns] = useState({
    code: true,
    name: true,
    credit: true,
    description: true,
    major: true,
    total_period: true,
  })

  useEffect(() => {
    if (user?.user_id) {
      dispatch(getAllSubjectAction(user.user_id))
    }
  }, [user?.user_id, dispatch])

  // 🔹 Map lại dữ liệu để hiển thị dễ dàng hơn
  const mappedSubjects = subjects.map((item) => ({
    ...item,
    majorName: item.major?.name || "N/A",
    description: item.description || null,
  }))

  // 🔹 Lọc dữ liệu theo từ khóa
  const filteredData = mappedSubjects.filter((item) => {
    const text = searchText.toLowerCase()
    return (
      item.code.toLowerCase().includes(text) ||
      item.name.toLowerCase().includes(text) ||
      item.credit.toString().includes(text) ||
      item.majorName.toLowerCase().includes(text)
    )
  })

  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }))
  }

  const columnMenu = {
    items: Object.keys(visibleColumns).map((key) => ({
      key,
      label: (
        <Checkbox checked={visibleColumns[key]} onChange={() => toggleColumn(key)}>
          {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")}
        </Checkbox>
      ),
    })),
  }

  // 🔹 Danh sách cột
  const allColumns = [
    {
      title: "Mã môn",
      dataIndex: "code",
      key: "code",
      visible: visibleColumns.code,
      render: (code) => <Tag color="purple">{code}</Tag>,
      width: 120,
    },
    {
      title: "Tên môn",
      dataIndex: "name",
      key: "name",
      visible: visibleColumns.name,
      width: 250,
    },
    {
      title: "Tín chỉ",
      dataIndex: "credit",
      key: "credit",
      visible: visibleColumns.credit,
      width: 100,
    },
    {
      title: "Tổng số tiết",
      dataIndex: "total_period",
      key: "total_period",
      visible: visibleColumns.total_period,
      width: 130,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      visible: visibleColumns.description,
      render: (desc) => desc || <span className="text-gray-400 italic">No description</span>,
      width: 200,
    },
    {
      title: "Ngành",
      dataIndex: "majorName",
      key: "majorName",
      visible: visibleColumns.major,
      render: (majorName) => <Tag color="blue">{majorName}</Tag>,
      width: 200,
    },
  ]

  const columns = allColumns.filter((col) => col.visible)

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col h-full">
        {/* Header */}
        <div className="mb-6 flex-shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <BookOutlined className="text-indigo-600 text-lg" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Subjects</h1>
              <p className="text-sm text-gray-500">Manage subject information</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-shrink-0">
          <Space size="middle">
            <Input
              placeholder="Search subjects..."
              prefix={<SearchOutlined className="text-gray-400" />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 320 }}
              size="large"
              allowClear
              className="rounded-lg"
            />
            <Dropdown menu={columnMenu} trigger={["click"]}>
              <Button icon={<SettingOutlined />} size="large" className="rounded-lg">
                Columns
              </Button>
            </Dropdown>
          </Space>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey={(r) => r.code}
            bordered
            pagination={{
              pageSize: 5,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} subjects`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
