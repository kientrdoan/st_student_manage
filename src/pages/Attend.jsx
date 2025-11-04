"use client"

import { useState, useMemo } from "react"
import { Table, DatePicker, Button, Card, Row, Col, Statistic, Tag, Space, Empty, Spin } from "antd"
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  FilterOutlined,
} from "@ant-design/icons"
import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween"
import "antd/dist/reset.css"

dayjs.extend(isBetween)

// 🧩 Cấu hình lớp học cố định
const CLASS_SCHEDULE = {
  subjectName: "Lập trình Web",
  room: { code: "A305", building: "A" },
  weekday: 2,
  startPeriod: 1,
  endPeriod: 3,
  startDate: dayjs("2025-09-01"),
  endDate: dayjs("2025-12-20"),
}

function generateAttendanceHistory(schedule) {
  const { startDate, endDate, weekday } = schedule
  const sessions = []
  let currentDate = startDate.startOf("week")

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    const day = currentDate.day(weekday)
    if (day.isBetween(startDate, endDate, null, "[]")) {
      const status = Math.random() > 0.1 ? "present" : Math.random() > 0.5 ? "absent" : "late"
      sessions.push({
        key: sessions.length + 1,
        date: day.format("YYYY-MM-DD"),
        dayOfWeek: day.format("dddd"),
        status,
        time:
          status === "present"
            ? "07:30 AM"
            : status === "late"
            ? "08:00 AM"
            : "-",
      })
    }
    currentDate = currentDate.add(1, "week")
  }

  return sessions
}

export default function Attend() {
  const [startDate, setStartDate] = useState(CLASS_SCHEDULE.startDate)
  const [endDate, setEndDate] = useState(CLASS_SCHEDULE.endDate)
  const [loading, setLoading] = useState(false)

  // Lọc buổi học theo khoảng thời gian
  const allData = useMemo(() => generateAttendanceHistory(CLASS_SCHEDULE), [])
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      const itemDate = dayjs(item.date)
      return itemDate.isBetween(startDate, endDate, null, "[]")
    })
  }, [allData, startDate, endDate])

  // Tính thống kê
  // const stats = {
  //   total: filteredData.length,
  //   present: filteredData.filter((i) => i.status === "present").length,
  //   absent: filteredData.filter((i) => i.status === "absent").length,
  //   late: filteredData.filter((i) => i.status === "late").length,
  // }

  // const attendanceRate = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0

  const handleFilter = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 400)
  }

  const columns = [
    {
      title: "Ngày học",
      dataIndex: "date",
      key: "date",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Thứ",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default"
        let icon = null
        let text = ""

        if (status === "present") {
          color = "success"
          icon = <CheckCircleOutlined />
          text = "Có mặt"
        } else if (status === "absent") {
          color = "error"
          icon = <CloseCircleOutlined />
          text = "Vắng mặt"
        } else if (status === "late") {
          color = "warning"
          icon = <ClockCircleOutlined />
          text = "Muộn"
        }

        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        )
      },
    },
    {
      title: "Giờ vào lớp",
      dataIndex: "time",
      key: "time",
    },
  ]

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>📋 Lịch sử điểm danh</h1>
        <p style={{ color: "#666" }}>
          Môn học: <b>{CLASS_SCHEDULE.subjectName}</b> – Phòng{" "}
          <b>{CLASS_SCHEDULE.room.code}</b> ({CLASS_SCHEDULE.room.building})
        </p>
        <p style={{ color: "#666" }}>
          Lịch học: Thứ {CLASS_SCHEDULE.weekday} (Tiết {CLASS_SCHEDULE.startPeriod} →{" "}
          {CLASS_SCHEDULE.endPeriod}) | Từ {CLASS_SCHEDULE.startDate.format("DD/MM/YYYY")} đến{" "}
          {CLASS_SCHEDULE.endDate.format("DD/MM/YYYY")}
        </p>
      </div> */}

      {/* Cards thống kê */}
      {/* <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tổng buổi học" value={stats.total} prefix={<CalendarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Có mặt" value={stats.present} prefix={<CheckCircleOutlined />} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Vắng mặt" value={stats.absent} prefix={<CloseCircleOutlined />} valueStyle={{ color: "#ff4d4f" }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Tỷ lệ có mặt" value={attendanceRate} suffix="%" valueStyle={{ color: "#faad14" }} />
          </Card>
        </Col>
      </Row> */}

      {/* Bộ lọc */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FilterOutlined />
            <b>Lọc theo ngày</b>
          </div>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={8}>
              <DatePicker
                value={startDate}
                onChange={(d) => setStartDate(d)}
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <DatePicker
                value={endDate}
                onChange={(d) => setEndDate(d)}
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Button type="primary" icon={<FilterOutlined />} onClick={handleFilter} style={{ width: "100%" }}>
                Lọc
              </Button>
            </Col>
          </Row>
        </Space>
      </Card>

      {/* Bảng điểm danh */}
      <Card>
        <Spin spinning={loading}>
          {filteredData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={{ pageSize: 10, total: filteredData.length, showTotal: (t) => `Tổng ${t} buổi` }}
              scroll={{ x: 600 }}
              style={{ marginTop: "16px" }}
            />
          ) : (
            <Empty description="Không có dữ liệu điểm danh" style={{ margin: "48px 0" }} />
          )}
        </Spin>
      </Card>

      {/* <div style={{ marginTop: 24, padding: 16, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
        <p style={{ margin: 0, color: "#666" }}>
          💡 <b>Ghi chú:</b> Lịch học cố định, dữ liệu điểm danh chỉ mang tính mô phỏng.
        </p>
      </div> */}
    </div>
  )
}
