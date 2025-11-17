"use client";

import { useEffect } from "react";
import { Table, Card, Tag, Spin, Empty, Button } from "antd";
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
import { getAllLessonAction } from "../redux/actions/LessonAction";

export default function Attend() {
  const { id: course_id } = useParams();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.UserReducer.user);
  const attends = useSelector((state) => state.AttendReducer.attends);
  const lessons = useSelector((state) => state.LessonReducer.lessons);

  // ===== FETCH DATA =====
  useEffect(() => {
    if (course_id && user?.user_id) {
      dispatch(getAllCourseByCourseIdAction(course_id));
      dispatch(getAttendByStudentAndCourseAction(user.user_id, course_id));
      dispatch(getAllLessonAction(course_id));
    }
  }, [course_id, user?.user_id, dispatch]);

  // ===== MERGE DATA =====
  const mergedData =
    lessons?.map((lesson, index) => {
      const lessonDate = dayjs(lesson.date).format("YYYY-MM-DD");

      const attendRecord = attends?.find(
        (item) => dayjs(item.date).format("YYYY-MM-DD") === lessonDate
      );

      const status = attendRecord ? attendRecord.status === true : false;

      return {
        key: index + 1,
        id: lesson.id,
        date: lessonDate,
        dayOfWeek: dayjs(lesson.date).format("dddd"),
        status: status,
      };
    }) || [];

  // ======= HANDLE ATTEND =======
  const handleAttend = (lesson_id, status) => {
    const payload = {
      user_id: user.user_id,
      course_id: course_id,
      time_slot_id: lesson_id,
      status: status
    }
    console.log("Điểm danh cho buổi học:", payload);
  };

  // ===== COLUMNS =====
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
      render: (status, record) => {
        const today = dayjs().format("YYYY-MM-DD");
        const lessonDate = record.date;

        // ========= NGÀY HÔM NAY =========
        if (lessonDate === today) {
          if (status === true) {
            return (
              <Tag icon={<CheckCircleOutlined />} color="success">
                Đã điểm danh hôm nay
              </Tag>
            );
          }

          // Chưa điểm danh → hiện Button
          return (
            <Button
              type="primary"
              icon={<ClockCircleOutlined />}
              onClick={() => handleAttend(record.id, status= true)}
            >
              Điểm danh hôm nay
            </Button>
          );
        }

        // ========= QUÁ KHỨ =========
        if (dayjs(lessonDate).isBefore(today, "day")) {
          return status ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              Có mặt
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              Vắng mặt
            </Tag>
          );
        }

        // ========= TƯƠNG LAI =========
        return (
          <Tag icon={<ClockCircleOutlined />} color="default">
            Chưa diễn ra
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
                pageSize: 15,
                total: mergedData.length,
                showTotal: (t) => `Tổng ${t} buổi học`,
              }}
            />
          ) : (
            <Empty
              description="Không có dữ liệu điểm danh"
              style={{ margin: "48px 0" }}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
}
