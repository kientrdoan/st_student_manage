import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllScoreAction } from "../redux/actions/ScoreAction";

export default function Score() {
  const [groupedData, setGroupedData] = useState([]);
  const user = useSelector((state) => state.UserReducer.user);
  const scores = useSelector((state) => state.ScoreReducer.scores);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      await dispatch(getAllScoreAction(user.user_id));
    };
    fetchData();
  }, [dispatch, user]);

  // Xử lý dữ liệu sau khi fetch xong
  useEffect(() => {
    if (!scores || scores.length === 0) return;

    const mapData = {};

    scores.forEach((item) => {
      const {
        semester,
        subject,
        mid_score,
        final_score,
        attendance_score,
        exercise_score,
      } = item;
      const year = semester.year;
      const semName = semester.semester_name;

      if (!mapData[year]) {
        mapData[year] = {};
      }
      if (!mapData[year][semName]) {
        mapData[year][semName] = [];
      }

      const hasAllScores =
        attendance_score != null &&
        exercise_score != null &&
        mid_score != null &&
        final_score != null;

      const sum = hasAllScores
        ? (attendance_score + exercise_score + mid_score + final_score) / 4
        : null;

      mapData[year][semName].push({
        key: item.id,
        stt: mapData[year][semName].length + 1,
        maMH: subject.subject_code,
        tenMH: subject.subject_name,
        tinChi: subject.subject_credit,
        diemCC: attendance_score ?? "—", // Điểm chuyên cần
        diemBT: exercise_score ?? "—", // Điểm bài tập
        diemGK: mid_score ?? "—",
        diemCK: final_score ?? "—",
        ketQua:
          sum != null
            ? sum >= 9
              ? "A+"
              : sum >= 8.5
              ? "A"
              : sum >= 8
              ? "B+"
              : sum >= 7
              ? "B"
              : sum >= 5
              ? "C"
              : "F"
            : null,
      });
    });

    // Sort năm học tăng dần
    const sortedYears = Object.keys(mapData).sort((a, b) => b.localeCompare(a));

    const formattedData = sortedYears.flatMap((year) => {
      // Sort học kỳ giảm dần (HK3 → HK2 → HK1)
      const semesters = Object.keys(mapData[year])
        .sort((a, b) => {
          const getNumber = (name) => parseInt(name.match(/\d+/)?.[0] || 0);
          return getNumber(b) - getNumber(a); // đảo ngược
        })
        .map((semName) => ({
          title: `${semName} - Năm học ${year}`,
          data: mapData[year][semName],
        }));

      return semesters;
    });

    setGroupedData(formattedData);
  }, [scores]);

  const columns = [
    { title: "STT", dataIndex: "stt", key: "stt", width: 60, align: "center" },
    { title: "Mã MH", dataIndex: "maMH", key: "maMH", align: "center" },
    { title: "Tên môn học", dataIndex: "tenMH", key: "tenMH" },
    {
      title: "Số tín chỉ",
      dataIndex: "tinChi",
      key: "tinChi",
      align: "center",
    },
    {
      title: "Điểm chuyên cần",
      dataIndex: "diemCC",
      key: "diemCC",
      align: "center",
    },
    {
      title: "Điểm bài tập",
      dataIndex: "diemBT",
      key: "diemBT",
      align: "center",
    },
    {
      title: "Điểm giữa kỳ",
      dataIndex: "diemGK",
      key: "diemGK",
      align: "center",
    },
    {
      title: "Điểm cuối kỳ",
      dataIndex: "diemCK",
      key: "diemCK",
      align: "center",
    },
    {
      title: "Kết quả",
      dataIndex: "ketQua",
      key: "ketQua",
      align: "center",
      render: (value) => {
        let color = "default";
        if (["A", "A+"].includes(value)) color = "green";
        else if (["B+", "B"].includes(value)) color = "blue";
        else if (["C+", "C"].includes(value)) color = "orange";
        else color = "red";
        return <Tag color={color}>{value || "—"}</Tag>;
      },
    },
  ];

  return (
    <div className='p-6 bg-white rounded-2xl shadow-md'>
      <h2 className='text-xl font-semibold mb-6 text-blue-600'>
        Kết quả học tập
      </h2>

      {groupedData.map((sem, index) => (
        <div key={index} className='mb-10'>
          <div className='bg-blue-50 p-3 rounded-md border-l-4 border-blue-500 mb-3'>
            <h3 className='text-base font-semibold text-blue-700'>
              {sem.title}
            </h3>
          </div>

          <Table
            columns={columns}
            dataSource={sem.data}
            pagination={false}
            bordered
            size='middle'
          />
        </div>
      ))}
    </div>
  );
}
