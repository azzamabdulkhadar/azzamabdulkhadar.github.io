// Non-translatable project metadata. Text content (title, description, highlights)
// comes from locale files via i18n keys: projects.ems, projects.taskhive, projects.bloodhub

import taskhiveEvents from '../assets/images/taskHive/eventsScreen.png';
import taskhiveNotes from '../assets/images/taskHive/notesScreen.png';
import taskhiveTasks from '../assets/images/taskHive/tasksScreen.png';

export const projects = [
  {
    id: 'ems',
    i18nKey: 'projects.ems',
    stack: ['Flutter', 'Dart', 'Dio', 'MySQL', 'REST APIs', 'Provider'],
    color: '#7c3aed',
    emoji: '👥',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=500&fit=crop',
    ],
  },
  {
    id: 'taskhive',
    i18nKey: 'projects.taskhive',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Ant Design', 'Multer', 'Mongoose', 'REST APIs'],
    color: '#f59e0b',
    emoji: '📋',
    github: 'https://github.com/Azzam-Abdul-Khadar/TaskHive.git',
    images: [taskhiveEvents, taskhiveNotes, taskhiveTasks],
  },
  {
    id: 'bloodhub',
    i18nKey: 'projects.bloodhub',
    stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'REST APIs', 'Bootstrap'],
    color: '#ef4444',
    emoji: '🩸',
    github: 'https://github.com/Azzam-Abdul-Khadar/BloodHub.git',
    images: [
      'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=500&fit=crop',
      'https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?w=800&h=500&fit=crop',
    ],
  },
];
