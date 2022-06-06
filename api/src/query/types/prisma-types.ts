import Base from '../../../prisma/client';

export interface ModelTypes {
  anotherPost: {
    model: Base.AnotherPost;
    whereInput: Base.Prisma.AnotherPostWhereInput;
  };
  anotherUser: {
    model: Base.AnotherUser;
    whereInput: Base.Prisma.AnotherUserWhereInput;
  };
  post: {
    model: Base.Post;
    whereInput: Base.Prisma.PostWhereInput;
  };
  category: {
    model: Base.Category;
    whereInput: Base.Prisma.CategoryWhereInput;
  };
  accessToken: {
    model: Base.AccessToken;
    whereInput: Base.Prisma.AccessTokenWhereInput;
  };
  activity: {
    model: Base.Activity;
    whereInput: Base.Prisma.ActivityWhereInput;
  };
  address: {
    model: Base.Address;
    whereInput: Base.Prisma.AddressWhereInput;
  };
  addressI18n: {
    model: Base.AddressI18n;
    whereInput: Base.Prisma.AddressI18nWhereInput;
  };
  admission: {
    model: Base.Admission;
    whereInput: Base.Prisma.AdmissionWhereInput;
  };
  archive: {
    model: Base.Archive;
    whereInput: Base.Prisma.ArchiveWhereInput;
  };
  area: {
    model: Base.Area;
    whereInput: Base.Prisma.AreaWhereInput;
  };
  areaI18n: {
    model: Base.AreaI18n;
    whereInput: Base.Prisma.AreaI18nWhereInput;
  };
  bench: {
    model: Base.Bench;
    whereInput: Base.Prisma.BenchWhereInput;
  };
  benchGroup: {
    model: Base.BenchGroup;
    whereInput: Base.Prisma.BenchGroupWhereInput;
  };
  book: {
    model: Base.Book;
    whereInput: Base.Prisma.BookWhereInput;
  };
  bookCategory: {
    model: Base.BookCategory;
    whereInput: Base.Prisma.BookCategoryWhereInput;
  };
  bookCategoryI18n: {
    model: Base.BookCategoryI18n;
    whereInput: Base.Prisma.BookCategoryI18nWhereInput;
  };
  bookGroup: {
    model: Base.BookGroup;
    whereInput: Base.Prisma.BookGroupWhereInput;
  };
  bookGroupI18n: {
    model: Base.BookGroupI18n;
    whereInput: Base.Prisma.BookGroupI18nWhereInput;
  };
  bookI18n: {
    model: Base.BookI18n;
    whereInput: Base.Prisma.BookI18nWhereInput;
  };
  building: {
    model: Base.Building;
    whereInput: Base.Prisma.BuildingWhereInput;
  };
  buildingI18n: {
    model: Base.BuildingI18n;
    whereInput: Base.Prisma.BuildingI18nWhereInput;
  };
  class: {
    model: Base.Class;
    whereInput: Base.Prisma.ClassWhereInput;
  };
  classGroup: {
    model: Base.ClassGroup;
    whereInput: Base.Prisma.ClassGroupWhereInput;
  };
  classGroupI18n: {
    model: Base.ClassGroupI18n;
    whereInput: Base.Prisma.ClassGroupI18nWhereInput;
  };
  classI18n: {
    model: Base.ClassI18n;
    whereInput: Base.Prisma.ClassI18nWhereInput;
  };
  country: {
    model: Base.Country;
    whereInput: Base.Prisma.CountryWhereInput;
  };
  countryI18n: {
    model: Base.CountryI18n;
    whereInput: Base.Prisma.CountryI18nWhereInput;
  };
  designation: {
    model: Base.Designation;
    whereInput: Base.Prisma.DesignationWhereInput;
  };
  designationI18n: {
    model: Base.DesignationI18n;
    whereInput: Base.Prisma.DesignationI18nWhereInput;
  };
  district: {
    model: Base.District;
    whereInput: Base.Prisma.DistrictWhereInput;
  };
  districtI18n: {
    model: Base.DistrictI18n;
    whereInput: Base.Prisma.DistrictI18nWhereInput;
  };
  division: {
    model: Base.Division;
    whereInput: Base.Prisma.DivisionWhereInput;
  };
  divisionI18n: {
    model: Base.DivisionI18n;
    whereInput: Base.Prisma.DivisionI18nWhereInput;
  };
  exam: {
    model: Base.Exam;
    whereInput: Base.Prisma.ExamWhereInput;
  };
  examBook: {
    model: Base.ExamBook;
    whereInput: Base.Prisma.ExamBookWhereInput;
  };
  examBookGrade: {
    model: Base.ExamBookGrade;
    whereInput: Base.Prisma.ExamBookGradeWhereInput;
  };
  examBookGroup: {
    model: Base.ExamBookGroup;
    whereInput: Base.Prisma.ExamBookGroupWhereInput;
  };
  examBookGroupGrade: {
    model: Base.ExamBookGroupGrade;
    whereInput: Base.Prisma.ExamBookGroupGradeWhereInput;
  };
  examBookMethod: {
    model: Base.ExamBookMethod;
    whereInput: Base.Prisma.ExamBookMethodWhereInput;
  };
  examClassGroup: {
    model: Base.ExamClassGroup;
    whereInput: Base.Prisma.ExamClassGroupWhereInput;
  };
  examGrade: {
    model: Base.ExamGrade;
    whereInput: Base.Prisma.ExamGradeWhereInput;
  };
  examHall: {
    model: Base.ExamHall;
    whereInput: Base.Prisma.ExamHallWhereInput;
  };
  examMethod: {
    model: Base.ExamMethod;
    whereInput: Base.Prisma.ExamMethodWhereInput;
  };
  examMethodI18n: {
    model: Base.ExamMethodI18n;
    whereInput: Base.Prisma.ExamMethodI18nWhereInput;
  };
  examPreset: {
    model: Base.ExamPreset;
    whereInput: Base.Prisma.ExamPresetWhereInput;
  };
  examPresetI18n: {
    model: Base.ExamPresetI18n;
    whereInput: Base.Prisma.ExamPresetI18nWhereInput;
  };
  examRawResult: {
    model: Base.ExamRawResult;
    whereInput: Base.Prisma.ExamRawResultWhereInput;
  };
  examRelate: {
    model: Base.ExamRelate;
    whereInput: Base.Prisma.ExamRelateWhereInput;
  };
  examResult: {
    model: Base.ExamResult;
    whereInput: Base.Prisma.ExamResultWhereInput;
  };
  examResultGrade: {
    model: Base.ExamResultGrade;
    whereInput: Base.Prisma.ExamResultGradeWhereInput;
  };
  examRoutine: {
    model: Base.ExamRoutine;
    whereInput: Base.Prisma.ExamRoutineWhereInput;
  };
  examRoutineSeat: {
    model: Base.ExamRoutineSeat;
    whereInput: Base.Prisma.ExamRoutineSeatWhereInput;
  };
  file: {
    model: Base.File;
    whereInput: Base.Prisma.FileWhereInput;
  };
  floor: {
    model: Base.Floor;
    whereInput: Base.Prisma.FloorWhereInput;
  };
  floorI18n: {
    model: Base.FloorI18n;
    whereInput: Base.Prisma.FloorI18nWhereInput;
  };
  folder: {
    model: Base.Folder;
    whereInput: Base.Prisma.FolderWhereInput;
  };
  grade: {
    model: Base.Grade;
    whereInput: Base.Prisma.GradeWhereInput;
  };
  gradeI18n: {
    model: Base.GradeI18n;
    whereInput: Base.Prisma.GradeI18nWhereInput;
  };
  groupI18n: {
    model: Base.GroupI18n;
    whereInput: Base.Prisma.GroupI18nWhereInput;
  };
  guardianRole: {
    model: Base.GuardianRole;
    whereInput: Base.Prisma.GuardianRoleWhereInput;
  };
  guardianRoleI18n: {
    model: Base.GuardianRoleI18n;
    whereInput: Base.Prisma.GuardianRoleI18nWhereInput;
  };
  guardianRoleUser: {
    model: Base.GuardianRoleUser;
    whereInput: Base.Prisma.GuardianRoleUserWhereInput;
  };
  institute: {
    model: Base.Institute;
    whereInput: Base.Prisma.InstituteWhereInput;
  };
  instituteI18n: {
    model: Base.InstituteI18n;
    whereInput: Base.Prisma.InstituteI18nWhereInput;
  };
  language: {
    model: Base.Language;
    whereInput: Base.Prisma.LanguageWhereInput;
  };
  lock: {
    model: Base.Lock;
    whereInput: Base.Prisma.LockWhereInput;
  };
  mimeType: {
    model: Base.MimeType;
    whereInput: Base.Prisma.MimeTypeWhereInput;
  };
  notification: {
    model: Base.Notification;
    whereInput: Base.Prisma.NotificationWhereInput;
  };
  notificationBase: {
    model: Base.NotificationBase;
    whereInput: Base.Prisma.NotificationBaseWhereInput;
  };
  notificationContent: {
    model: Base.NotificationContent;
    whereInput: Base.Prisma.NotificationContentWhereInput;
  };
  preset: {
    model: Base.Preset;
    whereInput: Base.Prisma.PresetWhereInput;
  };
  revision: {
    model: Base.Revision;
    whereInput: Base.Prisma.RevisionWhereInput;
  };
  room: {
    model: Base.Room;
    whereInput: Base.Prisma.RoomWhereInput;
  };
  roomI18n: {
    model: Base.RoomI18n;
    whereInput: Base.Prisma.RoomI18nWhereInput;
  };
  seat: {
    model: Base.Seat;
    whereInput: Base.Prisma.SeatWhereInput;
  };
  session: {
    model: Base.Session;
    whereInput: Base.Prisma.SessionWhereInput;
  };
  sessionI18n: {
    model: Base.SessionI18n;
    whereInput: Base.Prisma.SessionI18nWhereInput;
  };
  setting: {
    model: Base.Setting;
    whereInput: Base.Prisma.SettingWhereInput;
  };
  sms: {
    model: Base.Sms;
    whereInput: Base.Prisma.SmsWhereInput;
  };
  smsTemplate: {
    model: Base.SmsTemplate;
    whereInput: Base.Prisma.SmsTemplateWhereInput;
  };
  smsTemplateI18n: {
    model: Base.SmsTemplateI18n;
    whereInput: Base.Prisma.SmsTemplateI18nWhereInput;
  };
  staff: {
    model: Base.Staff;
    whereInput: Base.Prisma.StaffWhereInput;
  };
  staffGroup: {
    model: Base.StaffGroup;
    whereInput: Base.Prisma.StaffGroupWhereInput;
  };
  staffGroupPivot: {
    model: Base.StaffGroupPivot;
    whereInput: Base.Prisma.StaffGroupPivotWhereInput;
  };
  staffI18n: {
    model: Base.StaffI18n;
    whereInput: Base.Prisma.StaffI18nWhereInput;
  };
  state: {
    model: Base.State;
    whereInput: Base.Prisma.StateWhereInput;
  };
  stateI18n: {
    model: Base.StateI18n;
    whereInput: Base.Prisma.StateI18nWhereInput;
  };
  studentGuardian: {
    model: Base.StudentGuardian;
    whereInput: Base.Prisma.StudentGuardianWhereInput;
  };
  subDistrict: {
    model: Base.SubDistrict;
    whereInput: Base.Prisma.SubDistrictWhereInput;
  };
  subDistrictI18n: {
    model: Base.SubDistrictI18n;
    whereInput: Base.Prisma.SubDistrictI18nWhereInput;
  };
  trash: {
    model: Base.Trash;
    whereInput: Base.Prisma.TrashWhereInput;
  };
  user: {
    model: Base.User;
    whereInput: Base.Prisma.UserWhereInput;
  };
  userI18n: {
    model: Base.UserI18n;
    whereInput: Base.Prisma.UserI18nWhereInput;
  };
  chatMessage: {
    model: Base.ChatMessage;
    whereInput: Base.Prisma.ChatMessageWhereInput;
  };
  chatFile: {
    model: Base.ChatFile;
    whereInput: Base.Prisma.ChatFileWhereInput;
  };
  conversation: {
    model: Base.Conversation;
    whereInput: Base.Prisma.ConversationWhereInput;
  };
  conversationMember: {
    model: Base.ConversationMember;
    whereInput: Base.Prisma.ConversationMemberWhereInput;
  };
  role: {
    model: Base.Role;
    whereInput: Base.Prisma.RoleWhereInput;
  };
  roleI18n: {
    model: Base.RoleI18n;
    whereInput: Base.Prisma.RoleI18nWhereInput;
  };
  rolePermission: {
    model: Base.RolePermission;
    whereInput: Base.Prisma.RolePermissionWhereInput;
  };
  roleUser: {
    model: Base.RoleUser;
    whereInput: Base.Prisma.RoleUserWhereInput;
  };
}
