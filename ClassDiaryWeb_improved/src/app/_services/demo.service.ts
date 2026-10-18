import { Injectable } from '@angular/core';
import {User} from "../_models/user.model";
import {Student} from "../_models/student.model";
import {Sclass} from "../_models/sclass.model";
import {Subject} from "../_models/subject.model";
import {ImageFile} from "../_models/imagefile.model";
import {Image} from "../_models/image.model";
import {TeacherRegistry} from "../_models/teacherregistry.model";
import {Grades1} from "../_models/grades1.model";
import {Grades2} from "../_models/grades2.model";
import {FinalGrades} from "../_models/finalgrades.model";

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  constructor() { }

  public DEMO_CLASSES: Sclass[] = [
    {
      id: 1,
      year: 2026,
      marking: 'A',
      name: '1A'
    },
    {
      id: 2,
      year: 2026,
      marking: 'B',
      name: '1B'
    },
    {
      id: 3,
      year: 2026,
      marking: 'C',
      name: '1C'
    }
  ];

  public DEMO_STUDENTS: Student[] = [
    {
      id: 1,
      name: 'Student 1',
      birth: new Date('2019-01-15'),
      address: 'Debrecen',
      info: 'Demo student',
      sclass: '1A',
      parents: ['parent1']
    },
    {
      id: 2,
      name: 'Student 2',
      birth: new Date('2019-03-22'),
      address: 'Hajdúböszörmény',
      info: 'Demo student',
      sclass: '1A',
      parents: ['parent1']
    },
    {
      id: 3,
      name: 'Student 3',
      birth: new Date('2019-05-10'),
      address: 'Hajdúszoboszló',
      info: 'Demo student',
      sclass: '1A',
      parents: null
    },
    {
      id: 4,
      name: 'Student 4',
      birth: new Date('2019-02-08'),
      address: 'Debrecen',
      info: 'Demo student',
      sclass: '1B',
      parents: null
    },
    {
      id: 5,
      name: 'Student 5',
      birth: new Date('2019-04-17'),
      address: 'Hajdúböszörmény',
      info: 'Demo student',
      sclass: '1B',
      parents: null
    },
    {
      id: 6,
      name: 'Student 6',
      birth: new Date('2019-06-25'),
      address: 'Hajdúszoboszló',
      info: 'Demo student',
      sclass: '1B',
      parents: null
    },
    {
      id: 7,
      name: 'Student 7',
      birth: new Date('2019-01-30'),
      address: 'Debrecen',
      info: 'Demo student',
      sclass: '1C',
      parents: null
    },
    {
      id: 8,
      name: 'Student 8',
      birth: new Date('2019-07-12'),
      address: 'Hajdúböszörmény',
      info: 'Demo student',
      sclass: '1C',
      parents: null
    },
    {
      id: 9,
      name: 'Student 9',
      birth: new Date('2019-08-19'),
      address: 'Hajdúszoboszló',
      info: 'Demo student',
      sclass: '1C',
      parents: null
    }
  ];

  public DEMO_SUBJECTS: Subject[] = [
    {
      id: 1,
      name: 'Subject 1'
    },
    {
      id: 2,
      name: 'Subject 2'
    },
    {
      id: 3,
      name: 'Subject 3'
    }
  ];

  public DEMO_USERS: User[] = [
    {
      id: 1,
      firstname: 'Visitor',
      lastname: '1',
      email: 'visitor1@example.com',
      username: 'visitor1',
      birth: new Date('1995-03-12'),
      password: 'Demo123',
      userrole: 'ROLE_Visitor',
      sclass: null,
      children: [],
      teacherRegistries: []
    },
    {
      id: 2,
      firstname: 'Parent',
      lastname: '1',
      email: 'parent1@example.com',
      username: 'parent1',
      birth: new Date('1988-06-20'),
      password: 'Demo123',
      userrole: 'ROLE_Parent',
      sclass: null,
      children: ['Student 1', 'Student 2'],
      teacherRegistries: []
    },
    {
      id: 3,
      firstname: 'ClassHead',
      lastname: '1',
      email: 'classhead1@example.com',
      username: 'classhead1',
      birth: new Date('1985-04-15'),
      password: 'Demo123',
      userrole: 'ROLE_ClassHead',
      sclass: '1A',
      children: [],
      teacherRegistries: [
        'classhead1-Subject 1-1A',
        'classhead1-Subject 1-1B',
        'classhead1-Subject 1-1C'
      ]
    },
    {
      id: 4,
      firstname: 'ClassHead',
      lastname: '2',
      email: 'classhead2@example.com',
      username: 'classhead2',
      birth: new Date('1987-09-08'),
      password: 'Demo123',
      userrole: 'ROLE_ClassHead',
      sclass: '1B',
      children: [],
      teacherRegistries: [
        'classhead2-Subject 2-1A',
        'classhead2-Subject 2-1B',
        'classhead2-Subject 2-1C'
      ]
    },
    {
      id: 5,
      firstname: 'ClassHead',
      lastname: '3',
      email: 'classhead3@example.com',
      username: 'classhead3',
      birth: new Date('1990-02-25'),
      password: 'Demo123',
      userrole: 'ROLE_ClassHead',
      sclass: '1C',
      children: [],
      teacherRegistries: [
        'classhead3-Subject 3-1A',
        'classhead3-Subject 3-1B',
        'classhead3-Subject 3-1C'
      ]
    },
    {
      id: 6,
      firstname: 'Admin',
      lastname: '1',
      email: 'admin1@example.com',
      username: 'admin1',
      birth: new Date('1980-11-10'),
      password: 'Demo123',
      userrole: 'ROLE_Admin',
      sclass: null,
      children: [],
      teacherRegistries: []
    },
    {
      id: 7,
      firstname: 'Anonymous',
      lastname: 'Demo',
      email: 'anonymous@example.com',
      username: 'anonymous',
      birth: new Date('2000-01-01'),
      password: 'Anonym123',
      userrole: 'ROLE_Anonymous',
      sclass: null,
      children: [],
      teacherRegistries: []
    }
  ];

  public DEMO_TEACHERREGISTRIES: TeacherRegistry[] = [
    {
      id: 1,
      teacher: 'classhead1',
      subject: 'Subject 1',
      sclass: '1A'
    },
    {
      id: 2,
      teacher: 'classhead1',
      subject: 'Subject 1',
      sclass: '1B'
    },
    {
      id: 3,
      teacher: 'classhead1',
      subject: 'Subject 1',
      sclass: '1C'
    },
    {
      id: 4,
      teacher: 'classhead2',
      subject: 'Subject 2',
      sclass: '1A'
    },
    {
      id: 5,
      teacher: 'classhead2',
      subject: 'Subject 2',
      sclass: '1B'
    },
    {
      id: 6,
      teacher: 'classhead2',
      subject: 'Subject 2',
      sclass: '1C'
    },
    {
      id: 7,
      teacher: 'classhead3',
      subject: 'Subject 3',
      sclass: '1A'
    },
    {
      id: 8,
      teacher: 'classhead3',
      subject: 'Subject 3',
      sclass: '1B'
    },
    {
      id: 9,
      teacher: 'classhead3',
      subject: 'Subject 3',
      sclass: '1C'
    }
  ];

  public DEMO_IMAGEREGISTRIES: ImageFile[] = [
    {
      id: '1',
      filename: 'school1.webp',
      filePath: 'assets/img/school1.webp',
      extension: 'webp'
    },
    {
      id: '2',
      filename: 'school2.webp',
      filePath: 'assets/img/school2.webp',
      extension: 'webp'
    },
    {
      id: '3',
      filename: 'school3.webp',
      filePath: 'assets/img/school3.webp',
      extension: 'webp'
    },
    {
      id: '4',
      filename: 'school4.webp',
      filePath: 'assets/img/school4.webp',
      extension: 'webp'
    },
    {
      id: '5',
      filename: 'school5.webp',
      filePath: 'assets/img/school5.webp',
      extension: 'webp'
    }
  ];

  public DEMO_IMAGES: Image[] = [
    {
      id: '1',
      dataUrl: 'assets/img/school1.webp'
    },
    {
      id: '2',
      dataUrl: 'assets/img/school2.webp'
    },
    {
      id: '3',
      dataUrl: 'assets/img/school3.webp'
    },
    {
      id: '4',
      dataUrl: 'assets/img/school4.webp'
    },
    {
      id: '5',
      dataUrl: 'assets/img/school5.webp'
    }
  ];

  public DEMO_GRADES1: Grades1[] = (() => {

    const gradeData: [string, string, string][] = [
      // Student 1
      ['5 5 4 5 5 4 5 5 5 4 5 5', '5 4 5 5 4 5 5 5', '5 5 4 5 5 5'],
      ['4 4 5 4 3', '4 5 4 4', '5 4 4'],
      ['3 4 4 5', '4 4 3', '4 5'],

      // Student 2
      ['3 4 3 4', '4 3 4', '3 4 4'],
      ['5 4 5 5', '4 5 5', '5 5'],
      ['3 3 4', '4 3 3', ''],

      // Student 3
      ['4 5 4', '5 4 5', ''],
      ['3 4 3 4', '4 4 3', '4'],
      ['5 5 5 4', '5 4 5', '5 5 5'],

      // Student 4
      ['4 4 3', '4 5 4', '4 4'],
      ['5 5 4', '4 5 5', ''],
      ['3 3 2 4', '3 4 3', '3'],

      // Student 5
      ['5 5 5 4', '5 5 4', '5 5 5'],
      ['4 3 4', '4 4 5', ''],
      ['3 4 4', '4 3 4', '4 4'],

      // Student 6
      ['2 3 3 4', '3 3 2', ''],
      ['4 4 5', '5 4 4', '5'],
      ['5 4 5', '5 5 4', '5 5'],

      // Student 7
      ['5 4 5 5', '5 5 5', '5 4 5'],
      ['3 4 3', '4 3 4', ''],
      ['4 4 5', '4 5 4', '5'],

      // Student 8
      ['3 3 4', '3 4 3', '3'],
      ['5 5 4', '5 4 5', '5 5'],
      ['4 3 4', '4 4 3', ''],

      // Student 9
      ['4 5 4', '4 4 5', '4 5'],
      ['3 3 2', '3 4 3', ''],
      ['5 5 5', '5 4 5', '5 5 5']
    ];

    let id = 1;

    return this.DEMO_STUDENTS.flatMap(student =>
      this.DEMO_SUBJECTS.map((subject, index) => {

        const row = gradeData[(Number(student.id) - 1) * 3 + index];

        const [grades1, grades2, grades3] = row;

        const module1 = this.calculateGrade(grades1);
        const module2 = this.calculateGrade(grades2);
        const module3 = grades3
          ? this.calculateGrade(grades3)
          : undefined;

        // Just some third modules are going to be filled entirelly
        const completed = grades3 !== '' &&
          [1, 2, 4, 8, 10, 13, 18, 19, 23, 25, 27]
            .includes(id);

        const result: Grades1 = {
          id: id++,
          subjectName: subject.name,
          studentId: student.id,
          studentName: student.name,

          modulegrades1: grades1,
          module1: module1,

          modulegrades2: grades2,
          module2: module2,

          modulegrades3: grades3,
          module3: completed ? module3 : undefined,

          semester: completed && module3 !== undefined
            ? Math.round((module1 + module2 + module3) / 3)
            : undefined
        };

        return result;
      })
    );
  })();

  public DEMO_GRADES2: Grades2[] =
    this.DEMO_GRADES1.map((grade, index): Grades2 => ({
      id: index + 1,
      subjectName: grade.subjectName,
      studentId: grade.studentId,
      studentName: grade.studentName,

      modulegrades1: '',
      module1: undefined,

      modulegrades2: '',
      module2: undefined,

      modulegrades3: '',
      module3: undefined,

      semester: undefined
    }));

  public FINAL_GRADES: FinalGrades[] =
    this.DEMO_GRADES1.map((grade, index): FinalGrades => ({
      id: index + 1,
      subjectName: grade.subjectName,
      studentId: grade.studentId,
      studentName: grade.studentName,

      grade1: grade.semester,
      grade2: undefined,
      exam: undefined,
      grade: undefined
    }));

  private calculateGrade(grades: string): number {
    const values = grades.trim().split(/\s+/).map(Number);

    if (!grades.trim()) return 0;

    return Math.round(
      values.reduce((sum, grade) => sum + grade, 0) / values.length
    );
  }





}
