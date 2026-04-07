export const questions = [
  // ── MERN - Easy ─────────────────────────────────────────────────────────────
  { id: 1,  topic: 'MERN', level: 'Easy', q: 'What does MERN stand for?', options: ['MongoDB, Express, React, Node', 'MySQL, Express, React, Node', 'MongoDB, Ember, React, Node', 'MongoDB, Express, Redux, Node'], ans: 0 },
  { id: 2,  topic: 'MERN', level: 'Easy', q: 'Which of these is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'], ans: 2 },
  { id: 3,  topic: 'MERN', level: 'Easy', q: 'React is maintained by?', options: ['Google', 'Microsoft', 'Facebook (Meta)', 'Twitter'], ans: 2 },
  { id: 4,  topic: 'MERN', level: 'Easy', q: 'What is JSX?', options: ['A database query language', 'JavaScript XML syntax extension', 'A CSS framework', 'A Node.js module'], ans: 1 },
  { id: 5,  topic: 'MERN', level: 'Easy', q: 'Which hook is used for side effects in React?', options: ['useState', 'useRef', 'useEffect', 'useContext'], ans: 2 },
  { id: 51, topic: 'MERN', level: 'Easy', q: 'What does Node.js use to handle asynchronous operations?', options: ['Threads', 'Event loop', 'Processes', 'Coroutines'], ans: 1 },
  { id: 52, topic: 'MERN', level: 'Easy', q: 'Which command initialises a new Node.js project?', options: ['node init', 'npm start', 'npm init', 'node create'], ans: 2 },
  { id: 53, topic: 'MERN', level: 'Easy', q: 'In React, props are?', options: ['Mutable state values', 'Read-only inputs passed to components', 'CSS class names', 'Database records'], ans: 1 },
  { id: 54, topic: 'MERN', level: 'Easy', q: 'Which HTTP status code means "Not Found"?', options: ['200', '301', '404', '500'], ans: 2 },
  { id: 55, topic: 'MERN', level: 'Easy', q: 'What is Express.js?', options: ['A database', 'A front-end framework', 'A minimal Node.js web framework', 'A testing library'], ans: 2 },

  // ── MERN - Medium ────────────────────────────────────────────────────────────
  { id: 6,  topic: 'MERN', level: 'Medium', q: 'What does the "virtual DOM" in React do?', options: ['Directly updates the browser DOM', 'Stores data in MongoDB', 'Minimizes real DOM updates by diffing', 'Handles HTTP requests'], ans: 2 },
  { id: 7,  topic: 'MERN', level: 'Medium', q: 'Which Express method handles POST requests?', options: ['app.get()', 'app.post()', 'app.put()', 'app.fetch()'], ans: 1 },
  { id: 8,  topic: 'MERN', level: 'Medium', q: 'What is Mongoose?', options: ['A React state manager', 'An ODM for MongoDB', 'A CSS-in-JS library', 'A Node.js HTTP server'], ans: 1 },
  { id: 9,  topic: 'MERN', level: 'Medium', q: 'What does CORS stand for?', options: ['Cross-Origin Resource Sharing', 'Client-Origin Request System', 'Cross-Object Routing Service', 'Content-Origin Response Standard'], ans: 0 },
  { id: 10, topic: 'MERN', level: 'Medium', q: 'Which React hook manages local component state?', options: ['useEffect', 'useReducer', 'useState', 'useMemo'], ans: 2 },
  { id: 56, topic: 'MERN', level: 'Medium', q: 'What does "REST" stand for in REST API?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Resource Endpoint State Transfer', 'Reactive State Transfer'], ans: 1 },
  { id: 57, topic: 'MERN', level: 'Medium', q: 'Which MongoDB method returns all documents in a collection?', options: ['find()', 'get()', 'fetch()', 'select()'], ans: 0 },
  { id: 58, topic: 'MERN', level: 'Medium', q: 'What is the purpose of useCallback in React?', options: ['Fetch data from APIs', 'Memoize a function to avoid re-creation on every render', 'Replace useState', 'Handle form submissions'], ans: 1 },
  { id: 59, topic: 'MERN', level: 'Medium', q: 'Which package is commonly used for password hashing in Node.js?', options: ['crypto-js', 'bcrypt', 'hashlib', 'argon'], ans: 1 },
  { id: 60, topic: 'MERN', level: 'Medium', q: 'What does app.use() do in Express?', options: ['Starts the server', 'Mounts middleware', 'Connects to MongoDB', 'Defines a GET route'], ans: 1 },

  // ── MERN - Hard ──────────────────────────────────────────────────────────────
  { id: 11, topic: 'MERN', level: 'Hard', q: 'What is the purpose of the "key" prop in React lists?', options: ['Styling list items', 'Helping React identify changed items during reconciliation', 'Passing data to child components', 'Triggering re-renders'], ans: 1 },
  { id: 12, topic: 'MERN', level: 'Hard', q: 'In MongoDB, what is an aggregation pipeline?', options: ['A way to connect multiple databases', 'A sequence of stages that process documents', 'A replication strategy', 'A schema validation tool'], ans: 1 },
  { id: 13, topic: 'MERN', level: 'Hard', q: 'What does JWT stand for?', options: ['JavaScript Web Token', 'JSON Web Token', 'Java Web Transfer', 'JSON Web Transfer'], ans: 1 },
  { id: 14, topic: 'MERN', level: 'Hard', q: 'Which Node.js module is used for file system operations?', options: ['http', 'path', 'fs', 'os'], ans: 2 },
  { id: 15, topic: 'MERN', level: 'Hard', q: 'What is middleware in Express.js?', options: ['A database layer', 'Functions that execute during the request-response cycle', 'A React component wrapper', 'A MongoDB schema'], ans: 1 },
  { id: 61, topic: 'MERN', level: 'Hard', q: 'What is React Context used for?', options: ['Styling components', 'Sharing state across the component tree without prop drilling', 'Fetching data', 'Managing routes'], ans: 1 },
  { id: 62, topic: 'MERN', level: 'Hard', q: 'What is the difference between findOne() and find() in Mongoose?', options: ['No difference', 'findOne() returns a single document, find() returns an array', 'find() is faster', 'findOne() returns an array'], ans: 1 },
  { id: 63, topic: 'MERN', level: 'Hard', q: 'What does the spread operator (...) do when used with React state?', options: ['Deletes state', 'Creates a shallow copy to avoid direct mutation', 'Deep clones the state', 'Merges two components'], ans: 1 },
  { id: 64, topic: 'MERN', level: 'Hard', q: 'Which HTTP method is idempotent and used to fully replace a resource?', options: ['POST', 'PATCH', 'PUT', 'DELETE'], ans: 2 },
  { id: 65, topic: 'MERN', level: 'Hard', q: 'What is the Event Emitter pattern in Node.js?', options: ['A CSS animation pattern', 'A pub/sub mechanism for handling async events', 'A database indexing strategy', 'A React rendering pattern'], ans: 1 },

  // ── Android - Easy ───────────────────────────────────────────────────────────
  { id: 16, topic: 'Android', level: 'Easy', q: 'What language is primarily used for Android development?', options: ['Swift', 'Kotlin / Java', 'Dart', 'C#'], ans: 1 },
  { id: 17, topic: 'Android', level: 'Easy', q: 'What file defines an Android app\'s permissions and components?', options: ['build.gradle', 'MainActivity.kt', 'AndroidManifest.xml', 'strings.xml'], ans: 2 },
  { id: 18, topic: 'Android', level: 'Easy', q: 'What is an Activity in Android?', options: ['A background service', 'A single screen with a user interface', 'A database helper', 'A network request'], ans: 1 },
  { id: 19, topic: 'Android', level: 'Easy', q: 'Which IDE is officially recommended for Android development?', options: ['Eclipse', 'IntelliJ IDEA', 'Android Studio', 'VS Code'], ans: 2 },
  { id: 20, topic: 'Android', level: 'Easy', q: 'What is an APK?', options: ['Android Programming Kit', 'Android Package file', 'Application Protocol Key', 'Android Project Kernel'], ans: 1 },
  { id: 71, topic: 'Android', level: 'Easy', q: 'What is a Fragment in Android?', options: ['A full-screen activity', 'A reusable portion of UI within an Activity', 'A background thread', 'A database table'], ans: 1 },
  { id: 72, topic: 'Android', level: 'Easy', q: 'Which layout places children in a single row or column?', options: ['RelativeLayout', 'ConstraintLayout', 'LinearLayout', 'FrameLayout'], ans: 2 },
  { id: 73, topic: 'Android', level: 'Easy', q: 'What is Logcat in Android?', options: ['A crash reporting tool', 'A logging system for viewing app output', 'A UI inspector', 'A build tool'], ans: 1 },
  { id: 74, topic: 'Android', level: 'Easy', q: 'What does SDK stand for?', options: ['Software Design Kit', 'Software Development Kit', 'System Debug Kit', 'Source Development Kit'], ans: 1 },
  { id: 75, topic: 'Android', level: 'Easy', q: 'Which method is called when an Activity becomes visible to the user?', options: ['onCreate()', 'onStart()', 'onResume()', 'onPause()'], ans: 1 },

  // ── Android - Medium ─────────────────────────────────────────────────────────
  { id: 21, topic: 'Android', level: 'Medium', q: 'What is the purpose of RecyclerView?', options: ['Playing videos', 'Efficiently displaying large lists', 'Managing app permissions', 'Handling network calls'], ans: 1 },
  { id: 22, topic: 'Android', level: 'Medium', q: 'What is Jetpack Compose?', options: ['A build tool', 'A modern declarative UI toolkit for Android', 'A dependency injection framework', 'A testing library'], ans: 1 },
  { id: 23, topic: 'Android', level: 'Medium', q: 'Which component runs tasks in the background without a UI?', options: ['Activity', 'Fragment', 'Service', 'BroadcastReceiver'], ans: 2 },
  { id: 24, topic: 'Android', level: 'Medium', q: 'What is the ViewModel used for in Android?', options: ['Rendering UI layouts', 'Storing UI-related data that survives config changes', 'Managing database schemas', 'Handling push notifications'], ans: 1 },
  { id: 25, topic: 'Android', level: 'Medium', q: 'What does Gradle do in an Android project?', options: ['Manages UI layouts', 'Handles build automation and dependency management', 'Stores app data', 'Manages network requests'], ans: 1 },
  { id: 76, topic: 'Android', level: 'Medium', q: 'What is Room in Android Jetpack?', options: ['A UI component', 'An abstraction layer over SQLite for local databases', 'A networking library', 'A layout manager'], ans: 1 },
  { id: 77, topic: 'Android', level: 'Medium', q: 'What is the purpose of an Intent in Android?', options: ['Styling views', 'Messaging object to request an action from another component', 'Storing preferences', 'Drawing on canvas'], ans: 1 },
  { id: 78, topic: 'Android', level: 'Medium', q: 'Which Jetpack library is used for navigation between fragments?', options: ['WorkManager', 'Navigation Component', 'DataStore', 'Paging'], ans: 1 },
  { id: 79, topic: 'Android', level: 'Medium', q: 'What is SharedPreferences used for?', options: ['Storing large files', 'Storing small key-value pairs persistently', 'Network caching', 'UI theming'], ans: 1 },
  { id: 80, topic: 'Android', level: 'Medium', q: 'What does the onPause() lifecycle method indicate?', options: ['App is fully stopped', 'Activity is partially obscured or losing focus', 'App is destroyed', 'Activity is created'], ans: 1 },

  // ── Android - Hard ───────────────────────────────────────────────────────────
  { id: 26, topic: 'Android', level: 'Hard', q: 'What is the difference between Service and IntentService?', options: ['No difference', 'IntentService runs on a worker thread and stops itself', 'Service is deprecated', 'IntentService requires a UI'], ans: 1 },
  { id: 27, topic: 'Android', level: 'Hard', q: 'What is Dependency Injection in Android context?', options: ['Injecting SQL queries', 'Providing dependencies to a class from outside rather than creating them inside', 'A layout inflation technique', 'A Gradle plugin'], ans: 1 },
  { id: 28, topic: 'Android', level: 'Hard', q: 'What is the purpose of LiveData?', options: ['Storing files locally', 'An observable data holder that respects lifecycle', 'A network caching layer', 'A UI animation tool'], ans: 1 },
  { id: 29, topic: 'Android', level: 'Hard', q: 'Which architecture pattern separates UI, business logic, and data?', options: ['MVC only', 'MVVM (Model-View-ViewModel)', 'Singleton', 'Observer only'], ans: 1 },
  { id: 30, topic: 'Android', level: 'Hard', q: 'What is ProGuard used for in Android?', options: ['UI testing', 'Code shrinking, obfuscation, and optimization', 'Push notifications', 'Database migration'], ans: 1 },
  { id: 81, topic: 'Android', level: 'Hard', q: 'What is Coroutine in Kotlin used for in Android?', options: ['UI animations', 'Managing asynchronous tasks in a sequential style', 'Database migrations', 'Layout inflation'], ans: 1 },
  { id: 82, topic: 'Android', level: 'Hard', q: 'What is the difference between MutableLiveData and LiveData?', options: ['No difference', 'MutableLiveData allows setting values; LiveData is read-only externally', 'LiveData is faster', 'MutableLiveData is deprecated'], ans: 1 },
  { id: 83, topic: 'Android', level: 'Hard', q: 'What is WorkManager used for?', options: ['UI transitions', 'Scheduling deferrable background work that must run reliably', 'Real-time data sync', 'Handling touch events'], ans: 1 },
  { id: 84, topic: 'Android', level: 'Hard', q: 'What is the purpose of the @Composable annotation in Jetpack Compose?', options: ['Marks a class as serializable', 'Marks a function as a UI building block', 'Injects dependencies', 'Defines a database entity'], ans: 1 },
  { id: 85, topic: 'Android', level: 'Hard', q: 'What is Hilt in Android?', options: ['A UI testing framework', 'A dependency injection library built on Dagger', 'A navigation library', 'A database ORM'], ans: 1 },
];

export const LEVELS = [
  { name: 'Rookie', min: 0, max: 99, color: '#94a3b8' },
  { name: 'Apprentice', min: 100, max: 249, color: '#22c55e' },
  { name: 'Developer', min: 250, max: 499, color: '#38bdf8' },
  { name: 'Senior Dev', min: 500, max: 799, color: '#a855f7' },
  { name: 'Tech Lead', min: 800, max: 1199, color: '#f59e0b' },
  { name: 'Architect', min: 1200, max: Infinity, color: '#ef4444' },
];

export const POINTS = { Easy: 10, Medium: 20, Hard: 30 };

export function getLevel(points) {
  return LEVELS.find(l => points >= l.min && points <= l.max) || LEVELS[0];
}
