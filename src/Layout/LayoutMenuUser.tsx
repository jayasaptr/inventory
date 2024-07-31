import {
  Award,
  CalendarDays,
  CircuitBoard,
  Copy,
  FileText,
  LifeBuoy,
  LocateFixed,
  Mail,
  Map,
  MessageSquare,
  MonitorDot,
  PackagePlus,
  PictureInPicture2,
  PieChart,
  RadioTower,
  ScrollText,
  Share2,
  ShoppingBag,
  Table,
  Trophy,
  School,
  UserRound,
} from "lucide-react";

const menuUser: any = [
  {
    label: "menu",
    isTitle: true,
  },
  {
    id: "dashboard",
    label: "Dashboards",
    link: "/#",
    icon: <MonitorDot />,
    subItems: [
      {
        id: "ecommercedashboard",
        label: "Summary Barang",
        link: "/dashboard",
        parentId: "dashboard",
      },
    ],
  },
  {
    label: "Data Lainnya",
    isTitle: true,
  },
  {
    id: "Pengajuan Perbaikan",
    label: "Pengajuan Perbaikan",
    icon: <Award />,
    link: "/pengajuan-perbaikan",
  },
  {
    id: "Permintaan Baran",
    label: "Permintaan Barang",
    icon: <Share2 />,
    link: "/permintaan-barang",
  },
];

export { menuUser };
