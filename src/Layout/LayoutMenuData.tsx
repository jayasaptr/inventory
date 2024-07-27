import { link } from "fs";
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

const menuData: any = [
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
    label: "Data Master",
    isTitle: true,
  },
  {
    id: "Data User",
    label: "Data User",
    icon: <UserRound />,
    link: "/user",
  },
  {
    id: "Category",
    label: "Category",
    icon: <Copy />,
    link: "/category",
  },
  {
    id: "Kondisi",
    label: "Kondisi",
    icon: <MonitorDot />,
    link: "/kondisi",
  },
  {
    id: "Ruangan",
    label: "Ruangan",
    icon: <School />,
    link: "/ruangan",
  },
  {
    label: "Data Barang",
    isTitle: true,
  },
  {
    id: "Barang Masuk",
    label: "Barang Masuk",
    icon: <PackagePlus />,
    link: "/barang-masuk",
  },
  {
    id: "Barang Keluar",
    label: "Barang Keluar",
    icon: <PackagePlus />,
    link: "/barangkeluar",
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

export { menuData };
