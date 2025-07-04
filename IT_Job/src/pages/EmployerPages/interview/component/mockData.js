// src/constants/index.js

export const statusColors = {
    "Chờ xác nhận": "warning",
    "Đã xác nhận": "info",
    "Đã hoàn thành": "success",
    "Đã hủy": "error",
    Đạt: "success",
    "Không đạt": "error",
    "Chưa đánh giá": "default",
    "Đang đánh giá": "warning",
    "Chờ phỏng vấn": "info",
    "Chờ làm test": "default",
  };
  
  export const mockJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Hà Nội",
      postedDate: "01/05/2025",
      status: "Đang tuyển",
      applicantsCount: 15,
      description: "Chúng tôi đang tìm kiếm Frontend Developer có kinh nghiệm với React và các công nghệ hiện đại.",
      interviewRounds: [
        { id: 1, name: "Vòng 1: Phỏng vấn kỹ thuật cơ bản", order: 1 },
        { id: 2, name: "Vòng 2: Phỏng vấn chuyên sâu", order: 2 },
        { id: 3, name: "Vòng 3: Phỏng vấn với CTO", order: 3 },
      ],
    },
    {
      id: 2,
      title: "Backend Developer",
      department: "Engineering",
      location: "Hồ Chí Minh",
      postedDate: "03/05/2025",
      status: "Đang tuyển",
      applicantsCount: 12,
      description: "Vị trí Backend Developer yêu cầu kinh nghiệm với Node.js, Express và MongoDB.",
      interviewRounds: [
        { id: 1, name: "Vòng 1: Phỏng vấn kỹ thuật", order: 1 },
        { id: 2, name: "Vòng 2: Phỏng vấn với Team Lead", order: 2 },
      ],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "Hà Nội",
      postedDate: "05/05/2025",
      status: "Đang tuyển",
      applicantsCount: 8,
      description: "Chúng tôi cần UI/UX Designer có kinh nghiệm thiết kế giao diện người dùng và nghiên cứu UX.",
      interviewRounds: [
        { id: 1, name: "Vòng 1: Phỏng vấn portfolio", order: 1 },
        { id: 2, name: "Vòng 2: Thuyết trình case study", order: 2 },
        { id: 3, name: "Vòng 3: Phỏng vấn với Design Lead", order: 3 },
      ],
    },
  ];
  
  export const mockQualifiedApplicants = [
    {
      id: 1,
      jobId: 1, // Frontend Developer
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0912345678",
      appliedDate: "05/05/2025",
      testScore: 90,
      currentOverallStatus: "Đang đánh giá",
      currentRound: 1,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 2, status: "Chờ xác nhận", result: null },
        { roundId: 3, status: null, result: null },
      ],
      tests: [{ name: "React Coding Test", score: 90, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "React", rating: 4 },
        { name: "JavaScript", rating: 4 },
        { name: "CSS", rating: 3 },
        { name: "TypeScript", rating: 3 },
      ],
      education: "Đại học Bách Khoa Hà Nội",
      experience: "3 năm",
      overallNotes: "Ứng viên có kinh nghiệm tốt với React và các công nghệ frontend hiện đại.",
    },
    {
      id: 2,
      jobId: 1, // Frontend Developer
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0907654321",
      appliedDate: "06/05/2025",
      testScore: 85,
      currentOverallStatus: "Đang đánh giá",
      currentRound: 1,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 2, status: null, result: null },
        { roundId: 3, status: null, result: null },
      ],
      tests: [{ name: "React Coding Test", score: 85, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "React", rating: 4 },
        { name: "JavaScript", rating: 4 },
        { name: "HTML", rating: 4 },
      ],
      education: "Đại học Công nghệ thông tin - ĐHQGHN",
      experience: "2 năm",
      overallNotes: "Ứng viên có tiềm năng, cần rèn luyện thêm kỹ năng mềm.",
    },
    {
      id: 3,
      jobId: 1, // Frontend Developer
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0909876543",
      appliedDate: "07/05/2025",
      testScore: 78,
      currentOverallStatus: "Không đạt",
      currentRound: 1,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Không đạt" },
        { roundId: 2, status: null, result: null },
        { roundId: 3, status: null, result: null },
      ],
      tests: [{ name: "React Coding Test", score: 78, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "React", rating: 2 },
        { name: "JavaScript", rating: 3 },
      ],
      education: "Cao đẳng FPT",
      experience: "1 năm",
      overallNotes: "Kiến thức kỹ thuật còn hạn chế so với yêu cầu.",
    },
    {
      id: 4,
      jobId: 2, // Backend Developer
      name: "Đặng Thị D",
      email: "dangthid@example.com",
      phone: "0987654321",
      appliedDate: "08/05/2025",
      testScore: 92,
      currentOverallStatus: "Đang đánh giá",
      currentRound: 1,
      interviewProgress: [
        { roundId: 1, status: "Đã xác nhận", result: null },
        { roundId: 2, status: null, result: null },
      ],
      tests: [{ name: "Node.js & Database Test", score: 92, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Node.js", rating: 5 },
        { name: "Express", rating: 4 },
        { name: "PostgreSQL", rating: 4 },
      ],
      education: "Đại học Bách Khoa Hà Nội",
      experience: "4 năm",
      overallNotes: "Ứng viên nổi bật với kinh nghiệm chuyên sâu về Node.js và SQL.",
    },
    {
      id: 5,
      jobId: 2, // Backend Developer
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0908765432",
      appliedDate: "09/05/2025",
      testScore: 90,
      currentOverallStatus: "Đang đánh giá",
      currentRound: 2,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 2, status: "Đã xác nhận", result: null },
      ],
      tests: [{ name: "Node.js & Database Test", score: 90, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Node.js", rating: 4 },
        { name: "MongoDB", rating: 3 },
        { name: "Express", rating: 4 },
        { name: "SQL", rating: 3 },
      ],
      education: "Đại học Công nghệ - ĐHQGHN",
      experience: "2 năm",
      overallNotes: "Ứng viên có kiến thức tốt về backend và database.",
    },
    {
      id: 6,
      jobId: 3, // UI/UX Designer
      name: "Vũ Thị F",
      email: "vuthif@example.com",
      phone: "0904567890",
      appliedDate: "10/05/2025",
      testScore: 88,
      currentOverallStatus: "Đang đánh giá",
      currentRound: 2,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 2, status: "Chờ xác nhận", result: null },
        { roundId: 3, status: null, result: null },
      ],
      tests: [{ name: "Design Challenge", score: 88, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Figma", rating: 4 },
        { name: "Adobe XD", rating: 3 },
        { name: "UI Design", rating: 4 },
        { name: "UX Research", rating: 3 },
      ],
      education: "Đại học FPT",
      experience: "4 năm",
      overallNotes: "Ứng viên có portfolio ấn tượng và kỹ năng thiết kế tốt.",
    },
    {
      id: 7,
      jobId: 3, // UI/UX Designer
      name: "Nguyễn Văn G",
      email: "nguyenvang@example.com",
      phone: "0901234567",
      appliedDate: "11/05/2025",
      testScore: 92,
      currentOverallStatus: "Đạt",
      currentRound: 3,
      interviewProgress: [
        { roundId: 1, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 2, status: "Đã hoàn thành", result: "Đạt" },
        { roundId: 3, status: "Đã xác nhận", result: null },
      ],
      tests: [{ name: "Design Challenge", score: 92, maxScore: 100, status: "Đã hoàn thành", result: "Đạt" }],
      skills: [
        { name: "Figma", rating: 5 },
        { name: "Adobe XD", rating: 4 },
        { name: "UI Design", rating: 5 },
        { name: "UX Research", rating: 4 },
      ],
      education: "Đại học FPT",
      experience: "4 năm",
      overallNotes: "Ứng viên có portfolio ấn tượng và kỹ năng thiết kế xuất sắc.",
    },
  ];
  
  export const mockInterviews = [
    {
      id: 1,
      jobId: 1, // Frontend Developer
      applicantId: 1,
      roundId: 1,
      date: new Date("2025-05-15T10:00:00"),
      type: "Online",
      platform: "Google Meet",
      link: "https://meet.google.com/abc-defg-hij",
      status: "Đã hoàn thành",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y"],
      notes: "Ứng viên có kiến thức tốt về React và JavaScript",
      evaluation: {
        result: "Đạt",
        strengths: "Kiến thức chuyên môn tốt, giao tiếp tốt",
        weaknesses: "Cần cải thiện về kiến thức về state management",
        comments: "Nên mời vào vòng phỏng vấn tiếp theo",
      },
    },
    {
      id: 2,
      jobId: 1, // Frontend Developer
      applicantId: 2,
      roundId: 1,
      date: new Date("2025-05-16T14:00:00"),
      type: "Online",
      platform: "Zoom",
      link: "https://zoom.us/j/123456789",
      status: "Đã hoàn thành",
      interviewers: ["Lê Văn Z", "Phạm Thị W"],
      notes: "Ứng viên còn thiếu kinh nghiệm thực tế",
      evaluation: {
        result: "Không đạt", // Changed to Không Đạt to demonstrate the styling
        strengths: "Thái độ tốt, chăm chỉ",
        weaknesses: "Kiến thức kỹ thuật còn hạn chế",
        comments: "Chưa đủ kinh nghiệm cho vị trí này",
      },
    },
    {
      id: 3,
      jobId: 1, // Frontend Developer
      applicantId: 3,
      roundId: 1,
      date: new Date("2025-05-16T14:00:00"),
      type: "Online",
      platform: "Zoom",
      link: "https://zoom.us/j/123456789",
      status: "Đã hoàn thành",
      interviewers: ["Lê Văn Z", "Phạm Thị W"],
      notes: "Ứng viên còn thiếu kinh nghiệm thực tế",
      evaluation: {
        result: "Không đạt",
        strengths: "Thái độ tốt, chăm chỉ",
        weaknesses: "Kiến thức kỹ thuật còn hạn chế",
        comments: "Chưa đủ kinh nghiệm cho vị trí này",
      },
    },
    {
      id: 4,
      jobId: 2, // Backend Developer
      applicantId: 4,
      roundId: 1,
      date: new Date("2025-05-17T09:00:00"),
      type: "Online",
      platform: "Google Meet",
      link: "https://meet.google.com/xyz-123-abc",
      status: "Đã xác nhận",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y"],
      notes: "Phỏng vấn về kinh nghiệm làm việc với microservices",
      evaluation: null,
    },
    {
      id: 5,
      jobId: 2, // Backend Developer
      applicantId: 5,
      roundId: 1,
      date: new Date("2025-05-17T09:00:00"),
      type: "Offline",
      location: "Văn phòng công ty - Tầng 5",
      status: "Đã hoàn thành",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y"],
      notes: "Ứng viên có kinh nghiệm tốt với Node.js và MongoDB",
      evaluation: {
        result: "Đạt",
        strengths: "Kiến thức chuyên môn tốt, giao tiếp tốt",
        weaknesses: "Cần cải thiện về kiến thức DevOps",
        comments: "Nên mời vào vòng phỏng vấn tiếp theo",
      },
    },
    {
      id: 6,
      jobId: 2, // Backend Developer
      applicantId: 5,
      roundId: 2,
      date: new Date("2025-05-20T10:00:00"),
      type: "Online",
      platform: "Microsoft Teams",
      link: "https://teams.microsoft.com/l/meetup-join/...",
      status: "Đã xác nhận",
      interviewers: ["Lê Văn Z", "Phạm Thị W"],
      notes: "Phỏng vấn chuyên sâu về kiến trúc backend",
      evaluation: null,
    },
    {
      id: 7,
      jobId: 3, // UI/UX Designer
      applicantId: 6,
      roundId: 1,
      date: new Date("2025-05-18T11:00:00"),
      type: "Online",
      platform: "Google Meet",
      link: "https://meet.google.com/abc-defg-hij",
      status: "Đã hoàn thành",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y"],
      notes: "Ứng viên có portfolio ấn tượng",
      evaluation: {
        result: "Đạt",
        strengths: "Kỹ năng thiết kế tốt, portfolio đa dạng",
        weaknesses: "Cần cải thiện về UX research",
        comments: "Nên mời vào vòng phỏng vấn tiếp theo",
      },
    },
    {
      id: 8,
      jobId: 3, // UI/UX Designer
      applicantId: 6,
      roundId: 2,
      date: new Date("2025-05-22T14:00:00"),
      type: "Offline",
      location: "Văn phòng công ty - Tầng 5",
      status: "Chờ xác nhận",
      interviewers: ["Lê Văn Z", "Phạm Thị W"],
      notes: "Thuyết trình case study thiết kế",
      evaluation: null,
    },
    {
      id: 9,
      jobId: 3, // UI/UX Designer
      applicantId: 7,
      roundId: 1,
      date: new Date("2025-05-19T09:00:00"),
      type: "Online",
      platform: "Zoom",
      link: "https://zoom.us/j/123456789",
      status: "Đã hoàn thành",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y"],
      notes: "Ứng viên có portfolio ấn tượng",
      evaluation: {
        result: "Đạt",
        strengths: "Kỹ năng thiết kế xuất sắc, portfolio đa dạng",
        weaknesses: "Không có",
        comments: "Nên mời vào vòng phỏng vấn tiếp theo",
      },
    },
    {
      id: 10,
      jobId: 3, // UI/UX Designer
      applicantId: 7,
      roundId: 2,
      date: new Date("2025-05-21T10:00:00"),
      type: "Offline",
      location: "Văn phòng công ty - Tầng 5",
      status: "Đã hoàn thành",
      interviewers: ["Lê Văn Z", "Phạm Thị W"],
      notes: "Thuyết trình case study thiết kế",
      evaluation: {
        result: "Đạt",
        strengths: "Kỹ năng thuyết trình tốt, giải pháp sáng tạo",
        weaknesses: "Không có",
        comments: "Nên mời vào vòng phỏng vấn cuối cùng",
      },
    },
    {
      id: 11,
      jobId: 3, // UI/UX Designer
      applicantId: 7,
      roundId: 3,
      date: new Date("2025-05-25T14:00:00"),
      type: "Offline",
      location: "Văn phòng công ty - Tầng 5",
      status: "Đã xác nhận",
      interviewers: ["Nguyễn Văn X", "Trần Thị Y", "Lê Văn Z"],
      notes: "Phỏng vấn với Design Lead",
      evaluation: null,
    },
  ];
  
  export const emailTemplates = {
    interviewInvitation: (applicantName, jobTitle, date, type, location) => `
      Kính gửi ${applicantName},
  
      Chúng tôi xin mời bạn tham gia buổi phỏng vấn cho vị trí ${jobTitle}.
  
      Thời gian: ${date}
      Hình thức: ${type}
      ${type === "Online" ? "Link: " + location : "Địa điểm: " + location}
  
      Vui lòng xác nhận tham gia bằng cách trả lời email này.
  
      Trân trọng,
      Phòng Nhân sự
    `,
    interviewRejection: (applicantName, jobTitle) => `
      Kính gửi ${applicantName},
  
      Cảm ơn bạn đã tham gia buổi phỏng vấn cho vị trí ${jobTitle}.
  
      Sau khi cân nhắc kỹ lưỡng, chúng tôi rất tiếc phải thông báo rằng hồ sơ của bạn chưa phù hợp với vị trí này tại thời điểm hiện tại.
  
      Chúng tôi đánh giá cao sự quan tâm của bạn và khuyến khích bạn tiếp tục theo dõi các cơ hội khác tại công ty chúng tôi trong tương lai.
  
      Trân trọng,
      Phòng Nhân sự
    `,
    nextRoundInvitation: (applicantName, jobTitle, roundName) => `
      Kính gửi ${applicantName},
  
      Chúc mừng! Bạn đã vượt qua vòng phỏng vấn trước đó cho vị trí ${jobTitle}.
  
      Chúng tôi muốn mời bạn tham gia ${roundName}.
  
      Chúng tôi sẽ liên hệ với bạn sớm để sắp xếp lịch phỏng vấn.
  
      Trân trọng,
      Phòng Nhân sự
    `,
  };