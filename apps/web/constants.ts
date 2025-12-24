import Icons from "./components/Icons";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses", label: "Courses" },
  { href: "/notes", label: "Notes" },
  { href: "/community", label: "Community" },
] as const;

export const COURSE_FEATURES = [
  {
    Icon: Icons.Board,
    text: "Lessons"
  },
  {
    Icon: Icons.LaptopPhone,
    text: "Access on mobile and TV"
  },
  {
    Icon: Icons.Clock,
    text: "30 min personal weekly session"
  },
  {
    Icon: Icons.Handshake,
    text: "Meeting with Oxford Professor"
  },
  {
    Icon: Icons.Certificate,
    text: "Certificate of Completion"
  },
] as const;
