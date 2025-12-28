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
        discuss_score,
        project_score,
      } = item;

      const year = semester.year;
      const semName = semester.semester_name;

      if (!mapData[year]) mapData[year] = {};
      if (!mapData[year][semName]) mapData[year][semName] = [];

      // ===== TÍNH ĐIỂM TRUNG BÌNH =====
      let avgScore = null;

      if (final_score != null) {
        const validScores = [final_score];

        if (attendance_score != null) validScores.push(attendance_score);
        if (exercise_score != null) validScores.push(exercise_score);

        avgScore =
          validScores.reduce((sum, s) => sum + s, 0) / validScores.length;
      }

      // ===== XẾP LOẠI =====
      const ketQua =
        avgScore != null
          ? avgScore >= 9
            ? "A+"
            : avgScore >= 8.5
            ? "A"
            : avgScore >= 8
            ? "B+"
            : avgScore >= 7
            ? "B"
            : avgScore >= 5
            ? "C"
            : "F"
          : null;

      mapData[year][semName].push({
        key: item.id,
        stt: mapData[year][semName].length + 1,
        maMH: subject.subject_code,
        tenMH: subject.subject_name,
        tinChi: subject.subject_credit,
        diemCC: attendance_score ?? "",
        diemBT: exercise_score ?? "",
        diemTL: discuss_score ?? "",
        diemDA: project_score ?? "",
        diemGK: mid_score ?? "",
        diemCK: final_score ?? "",
        ketQua,
      });
    });

    // ===== SORT NĂM HỌC GIẢM DẦN =====
    const sortedYears = Object.keys(mapData).sort((a, b) => b.localeCompare(a));

    const formattedData = sortedYears.flatMap((year) => {
      // ===== SORT HỌC KỲ: HK3 → HK2 → HK1 =====
      return Object.keys(mapData[year])
        .sort((a, b) => {
          const getNumber = (name) => parseInt(name.match(/\d+/)?.[0] || 0);
          return getNumber(b) - getNumber(a);
        })
        .map((semName) => ({
          title: `${semName} - Năm học ${year}`,
          data: mapData[year][semName],
        }));
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
      title: "Điểm thảo luận",
      dataIndex: "diemTL",
      key: "diemTL",
      align: "center",
    },
    {
      title: "Điểm bài tập",
      dataIndex: "diemBT",
      key: "diemBT",
      align: "center",
    },
    {
      title: "Điểm đồ án",
      dataIndex: "diemDA",
      key: "diemDA",
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
