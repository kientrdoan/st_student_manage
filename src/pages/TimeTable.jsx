"use client"

import { useState, useMemo, useEffect } from "react"
import { Select, Button } from "antd"
import { MdChevronLeft, MdChevronRight, MdCalendarToday, MdFullscreen } from "react-icons/md"
import dayjs from "dayjs"
import { useDispatch, useSelector } from "react-redux"
import { getAllSemeterAction, getCurrentSemeterAction } from "../redux/actions/SemesterAction"
import { getAllCourseByStudentAndSemesterAction } from "../redux/actions/CourseAction"

// 🔹 Hàm sinh tuần dựa vào ngày bắt đầu & kết thúc
function generateAllWeeks(startDate, endDate) {
  const weeks = []
  let start = dayjs(startDate)
  const end = dayjs(endDate)
  let weekNumber = 1

  while (start.isBefore(end) || start.isSame(end, "day")) {
    const weekEnd = start.add(6, "day")
    const actualEnd = weekEnd.isAfter(end) ? end : weekEnd

    weeks.push({
      value: weekNumber.toString(),
      label: `Tuần ${weekNumber} [${start.format("DD/MM/YYYY")} - ${actualEnd.format("DD/MM/YYYY")}]`,
      start: start.format("YYYY-MM-DD"),
      end: actualEnd.format("YYYY-MM-DD"),
      weekNumber,
    })

    start = actualEnd.add(1, "day")
    weekNumber++
  }

  return weeks
}

const DAYS = [
  { key: 0, label: "Thứ 2" },
  { key: 1, label: "Thứ 3" },
  { key: 2, label: "Thứ 4" },
  { key: 3, label: "Thứ 5" },
  { key: 4, label: "Thứ 6" },
  { key: 5, label: "Thứ 7" },
]

const PERIODS = Array.from({ length: 10 }, (_, i) => i + 1)

// 🔹 Map weekday API sang index cột
function convertWeekday(weekday) {
  const map = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
  }
  return map[weekday] ?? 0
}

