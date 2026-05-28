import { Scenario } from '../types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'university',
    name: 'University Course Enrollment',
    iconName: 'GraduationCap',
    description: 'Track students, the courses they take, the course instructors, and the grades they receive. Explores composite keys, partial key dependencies, and employee-office transitive dependencies.',
    steps: {
      UNF: {
        form: 'UNF',
        title: 'Unnormalized Form (UNF)',
        description: 'Contains non-atomic values (comma-separated lists in a single cell) and nested repeating groups. A complete mess of data!',
        explanation: 'In this unnormalized database table, look at the "Enrolled Courses" and "Grades" columns. They contain comma-separated entries, meaning individual cells contain multiple distinct values (non-atomic attributes). We have no clear, clean primary key, and changing or inserting anything requires duplicating student and course info.',
        tables: [
          {
            id: 'unf_students',
            name: 'Student_Course_Master',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'NONE', role: 'normal', description: 'Student registration ID' },
              { name: 'student_name', label: 'Student Name', keyType: 'NONE', role: 'normal' },
              { name: 'student_email', label: 'Student Email', keyType: 'NONE', role: 'normal' },
              { name: 'courses', label: 'Enrolled Courses (Non-Atomic)', keyType: 'NONE', role: 'multi', description: 'List of course codes and titles' },
              { name: 'grades', label: 'Grades (Non-Atomic)', keyType: 'NONE', role: 'multi', description: 'Matching list of grades' },
              { name: 'instructors', label: 'Instructors (Non-Atomic)', keyType: 'NONE', role: 'multi', description: 'Instructor name and office' }
            ],
            rows: [
              {
                student_id: 'S101',
                student_name: 'Alex Rivera',
                student_email: 'alex@edu.com',
                courses: 'CS-101 (Intro to CS), MATH-201 (Calculus)',
                grades: 'A, B+',
                instructors: 'Dr. Evelyn (Room 401), Prof. Chen (Room 102)'
              },
              {
                student_id: 'S102',
                student_name: 'Jordan Finch',
                student_email: 'jordan@edu.com',
                courses: 'CS-101 (Intro to CS), PHYS-102 (Physics)',
                grades: 'B, A-',
                instructors: 'Dr. Evelyn (Room 401), Dr. Malik (Room 304)'
              },
              {
                student_id: 'S103',
                student_name: 'Taylor Morse',
                student_email: 'taylor@edu.com',
                courses: 'MATH-201 (Calculus)',
                grades: 'A',
                instructors: 'Prof. Chen (Room 102)'
              }
            ],
            functionalDependencies: [
              'No clean primary key established.',
              'Complex multi-valued mapping: Student_ID -> Multiple Courses'
            ],
            issues: [
              { type: 'error', message: 'Violates 1NF: Non-atomic columns', details: '"Enrolled Courses", "Grades", and "Instructors" columns contain comma-separated lists instead of single, atomic values.' },
              { type: 'error', message: 'High Redundancy', details: 'If a student takes 10 courses, student details (name, email) would either be squashed in comma-separated strings or duplicated across rows.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: false, explanation: 'Columns like "courses" hold lists of strings.' },
          { rule: 'Table has a defined Primary Key', passed: false, explanation: 'We cannot uniquely identify any course-grade mapping with just student_id.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: false, explanation: 'Not applicable prior to 1NF.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Not applicable prior to 1NF.' }
        ]
      },
      '1NF': {
        form: '1NF',
        title: 'First Normal Form (1NF)',
        description: 'Multi-valued groupings are split into separate rows. All values are now atomic, and a Composite Primary Key is established!',
        explanation: 'We have flattened the lists. Every cell now has a single (atomic) value. To uniquely identify a row, we must introduce a COMPOSITE PRIMARY KEY made of two parts: (Student ID + Course Code). However, notice how student names and emails are heavily duplicated. Also, we cannot add a new course without enrolling a student, otherwise the PK is empty!',
        tables: [
          {
            id: 'unf_flat_master',
            name: 'Flat_Student_Enrollment_Master',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'COMPOSITE_PK', role: 'normal', description: 'Composite Key Part A' },
              { name: 'student_name', label: 'Student Name', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Student ID (Partial Dependency)' },
              { name: 'student_email', label: 'Student Email', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Student ID (Partial Dependency)' },
              { name: 'course_code', label: 'Course Code', keyType: 'COMPOSITE_PK', role: 'normal', description: 'Composite Key Part B' },
              { name: 'course_title', label: 'Course Title', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Course Code (Partial Dependency)' },
              { name: 'grade', label: 'Grade', keyType: 'NONE', role: 'normal', description: 'Fully depends on (Student ID + Course Code)' },
              { name: 'instructor_name', label: 'Instructor Name', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Course Code (Partial Dependency)' },
              { name: 'instructor_office', label: 'Instructor Office', keyType: 'NONE', role: 'partial_dep', description: 'Transitively depends on Course Code via Instructor Name' }
            ],
            rows: [
              { student_id: 'S101', student_name: 'Alex Rivera', student_email: 'alex@edu.com', course_code: 'CS-101', course_title: 'Intro to CS', grade: 'A', instructor_name: 'Dr. Evelyn', instructor_office: 'Room 401' },
              { student_id: 'S101', student_name: 'Alex Rivera', student_email: 'alex@edu.com', course_code: 'MATH-201', course_title: 'Calculus', grade: 'B+', instructor_name: 'Prof. Chen', instructor_office: 'Room 102' },
              { student_id: 'S102', student_name: 'Jordan Finch', student_email: 'jordan@edu.com', course_code: 'CS-101', course_title: 'Intro to CS', grade: 'B', instructor_name: 'Dr. Evelyn', instructor_office: 'Room 401' },
              { student_id: 'S102', student_name: 'Jordan Finch', student_email: 'jordan@edu.com', course_code: 'PHYS-102', course_title: 'Physics', grade: 'A-', instructor_name: 'Dr. Malik', instructor_office: 'Room 304' },
              { student_id: 'S103', student_name: 'Taylor Morse', student_email: 'taylor@edu.com', course_code: 'MATH-201', course_title: 'Calculus', grade: 'A', instructor_name: 'Prof. Chen', instructor_office: 'Room 102' }
            ],
            functionalDependencies: [
              'Primary Key: (student_id, course_code)',
              'student_name, student_email -> depends only on student_id (PARTIAL DEPENDENCY)',
              'course_title, instructor_name -> depends only on course_code (PARTIAL DEPENDENCY)',
              'grade -> depends fully on (student_id, course_code) (VALID)'
            ],
            issues: [
              { type: 'warning', message: 'Violates 2NF: Partial Dependencies', details: 'Non-key attributes depend on only parts of the composite primary key. E.g., student_name depends only on student_id, NOT on course_code; course_title depends only on course_code.' },
              { type: 'error', message: 'Insertion Anomaly', details: 'You cannot add a new course (e.g. CS-202) to the database until at least one student registers for it, because "student_id" is part of the primary key and cannot be NULL.' },
              { type: 'error', message: 'Deletion Anomaly', details: 'If student S103 cancels their single enrollment, we lose the fact that a course "MATH-201" exists and that Prof. Chen is the instructor.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Successfully flattened list into atomic individual rows.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Established Composite PK: (Student ID + Course Code).' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: false, explanation: 'Failed: columns like "Student Name" depend on only half the key (Student ID).' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Failed: "Instructor Office" depends on "Instructor Name" which depends on "Course Code".' }
        ]
      },
      '2NF': {
        form: '2NF',
        title: 'Second Normal Form (2NF)',
        description: 'No Partial Dependencies! Tables are split so that every non-key column depends on the ENTIRE primary key of its table.',
        explanation: 'We have solved the partial dependencies by splitting the master table into three separate tables: Students (keyed by Student ID), Courses (keyed by Course Code), and a clean junction table Enrollments (keyed by Student ID + Course Code). No student details are duplicated now! However, in the Courses table, Instructor Office depends on Instructor Name, which isn\'t a key. This is a Transitive Dependency!',
        tables: [
          {
            id: 'students_2nf',
            name: 'Students',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'PK', role: 'normal' },
              { name: 'student_name', label: 'Student Name', keyType: 'NONE', role: 'normal' },
              { name: 'student_email', label: 'Student Email', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { student_id: 'S101', student_name: 'Alex Rivera', student_email: 'alex@edu.com' },
              { student_id: 'S102', student_name: 'Jordan Finch', student_email: 'jordan@edu.com' },
              { student_id: 'S103', student_name: 'Taylor Morse', student_email: 'taylor@edu.com' }
            ],
            functionalDependencies: [
              'student_id (PK) -> student_name, student_email'
            ],
            issues: [
              { type: 'success', message: 'Fully 2NF Compliant Table', details: 'All column values depend entirely on the Student ID primary key.' }
            ]
          },
          {
            id: 'enrollments_2nf',
            name: 'Enrollments (Junction Table)',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'FK', role: 'normal' },
              { name: 'course_code', label: 'Course Code', keyType: 'FK', role: 'normal' },
              { name: 'grade', label: 'Grade', keyType: 'NONE', role: 'normal', description: 'Depends fully on BOTH student_id AND course_code' }
            ],
            rows: [
              { student_id: 'S101', course_code: 'CS-101', grade: 'A' },
              { student_id: 'S101', course_code: 'MATH-201', grade: 'B+' },
              { student_id: 'S102', course_code: 'CS-101', grade: 'B' },
              { student_id: 'S102', course_code: 'PHYS-102', grade: 'A-' },
              { student_id: 'S103', course_code: 'MATH-201', grade: 'A' }
            ],
            functionalDependencies: [
              'Composite Key: (student_id, course_code)',
              'grade -> depends fully on key (VALID)'
            ],
            issues: [
              { type: 'success', message: 'No Partial Dependencies', details: 'The grade depends on BOTH which student and which course.' }
            ]
          },
          {
            id: 'courses_2nf',
            name: 'Courses_With_Instructors',
            columns: [
              { name: 'course_code', label: 'Course Code', keyType: 'PK', role: 'normal' },
              { name: 'course_title', label: 'Course Title', keyType: 'NONE', role: 'normal' },
              { name: 'instructor_name', label: 'Instructor Name', keyType: 'NONE', role: 'normal' },
              { name: 'instructor_office', label: 'Instructor Office', keyType: 'NONE', role: 'transitive_dep', description: 'Depends on Instructor Name (Transitive Dependency)' }
            ],
            rows: [
              { course_code: 'CS-101', course_title: 'Intro to CS', instructor_name: 'Dr. Evelyn', instructor_office: 'Room 401' },
              { course_code: 'MATH-201', course_title: 'Calculus', instructor_name: 'Prof. Chen', instructor_office: 'Room 102' },
              { course_code: 'PHYS-102', course_title: 'Physics', instructor_name: 'Dr. Malik', instructor_office: 'Room 304' }
            ],
            functionalDependencies: [
              'course_code (PK) -> course_title, instructor_name',
              'instructor_name -> instructor_office  (TRANSITIVE DEPENDENCY)'
            ],
            issues: [
              { type: 'warning', message: 'Violates 3NF: Transitive Dependency', details: 'The instructor_office is determined by the instructor_name, which is then determined by the course_code. Thus, (course_code -> instructor_name -> instructor_office). This is a transitive dependency.' },
              { type: 'error', message: 'Update Anomaly', details: 'If Dr. Evelyn moves to Room 505, we have to update multiple rows in this table if she taught multiple courses, risking inconsistent data.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Correct.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Each of the three tables has a valid key.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: true, explanation: 'All single-attribute tables are automatically in 2NF, and the composite table is fully dependent.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Failed: in Courses table, course_code -> instructor_name -> instructor_office.' }
        ]
      },
      '3NF': {
        form: '3NF',
        title: 'Third Normal Form (3NF)',
        description: 'No Transitive Dependencies! Non-key columns depend ONLY on the primary key, directly and immediately.',
        explanation: 'We have reached database nirvana! The transitive dependency has been eliminated by splitting the Courses table into: Courses and Instructors. The Courses table now links to Instructor ID via a foreign key. We can update an instructor\'s office once in the Instructors table, and it immediately reflects correctly across all their courses with zero anomalies.',
        tables: [
          {
            id: 'students_3nf',
            name: 'Students',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'PK', role: 'normal' },
              { name: 'student_name', label: 'Student Name', keyType: 'NONE', role: 'normal' },
              { name: 'student_email', label: 'Student Email', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { student_id: 'S101', student_name: 'Alex Rivera', student_email: 'alex@edu.com' },
              { student_id: 'S102', student_name: 'Jordan Finch', student_email: 'jordan@edu.com' },
              { student_id: 'S103', student_name: 'Taylor Morse', student_email: 'taylor@edu.com' }
            ],
            functionalDependencies: ['student_id -> student_name, student_email'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'No redundancies or anomalies.' }]
          },
          {
            id: 'enrollments_3nf',
            name: 'Enrollments',
            columns: [
              { name: 'student_id', label: 'Student ID', keyType: 'FK', role: 'normal' },
              { name: 'course_code', label: 'Course Code', keyType: 'FK', role: 'normal' },
              { name: 'grade', label: 'Grade', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { student_id: 'S101', course_code: 'CS-101', grade: 'A' },
              { student_id: 'S101', course_code: 'MATH-201', grade: 'B+' },
              { student_id: 'S102', course_code: 'CS-101', grade: 'B' },
              { student_id: 'S102', course_code: 'PHYS-102', grade: 'A-' },
              { student_id: 'S103', course_code: 'MATH-201', grade: 'A' }
            ],
            functionalDependencies: ['(student_id, course_code) -> grade'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'No redundancies or anomalies.' }]
          },
          {
            id: 'courses_3nf',
            name: 'Courses',
            columns: [
              { name: 'course_code', label: 'Course Code', keyType: 'PK', role: 'normal' },
              { name: 'course_title', label: 'Course Title', keyType: 'NONE', role: 'normal' },
              { name: 'instructor_id', label: 'Instructor ID', keyType: 'FK', role: 'normal', description: 'Foreign Key to Instructors table' }
            ],
            rows: [
              { course_code: 'CS-101', course_title: 'Intro to CS', instructor_id: 'I01' },
              { course_code: 'MATH-201', course_title: 'Calculus', instructor_id: 'I02' },
              { course_code: 'PHYS-102', course_title: 'Physics', instructor_id: 'I03' }
            ],
            functionalDependencies: [
              'course_code -> course_title, instructor_id'
            ],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'No redundancies or anomalies.' }]
          },
          {
            id: 'instructors_3nf',
            name: 'Instructors',
            columns: [
              { name: 'instructor_id', label: 'Instructor ID', keyType: 'PK', role: 'normal' },
              { name: 'instructor_name', label: 'Instructor Name', keyType: 'NONE', role: 'normal' },
              { name: 'instructor_office', label: 'Instructor Office', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { instructor_id: 'I01', instructor_name: 'Dr. Evelyn', instructor_office: 'Room 401' },
              { instructor_id: 'I02', instructor_name: 'Prof. Chen', instructor_office: 'Room 102' },
              { instructor_id: 'I03', instructor_name: 'Dr. Malik', instructor_office: 'Room 304' }
            ],
            functionalDependencies: [
              'instructor_id -> instructor_name, instructor_office'
            ],
            issues: [
              { type: 'success', message: 'Fully 3NF Compliant Table', details: 'Everything depends entirely and directly on the Instructor ID primary key. Perfect!' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Correct.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Correct.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: true, explanation: 'Correct.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: true, explanation: 'Correct! Transitive dependencies are split into the Instructors table. Every column depends ONLY on the Primary Key.' }
        ]
      }
    }
  },
  {
    id: 'orders',
    name: 'E-commerce Order Receipt',
    iconName: 'ShoppingCart',
    description: 'Track orders, line items, customers, product brands, and brand support phone lines. Deals with purchase headers, product items, and brand transitive relationships.',
    steps: {
      UNF: {
        form: 'UNF',
        title: 'Unnormalized Form (UNF)',
        description: 'Multi-valued items list and customer contacts represent massive blocks of non-atomic attributes.',
        explanation: 'In this retail unnormalized structure, a single row stands for a whole order checkout. The "Items", "Quantities", and "Unit Prices" columns are loaded with multi-valued matrices, causing database engines to choke on query attempts.',
        tables: [
          {
            id: 'unf_orders',
            name: 'Store_Order_Master',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'NONE', role: 'normal' },
              { name: 'order_date', label: 'Order Date', keyType: 'NONE', role: 'normal' },
              { name: 'customer', label: 'Customer Detail', keyType: 'NONE', role: 'normal' },
              { name: 'items', label: 'Purchased Items (Non-Atomic)', keyType: 'NONE', role: 'multi' },
              { name: 'qty', label: 'Quantities (Non-Atomic)', keyType: 'NONE', role: 'multi' },
              { name: 'prices', label: 'Unit Prices (Non-Atomic)', keyType: 'NONE', role: 'multi' },
              { name: 'brand_contacts', label: 'Brands & Support Contacts (Non-Atomic)', keyType: 'NONE', role: 'multi' }
            ],
            rows: [
              {
                order_id: 'O-2001',
                order_date: '2026-05-15',
                customer: 'Sarah Connor (SF, CA)',
                items: 'ErgoMouse, MechKeyboard',
                qty: '1, 2',
                prices: '$50, $120',
                brand_contacts: 'Logitech (800-LOGI), Keychron (800-KEYS)'
              },
              {
                order_id: 'O-2002',
                order_date: '2026-05-16',
                customer: 'Bruce Wayne (Gotham)',
                items: 'GrappleHook, MechKeyboard',
                qty: '5, 1',
                prices: '$500, $120',
                brand_contacts: 'WayneCorp (800-BAT), Keychron (800-KEYS)'
              }
            ],
            functionalDependencies: [
              'No atomic unique constraints.',
              'Items can expand infinitely in text formats: order_id -> Lists of data.'
            ],
            issues: [
              { type: 'error', message: 'Violates 1NF: Multiple item lists in single cells', details: 'Items, Quantities, Unit Prices, and Brand Contacts are un-queryable lists.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: false, explanation: 'Fails due to comma-delimited item list columns.' },
          { rule: 'Table has a defined Primary Key', passed: false, explanation: 'Order ID cannot index individual lines cleanly.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: false, explanation: 'Not applicable.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Not applicable.' }
        ]
      },
      '1NF': {
        form: '1NF',
        title: 'First Normal Form (1NF)',
        description: 'Rows are exploded so that each item purchased gets its own clean row, establishing structural atomicity.',
        explanation: 'We have flattened the lists. Every row is now an individual item enrollment within an order. Composite primary key is defined as: (Order ID + Product ID). However, look at Customer Name, Cust Location! They are duplicated whenever a customer buys multiple items.',
        tables: [
          {
            id: 'flat_orders_1nf',
            name: 'Flat_Ecom_Order_Master',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'COMPOSITE_PK', role: 'normal' },
              { name: 'order_date', label: 'Order Date', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Order ID (Partial Dependency)' },
              { name: 'cust_name', label: 'Cust Name', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Order ID (Partial Dependency)' },
              { name: 'cust_city', label: 'Cust City', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Order ID (Partial Dependency)' },
              { name: 'product_id', label: 'Product ID', keyType: 'COMPOSITE_PK', role: 'normal' },
              { name: 'product_name', label: 'Product Name', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Product ID (Partial Dependency)' },
              { name: 'product_price', label: 'Unit Price', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Product ID (Partial Dependency)' },
              { name: 'quantity', label: 'Qty Purchased', keyType: 'NONE', role: 'normal', description: 'Depends fully on BOTH Order ID and Product ID' },
              { name: 'brand_name', label: 'Brand Name', keyType: 'NONE', role: 'partial_dep', description: 'Depends ONLY on Product ID' },
              { name: 'brand_support', label: 'Brand Support Tel', keyType: 'NONE', role: 'partial_dep', description: 'Transitively depends on Product ID via Brand Name' }
            ],
            rows: [
              { order_id: 'O-2001', order_date: '2026-05-15', cust_name: 'Sarah Connor', cust_city: 'SF, CA', product_id: 'P10', product_name: 'ErgoMouse', product_price: '$50', quantity: 1, brand_name: 'Logitech', brand_support: '800-LOGI' },
              { order_id: 'O-2001', order_date: '2026-05-15', cust_name: 'Sarah Connor', cust_city: 'SF, CA', product_id: 'P11', product_name: 'MechKeyboard', product_price: '$120', quantity: 2, brand_name: 'Keychron', brand_support: '800-KEYS' },
              { order_id: 'O-2002', order_date: '2026-05-16', cust_name: 'Bruce Wayne', cust_city: 'Gotham', product_id: 'P12', product_name: 'GrappleHook', product_price: '$500', quantity: 5, brand_name: 'WayneCorp', brand_support: '800-BAT' },
              { order_id: 'O-2002', order_date: '2026-05-16', cust_name: 'Bruce Wayne', cust_city: 'Gotham', product_id: 'P11', product_name: 'MechKeyboard', product_price: '$120', quantity: 1, brand_name: 'Keychron', brand_support: '800-KEYS' }
            ],
            functionalDependencies: [
              'Primary Key: (order_id, product_id)',
              'order_date, cust_name, cust_city -> depends ONLY on order_id (PARTIAL DEPENDENCY)',
              'product_name, product_price, brand_name -> depends ONLY on product_id (PARTIAL DEPENDENCY)',
              'quantity -> depends on (order_id, product_id)'
            ],
            issues: [
              { type: 'warning', message: 'Violates 2NF: Partial Dependencies', details: 'The customer, order date, and product properties do not require the composite key. We are force-duplicating customer strings across multi-item bills.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Satisfies atomicity requirement.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Composite key defined successfully.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: false, explanation: 'Fails because order_date and product_price depend on parts of the primary key.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Fails: brand_support depends on brand_name, which is non-prime.' }
        ]
      },
      '2NF': {
        form: '2NF',
        title: 'Second Normal Form (2NF)',
        description: 'Extracted partial dependencies. Orders and Products now live in their own dedicated tables, with an Order_Items junction table.',
        explanation: 'With 2NF, we split the master table. Database orders are recorded cleanly. However, look at the Products table: Brand Support Telephone depends on the Brand Name, which itself depends on Product ID. This is a transitive dependency! (Product_ID -> Brand_Name -> Brand_Support).',
        tables: [
          {
            id: 'orders_2nf',
            name: 'Orders',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'PK', role: 'normal' },
              { name: 'order_date', label: 'Order Date', keyType: 'NONE', role: 'normal' },
              { name: 'cust_name', label: 'Cust Name', keyType: 'NONE', role: 'normal' },
              { name: 'cust_city', label: 'Cust City', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { order_id: 'O-2001', order_date: '2026-05-15', cust_name: 'Sarah Connor', cust_city: 'SF, CA' },
              { order_id: 'O-2002', order_date: '2026-05-16', cust_name: 'Bruce Wayne', cust_city: 'Gotham' }
            ],
            functionalDependencies: ['order_id -> order_date, cust_name, cust_city'],
            issues: [{ type: 'success', message: 'No anomalies for Order master headers', details: 'This table has single-argument PK and is in 2NF.' }]
          },
          {
            id: 'order_items_2nf',
            name: 'Order_Items',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'FK', role: 'normal' },
              { name: 'product_id', label: 'Product ID', keyType: 'FK', role: 'normal' },
              { name: 'quantity', label: 'Quantity', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { order_id: 'O-2001', product_id: 'P10', quantity: 1 },
              { order_id: 'O-2001', product_id: 'P11', quantity: 2 },
              { order_id: 'O-2002', product_id: 'P12', quantity: 5 },
              { order_id: 'O-2002', product_id: 'P11', quantity: 1 }
            ],
            functionalDependencies: ['(order_id, product_id) -> quantity'],
            issues: [{ type: 'success', message: 'Junction behaves well', details: 'Clean quantity mappings.' }]
          },
          {
            id: 'products_2nf',
            name: 'Products_With_Brands',
            columns: [
              { name: 'product_id', label: 'Product ID', keyType: 'PK', role: 'normal' },
              { name: 'product_name', label: 'Product Name', keyType: 'NONE', role: 'normal' },
              { name: 'product_price', label: 'Unit Price', keyType: 'NONE', role: 'normal' },
              { name: 'brand_name', label: 'Brand Name', keyType: 'NONE', role: 'normal' },
              { name: 'brand_support', label: 'Brand Support', keyType: 'NONE', role: 'transitive_dep', description: 'Depends on Brand Name (Transitive Dependency)' }
            ],
            rows: [
              { product_id: 'P10', product_name: 'ErgoMouse', product_price: '$50', brand_name: 'Logitech', brand_support: '800-LOGI' },
              { product_id: 'P11', product_name: 'MechKeyboard', product_price: '$120', brand_name: 'Keychron', brand_support: '800-KEYS' },
              { product_id: 'P12', product_name: 'GrappleHook', product_price: '$500', brand_name: 'WayneCorp', brand_support: '800-BAT' }
            ],
            functionalDependencies: [
              'product_id -> product_name, product_price, brand_name',
              'brand_name -> brand_support (TRANSITIVE DEP)'
            ],
            issues: [
              { type: 'warning', message: 'Violates 3NF: Transitive Dependency', details: 'Brand support numbers are linked to the brand name, not uniquely to a specific physical product. Multiple Logitech products would repeat the same support number.' }
            ]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Satisfied.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Satisfied.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: true, explanation: 'Satisfied.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: false, explanation: 'Failed: Brand support phone depends on Brand Name which is not a primary key.' }
        ]
      },
      '3NF': {
        form: '3NF',
        title: 'Third Normal Form (3NF)',
        description: 'Transitive brand details are split into a separate Brands lookup table, leaving a clean foreign key relationship.',
        explanation: 'We have broken down the database into four perfectly normalized tables. No transitive dependencies remain. Updates to customer locations or brand numbers occur in a single row in their respective master directories, resolving all insertion, update, and deletion anomalies!',
        tables: [
          {
            id: 'orders_3nf',
            name: 'Orders',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'PK', role: 'normal' },
              { name: 'order_date', label: 'Order Date', keyType: 'NONE', role: 'normal' },
              { name: 'customer_id', label: 'Cust ID', keyType: 'FK', role: 'normal' }
            ],
            rows: [
              { order_id: 'O-2001', order_date: '2026-05-15', customer_id: 'C81' },
              { order_id: 'O-2002', order_date: '2026-05-16', customer_id: 'C82' }
            ],
            functionalDependencies: ['order_id -> order_date, customer_id'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'Clean order headers.' }]
          },
          {
            id: 'customers_3nf',
            name: 'Customers',
            columns: [
              { name: 'customer_id', label: 'Customer ID', keyType: 'PK', role: 'normal' },
              { name: 'cust_name', label: 'Cust Name', keyType: 'NONE', role: 'normal' },
              { name: 'cust_city', label: 'Cust City', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { customer_id: 'C81', cust_name: 'Sarah Connor', cust_city: 'SF, CA' },
              { customer_id: 'C82', cust_name: 'Bruce Wayne', cust_city: 'Gotham' }
            ],
            functionalDependencies: ['customer_id -> cust_name, cust_city'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'Isolated customer directory.' }]
          },
          {
            id: 'order_items_3nf',
            name: 'Order_Items',
            columns: [
              { name: 'order_id', label: 'Order ID', keyType: 'FK', role: 'normal' },
              { name: 'product_id', label: 'Product ID', keyType: 'FK', role: 'normal' },
              { name: 'quantity', label: 'Quantity', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { order_id: 'O-2001', product_id: 'P10', quantity: 1 },
              { order_id: 'O-2001', product_id: 'P11', quantity: 2 },
              { order_id: 'O-2002', product_id: 'P12', quantity: 5 },
              { order_id: 'O-2002', product_id: 'P11', quantity: 1 }
            ],
            functionalDependencies: ['(order_id, product_id) -> quantity'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'Clean junction.' }]
          },
          {
            id: 'products_3nf',
            name: 'Products',
            columns: [
              { name: 'product_id', label: 'Product ID', keyType: 'PK', role: 'normal' },
              { name: 'product_name', label: 'Product Name', keyType: 'NONE', role: 'normal' },
              { name: 'product_price', label: 'Unit Price', keyType: 'NONE', role: 'normal' },
              { name: 'brand_id', label: 'Brand ID', keyType: 'FK', role: 'normal', description: 'Foreign Key to Brands' }
            ],
            rows: [
              { product_id: 'P10', product_name: 'ErgoMouse', product_price: '$50', brand_id: 'B01' },
              { product_id: 'P11', product_name: 'MechKeyboard', product_price: '$120', brand_id: 'B02' },
              { product_id: 'P12', product_name: 'GrappleHook', product_price: '$500', brand_id: 'B03' }
            ],
            functionalDependencies: ['product_id -> product_name, product_price, brand_id'],
            issues: [{ type: 'success', message: 'Fully normalized', details: 'Clean product catalog.' }]
          },
          {
            id: 'brands_3nf',
            name: 'Brands',
            columns: [
              { name: 'brand_id', label: 'Brand ID', keyType: 'PK', role: 'normal' },
              { name: 'brand_name', label: 'Brand Name', keyType: 'NONE', role: 'normal' },
              { name: 'brand_support', label: 'Brand Support Tel', keyType: 'NONE', role: 'normal' }
            ],
            rows: [
              { brand_id: 'B01', brand_name: 'Logitech', brand_support: '800-LOGI' },
              { brand_id: 'B02', brand_name: 'Keychron', brand_support: '800-KEYS' },
              { brand_id: 'B03', brand_name: 'WayneCorp', brand_support: '800-BAT' }
            ],
            functionalDependencies: ['brand_id -> brand_name, brand_support'],
            issues: [{ type: 'success', message: 'Fully normalized 3NF table', details: 'Brand-specific data isolated.' }]
          }
        ],
        rulesChecked: [
          { rule: 'All attribute values are atomic (no repeating lists)', passed: true, explanation: 'Satisfied.' },
          { rule: 'Table has a defined Primary Key', passed: true, explanation: 'Satisfied.' },
          { rule: 'No partial dependencies (Only 2NF+)', passed: true, explanation: 'Satisfied.' },
          { rule: 'No transitive dependencies (Only 3NF+)', passed: true, explanation: 'Satisfied. Split brand support details and customers into their own tables. All queries join efficiently.' }
        ]
      }
    }
  }
];
