"use client";

import { useEffect, useState } from "react";
import { Table, Card, Tag, Spin, Empty } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllCourseByCourseIdAction } from "../redux/actions/CourseAction";
import { getAttendByStudentAndCourseAction } from "../redux/actions/AttendAction";

export default function Attend() {
  const { id: course_id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.UserReducer.user);
  const attends = useSelector((state) => state.AttendReducer.attends);
  const course_detail = useSelector(
    (state) => state.CourseReducer.course_detail
  );

  const [allSessions, setAllSessions] = useState([]);

  // Fetch dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      if (course_id && user?.user_id) {
        await dispatch(getAllCourseByCourseIdAction(course_id));
        await dispatch(
          getAttendByStudentAndCourseAction(user.user_id, course_id)
        );
      }
    };
    fetchData();
  }, [course_id, user?.user_id, dispatch]);

  // Sinh danh sách buổi học khi có course_detail
  useEffect(() => {
    if (
      !course_detail?.start_date ||
      !course_detail?.end_date ||
      !course_detail?.weekday
    )
      return;

    const weekdayMap = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    const startDate = dayjs(course_detail.start_date);
    const endDate = dayjs(course_detail.end_date);
    const weekday = weekdayMap[course_detail.weekday];

    const sessions = [];
    let currentDate = startDate;

    while (currentDate.day() !== weekday) {
      currentDate = currentDate.add(1, "day");
    }

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      sessions.push({
        date: currentDate.format("YYYY-MM-DD"),
        dayOfWeek: currentDate.format("dddd"),
      });
      currentDate = currentDate.add(1, "week");
    }

    setAllSessions(sessions);
  }, [course_detail]);

  // Merge điểm danh
  const mergedData = allSessions.map((session, index) => {
    const record = attends?.find(
      (a) => dayjs(a.date).format("YYYY-MM-DD") === session.date
    );

    const sessionDate = dayjs(session.date).startOf("day");
    const today = dayjs().startOf("day");

    let status = "none";

    if (sessionDate.isAfter(today)) {
      // Buổi học trong tương lai
      status = "upcoming"; // đổi tên trạng thái riêng
    } else if (record) {
      // Có dữ liệu điểm danh
      if (record.status === "1") status = "present";
      else if (record.status === "0") status = "absent";
    } else {
      // Buổi học đã qua mà không có điểm danh → coi là vắng
      status = "absent";
    }

    return { ...session, key: index + 1, status };
  });

  const columns = [
    {
      title: "Ngày học",
      dataIndex: "date",
      key: "date",
      render: (text) => <b>{dayjs(text).format("DD/MM/YYYY")}</b>,
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
        let color = "default";
        let icon = null;
        let text = "";

        if (status === "present") {
          color = "success";
          icon = <CheckCircleOutlined />;
          text = "Có mặt";
        } else if (status === "absent") {
          color = "error";
          icon = <CloseCircleOutlined />;
          text = "Vắng mặt";
        } else {
          color = "default";
          icon = <ClockCircleOutlined />;
          text = "Chưa điểm danh";
        }

        return (
          <Tag icon={icon} color={color}>
            {text}
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: 16 }}>
        📋 Lịch sử điểm danh
      </h1>

      <Card>
        <Spin spinning={false}>
          {mergedData.length > 0 ? (
            <Table
              columns={columns}
              dataSource={mergedData}
              pagination={{
                pageSize: 10,
                total: mergedData.length,
                showTotal: (t) => `Tổng ${t} buổi học`,
              }}
              scroll={{ x: 600 }}
            />
          ) : (
            <Empty
              description='Không có dữ liệu điểm danh'
              style={{ margin: "48px 0" }}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
}