export default function TimeTable() {
  const dispatch = useDispatch()

  const semesters = useSelector((state) => state.SemesterReducer.semesters)
  const semester_detail = useSelector((state) => state.SemesterReducer.semester_detail)
  const courses = useSelector((state) => state.CourseReducer.courses)
  const user = useSelector((state) => state.UserReducer.user)

  const [selectedSemester, setSelectedSemester] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)

  // 🔹 Lấy danh sách học kỳ và học kỳ hiện tại
  useEffect(() => {
    dispatch(getAllSemeterAction())
    dispatch(getCurrentSemeterAction())
  }, [dispatch])

  // 🔹 Chọn học kỳ mặc định
  useEffect(() => {
    if (semester_detail?.id && !selectedSemester) {
      setSelectedSemester(semester_detail.id.toString())
    }
  }, [semester_detail, selectedSemester])

  // 🔹 Lấy danh sách course theo học kỳ
  useEffect(() => {
    if (selectedSemester && user?.user_id) {
      dispatch(getAllCourseByStudentAndSemesterAction(user.user_id, selectedSemester))
    }
  }, [dispatch, user?.user_id, selectedSemester])

  // 🔹 Chuẩn hóa dữ liệu course
  const normalizedCourses = useMemo(() => {
    return (courses || []).map((item) => {
      const c = item.course
      // Tính số tiết của course
      const start = c.start_period
      const end = start + (c.end_period ? c.end_period - start : 4) // Nếu API có end_period thì dùng
      const time_period = Array.from({ length: end - start + 1 }, (_, i) => start + i)

      return {
        id: c.course_id,
        start_date: c.course_start_date,
        end_date: c.course_end_date,
        weekday: convertWeekday(c.course_weekday),
        subject: {
          code: c.subject_code,
          name: c.subject_name,
          credit: c.subject_credit,
        },
        teacher: c.teacher,
        room: c.room,
        time_period,
      }
    })
  }, [courses])

  // 🔹 Sinh danh sách tuần
  const weeks = useMemo(() => {
    if (!selectedSemester || semesters.length === 0) return []
    const selected = semesters.find((s) => s.id.toString() === selectedSemester)
    if (!selected) return []
    return generateAllWeeks(selected.start_date, selected.end_date)
  }, [selectedSemester, semesters])

  // 🔹 Set tuần đầu tiên mặc định
  useEffect(() => {
    if (weeks.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[0].value)
    }
  }, [weeks, selectedWeek])

  const selectedWeekData = weeks.find((w) => w.value === selectedWeek)

  // 🔹 Lọc courses theo tuần
  const filteredCourses = useMemo(() => {
    if (!selectedWeekData) return []
    return normalizedCourses.filter((course) => {
      const courseStart = dayjs(course.start_date)
      const courseEnd = dayjs(course.end_date)
      const weekStart = dayjs(selectedWeekData.start)
      const weekEnd = dayjs(selectedWeekData.end)
      return courseEnd.isAfter(weekStart) && courseStart.isBefore(weekEnd.add(1, "day"))
    })
  }, [normalizedCourses, selectedWeekData])

  // 🔹 Map course theo cell
  const courseMap = useMemo(() => {
    const map = new Map()
    filteredCourses.forEach((course) => {
      if (course.weekday != null && course.time_period) {
        course.time_period.forEach((period) => {
          map.set(`${course.weekday}-${period}`, course)
        })
      }
    })
    return map
  }, [filteredCourses])

  // 🔹 Cells đã merge
  const renderedCells = useMemo(() => {
    const set = new Set()
    filteredCourses.forEach((course) => {
      if (course.weekday != null && course.time_period?.length > 1) {
        for (let i = 1; i < course.time_period.length; i++) {
          set.add(`${course.weekday}-${course.time_period[i]}`)
        }
      }
    })
    return set
  }, [filteredCourses])

  const getCourseForCell = (day, period) => courseMap.get(`${day}-${period}`)

  const handlePreviousWeek = () => {
    const idx = weeks.findIndex((w) => w.value === selectedWeek)
    if (idx > 0) setSelectedWeek(weeks[idx - 1].value)
  }

  const handleNextWeek = () => {
    const idx = weeks.findIndex((w) => w.value === selectedWeek)
    if (idx < weeks.length - 1) setSelectedWeek(weeks[idx + 1].value)
  }

  return (
    <div style={{ maxWidth: 1600, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ background: "#1890ff", color: "white", padding: 16, borderRadius: "8px 8px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <MdCalendarToday size={24} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>THỜI KHÓA BIỂU DẠNG TUẦN</h1>
        </div>
        <Button type="text" icon={<MdFullscreen size={20} />} style={{ color: "white" }} />
      </div>

      {/* Bộ lọc học kỳ và tuần */}
      <div style={{ background: "white", border: "1px solid #d9d9d9", borderTop: "none", padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 16 }}>
          <Select
            placeholder="Chọn học kỳ"
            value={selectedSemester}
            onChange={setSelectedSemester}
            style={{ width: "100%" }}
            options={semesters?.map((s) => ({ value: s.id.toString(), label: `${s.semesters} - Năm học ${s.year}` })) || []}
          />
          <Select
            placeholder="Chọn tuần"
            value={selectedWeek}
            onChange={setSelectedWeek}
            style={{ width: "100%" }}
            options={weeks}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "white", border: "1px solid #d9d9d9", borderTop: "none", borderRadius: "0 0 8px 8px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1890ff", color: "white" }}>
              <th style={{ border: "1px solid #40a9ff", padding: 8, width: 100, position: "sticky", left: 0, background: "#1890ff", zIndex: 10 }}>
                <div onClick={handlePreviousWeek} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: 4, borderRadius: 4 }}>
                  <MdChevronLeft size={20} /><span style={{ fontSize: 14 }}>Trước</span>
                </div>
              </th>
              {DAYS.map((day) => (
                <th key={day.key} style={{ border: "1px solid #40a9ff", padding: 12, minWidth: 140 }}>{day.label}</th>
              ))}
              <th style={{ border: "1px solid #40a9ff", padding: 8, width: 100, position: "sticky", right: 0, background: "#1890ff", zIndex: 10 }}>
                <div onClick={handleNextWeek} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: 4, borderRadius: 4 }}>
                  <span style={{ fontSize: 14 }}>Sau</span><MdChevronRight size={20} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {PERIODS.map((period) => (
              <tr key={period}>
                <td style={{ border: "1px solid #d9d9d9", padding: 8, textAlign: "center", fontWeight: 500, background: "#1890ff", color: "white", position: "sticky", left: 0, zIndex: 10 }}>
                  Tiết {period}
                </td>
                {DAYS.map((day) => {
                  const key = `${day.key}-${period}`
                  if (renderedCells.has(key)) return null
                  const course = getCourseForCell(day.key, period)
                  if (!course) return <td key={key} style={{ border: "1px solid #d9d9d9", minHeight: 60 }} />
                  const isFirstPeriod = course.time_period[0] === period
                  const rowSpan = isFirstPeriod ? course.time_period.length : 1
                  return (
                    <td key={key} rowSpan={rowSpan} style={{ border: "1px solid #d9d9d9", verticalAlign: "top", minHeight: 60 }}>
                      {isFirstPeriod && (
                        <div style={{ background: "#e6f7ff", margin: 4, fontSize: 12, padding: 4, height: 195 }}>
                          <div style={{ fontWeight: 600, color: "#003a8c" }}>{course.subject.name}</div>
                          <div style={{ color: "#595959" }}>
                            <div>Mã: {course.subject.code}</div>
                            <div>GV: {course.teacher}</div>
                            <div>Phòng: {course.room}</div>
                          </div>
                        </div>
                      )}
                    </td>
                  )
                })}
                <td style={{ border: "1px solid #d9d9d9", padding: 8, textAlign: "center", fontWeight: 500, background: "#1890ff", color: "white", position: "sticky", right: 0, zIndex: 10 }}>
                  Tiết {period}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
