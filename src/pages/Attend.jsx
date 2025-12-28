"use client";

import { useEffect, useState } from "react";
import { Table, Card, Tag, Spin, Empty, Button, message, Upload } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { getAllCourseByCourseIdAction } from "../redux/actions/CourseAction";
import {
  AttendAction,
  getAttendByStudentAndCourseAction,
} from "../redux/actions/AttendAction";
import { getAllLessonAction } from "../redux/actions/LessonAction";
import { AiFillTags } from "react-icons/ai";

const weekdayLabels = {
  Monday: "Thứ 2",
  Tuesday: "Thứ 3",
  Wednesday: "Thứ 4",
  Thusday: "Thứ 5",
  Friday: "Thứ 6",
  Saturday: "Thứ 7",
  Sunday: "Chủ nhật",
};

export default function Attend() {
  const { id: course_id } = useParams();
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loadingUpload, setLoadingUpload] = useState(false);

  // const [openModal, setOpenModal] = useState(false);
  // const [imageBase64, setImageBase64] = useState("");

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

      const status = attendRecord ? attendRecord.status : "Absent";

      return {
        key: index + 1,
        id: lesson.id,
        date: lessonDate,
        dayOfWeek: dayjs(lesson.date).format("dddd"),
        status: status,
      };
    }) || [];

  const lessonMap =
    lessons?.reduce((acc, l) => {
      const formatted = dayjs(l.date).format("DD/MM/YYYY");
      acc[formatted] = l.id;
      return acc;
    }, {}) || {};

  const handleAttend = async (lessonId, file) => {
    setLoadingUpload(true); // bật loading
    const formData = new FormData();
    formData.append("time_slot_id", lessonId);
    formData.append("student_id", user.user_id);
    formData.append("course_id", course_id);
    formData.append("image", file);

    const res = await dispatch(AttendAction(formData));

    setLoadingUpload(false);

    if (res.success) {
      console.log(res.data);
      // setImageBase64(res.data.visualized_image);
      dispatch(getAttendByStudentAndCourseAction(user.user_id, course_id));
      messageApi.success("Điểm danh thành công");
    } else {
      messageApi.error("Dữ liệu không hợp lệ");
    }
  };

  // ===== COLUMNS =====
  const columns = [
    {
      title: "STT",
      width: 60,
      align: "center",
      fixed: "left",
      render: (_, __, index) => index + 1,
    },
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
      render: (weekday) => {
        const key = weekday;
        return weekdayLabels[key] || "N/A";
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => {
        const today = dayjs().startOf("day");
        const lessonDate = dayjs(record.date).startOf("day");

        // ========= TƯƠNG LAI =========
        if (lessonDate.isAfter(today)) {
          return (
            <Tag icon={<ClockCircleOutlined />} color='default'>
              Chưa diễn ra
            </Tag>
          );
        }

        // ========= HÔM NAY =========
        if (lessonDate.isSame(today)) {
          if (status === "Present") {
            return (
              <Tag icon={<CheckCircleOutlined />} color='success'>
                Có mặt
              </Tag>
            );
          }

          if (status === "Pending") {
            return (
              <Tag icon={<AiFillTags />} color='processing'>
                Đã gửi yêu cầu
              </Tag>
            );
          }

          // Chưa điểm danh → hiện button
          return (
            <Upload
              accept='image/*'
              showUploadList={false}
              beforeUpload={(file) => {
                const todayStr = dayjs().format("DD/MM/YYYY");
                const lessonId = lessonMap[todayStr];

                if (!lessonId) {
                  messageApi.error("Hôm nay không có buổi học!");
                  return Upload.LIST_IGNORE;
                }

                handleAttend(lessonId, file);
                return Upload.LIST_IGNORE;
              }}
            >
              <Button type='primary'>
                Điểm danh: {dayjs().format("DD/MM/YYYY")}
              </Button>
            </Upload>
          );
        }

        // ========= QUÁ KHỨ =========
        return status === "Present" ? (
          <Tag icon={<CheckCircleOutlined />} color='success'>
            Có mặt
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color='error'>
            Vắng mặt
          </Tag>
        );
      },
    },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      {contextHolder}
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: 16 }}>
        📋 Lịch sử điểm danh
      </h1>

      <Card>
        <Spin spinning={loadingUpload}>
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
              description='Không có dữ liệu điểm danh'
              style={{ margin: "48px 0" }}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
}
