// Non-translatable project metadata. Text content (title, description, highlights)
// comes from locale files via i18n keys: projects.ems, projects.taskhive, projects.bloodhub

// EMS - Mobile App (Flutter)
import emsAdminAttendance from '../assets/images/ems/AdminAttendance.png';
import emsAdminDash from '../assets/images/ems/adminDash.png';
import emsStaffCalendar from '../assets/images/ems/staffCalendar.png';
import emsStaffDash from '../assets/images/ems/staffDash.png';
import emsStaffVacation from '../assets/images/ems/staffVacation.png';

// TaskHive - Web App
import taskhiveEvents from '../assets/images/taskHive/eventsScreen.png';
import taskhiveNotes from '../assets/images/taskHive/notesScreen.png';
import taskhiveTasks from '../assets/images/taskHive/tasksScreen.png';

export const projects = [
  {
    id: 'ems',
    i18nKey: 'projects.ems',
    type: 'mobile', // Flutter mobile app
    stack: ['Flutter', 'Dart', 'Dio', 'MySQL', 'REST APIs', 'Provider', 'Material UI'],
    color: '#7c3aed',
    emoji: '👥',
    images: [emsAdminDash, emsStaffDash, emsAdminAttendance, emsStaffCalendar, emsStaffVacation],
    stores: [
      { label: 'Admin App', url: 'https://play.google.com/store/apps/details?id=com.atmezai.admin.admin' },
      { label: 'Employee App', url: 'https://play.google.com/store/apps/details?id=com.atmezai.employee.atmezai_employee' },
    ],
  },
  {
    id: 'taskhive',
    i18nKey: 'projects.taskhive',
    type: 'web', // React web app
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Ant Design', 'Multer', 'Mongoose', 'REST APIs'],
    color: '#f59e0b',
    emoji: '📋',
    github: 'https://github.com/azzamabdulkhadar/TaskHive.git',
    images: [taskhiveEvents, taskhiveNotes, taskhiveTasks],
  },
  {
    id: 'bloodhub',
    i18nKey: 'projects.bloodhub',
    type: 'web', // React web app
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST APIs', 'Bootstrap'],
    color: '#ef4444',
    emoji: '🩸',
    github: 'https://github.com/azzamabdulkhadar/BloodHub.git',
    images: [
      // Add your BloodHub screenshots to src/assets/images/bloodHud/ folder
      // Recommended: 1280x800px or 1440x900px PNG screenshots
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&h=500&fit=crop',
    ],
  },
];
