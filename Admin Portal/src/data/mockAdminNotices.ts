import type { AdminNotice } from '../types/adminNotice';

export const mockAdminNotices: AdminNotice[] = [
  {
    id: 'admin-notice-1',
    refNo: 'REF-2023-TPO-089',
    title: 'TCS Campus Recruitment Drive 2024 - Important Updates',
    category: 'Placement',
    status: 'Published',
    summary: 'Tata Consultancy Services recruitment drive for 2024 passing out batch. Eligible branches: CS, IT, ENTC. Mandatory portal registration deadline and hall ticket downloading instructions included.',
    issuedBy: 'Prof. S. Kulkarni (TPO)',
    department: 'Training & Placement (TPO)',
    departmentKey: 'tpo',
    date: 'Oct 24, 2023',
    time: '11:42 AM',
    targetAudience: 'BE Final Yr',
    academicYear: 'AY 2023-24',
    isImportant: true,
    actionRequired: true,
    actionDeadline: 'Oct 26, 05:00 PM',
    actionDescription: 'Mandatory student submission required for hall ticket validation.',
    attachments: [
      { name: 'Eligible_List.pdf', size: '1.4 MB', type: 'pdf' },
      { name: 'Drive_Slots.xlsx', size: '480 KB', type: 'excel' }
    ]
  },
  {
    id: 'admin-notice-2',
    refNo: 'EXM-REV-2023-44',
    title: 'Revised End Semester Examination Schedule - Winter 2023',
    category: 'Exam',
    status: 'Published',
    summary: 'Schedule revised due to upcoming state municipal elections. Engineering exams slated between Nov 10 to Nov 15 have been re-allocated to winter slot session 2.',
    issuedBy: 'Controller of Examinations',
    department: 'Exam Cell',
    departmentKey: 'exam',
    date: 'Oct 24, 2023',
    time: '09:15 AM',
    targetAudience: 'All Engineering Students',
    academicYear: 'AY 2023-24',
    isUrgent: true,
    attachments: [
      { name: 'Revised_Timetable_Winter2023.pdf', size: '2.1 MB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-3',
    refNo: 'REG-2023-AFF-12',
    title: 'Mandatory Anti-Ragging Affidavit Submission AY 2023-24',
    category: 'Admin',
    status: 'Published',
    summary: 'All enrolled students must submit signed online anti-ragging affidavit by Friday in compliance with UGC apex directives. Failure may withhold semester hall tickets.',
    issuedBy: 'Registrar Office',
    department: 'Administration',
    departmentKey: 'admin',
    date: 'Oct 23, 2023',
    time: '04:30 PM',
    targetAudience: 'FE, SE, TE, BE',
    academicYear: 'AY 2023-24',
    attachments: [
      { name: 'AntiRagging_Instructions_2023.pdf', size: '820 KB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-4',
    refNo: 'TPO-2023-INF-91',
    title: 'Infosys Mock Technical & HR Interviews Preparation Drive',
    category: 'Placement',
    status: 'Published',
    summary: 'Mock technical interviews conducted by alumni working at Infosys. Slots restricted to first 60 applicants with CGPA 7.0 and above.',
    issuedBy: 'TPO Cell',
    department: 'Training & Placement (TPO)',
    departmentKey: 'tpo',
    date: 'Oct 22, 2023',
    time: '11:15 AM',
    targetAudience: 'TE & BE Students',
    academicYear: 'AY 2023-24',
    actionRequired: false,
    attachments: [
      { name: 'Interview_Evaluation_Rubric.pdf', size: '540 KB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-5',
    refNo: 'CUL-2023-EVT-05',
    title: 'Annual Tech Fest - Innovate 2024 Committee Call',
    category: 'Event',
    status: 'Draft',
    summary: 'Call for student heads and volunteer committees across technical, creative, logistics, and web teams for ICEM\'s flagship symposium.',
    issuedBy: 'Cultural Committee',
    department: 'Computer Engg',
    departmentKey: 'comp',
    date: 'Oct 20, 2023',
    time: '02:10 PM',
    targetAudience: 'All Branch Students',
    academicYear: 'AY 2023-24',
    attachments: [
      { name: 'Innovate2024_Role_Descriptions.pdf', size: '1.1 MB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-6',
    refNo: 'ACAD-2023-77',
    title: 'SPPU In-Sem Evaluation Marks Submission Deadline',
    category: 'Academic',
    status: 'Published',
    summary: 'All faculty members must verify and upload unit test internal evaluation scores to the Savitribai Phule Pune University internal portal.',
    issuedBy: 'Dean Academics',
    department: 'IT',
    departmentKey: 'it',
    date: 'Oct 19, 2023',
    time: '11:00 AM',
    targetAudience: 'Faculty & HODs',
    academicYear: 'AY 2023-24',
    actionRequired: true,
    actionDeadline: 'Oct 28, 12:00 PM',
    actionDescription: 'Internal assessment portal closes automatically.',
    attachments: [
      { name: 'Evaluation_Template_V2.xlsx', size: '320 KB', type: 'excel' }
    ]
  },
  {
    id: 'admin-notice-7',
    refNo: 'LIB-2023-CIRC-08',
    title: 'Central Library National Science Day Book Exhibition',
    category: 'General',
    status: 'Published',
    summary: 'Central Library announces open access week and rare engineering monograph exhibition for students and research scholars in the main reading hall.',
    issuedBy: 'Chief Librarian',
    department: 'Administration',
    departmentKey: 'admin',
    date: 'Oct 18, 2023',
    time: '03:15 PM',
    targetAudience: 'All Students & Staff',
    academicYear: 'AY 2023-24',
    attachments: [
      { name: 'Exhibition_Catalogue.pdf', size: '950 KB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-8',
    refNo: 'EXM-2023-REM-52',
    title: 'Remedial Examination Guidelines for SE & TE Backlog Candidates',
    category: 'Exam',
    status: 'Published',
    summary: 'Guidelines and exam fee submission timelines for second and third year ATKT backlog subjects before final semester examinations.',
    issuedBy: 'Exam Cell Co-ordinator',
    department: 'Exam Cell',
    departmentKey: 'exam',
    date: 'Oct 17, 2023',
    time: '01:30 PM',
    targetAudience: 'SE & TE Students',
    academicYear: 'AY 2023-24',
    attachments: [
      { name: 'Remedial_Form_AY2023-24.pdf', size: '420 KB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-9',
    refNo: 'SPRT-2023-EVT-03',
    title: 'Inter-College Zonal Sports Tournament Trials Announcement',
    category: 'Event',
    status: 'Draft',
    summary: 'Selections for Football, Cricket, Badminton, and Chess teams represent ICEM at Pune University Inter-College Sports meet.',
    issuedBy: 'Director of Physical Education',
    department: 'Administration',
    departmentKey: 'admin',
    date: 'Oct 16, 2023',
    time: '10:00 AM',
    targetAudience: 'All Enrolled Students',
    academicYear: 'AY 2023-24',
    attachments: [
      { name: 'Sports_Trials_Schedule.pdf', size: '640 KB', type: 'pdf' }
    ]
  },
  {
    id: 'admin-notice-10',
    refNo: 'TPO-2023-AMZ-01',
    title: 'Amazon Web Services (AWS) Summer Internship Opportunity 2024',
    category: 'Placement',
    status: 'Published',
    summary: 'Cloud support and software development engineer internships open for 3rd year Computer & IT engineering students. Stipend: 45k/mo.',
    issuedBy: 'Prof. S. Kulkarni (TPO)',
    department: 'Training & Placement (TPO)',
    departmentKey: 'tpo',
    date: 'Oct 15, 2023',
    time: '04:00 PM',
    targetAudience: 'TE (Comp, IT)',
    academicYear: 'AY 2023-24',
    isImportant: true,
    actionRequired: true,
    actionDeadline: 'Oct 25, 11:59 PM',
    actionDescription: 'Submit resume and coding challenge score.',
    attachments: [
      { name: 'AWS_Internship_Brochure.pdf', size: '1.8 MB', type: 'pdf' }
    ]
  }
];