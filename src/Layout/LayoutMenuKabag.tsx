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
  FileLineChart,
} from "lucide-react";

const menuKabag: any = [
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
    id: "Permintaan Baran",
    label: "Permintaan Barang",
    icon: <Share2 />,
    link: "/permintaan-barang",
  },
  {
    id: "Pengajuan Perbaikan",
    label: "Pengajuan Perbaikan",
    icon: <Award />,
    link: "/pengajuan-perbaikan",
  },
  {
    id: "Barang Keluar",
    label: "Barang Keluar",
    icon: <PackagePlus />,
    link: "/barang-keluar",
  },
  {
    label: "Laporan",
    isTitle: true,
  },
  {
    id: "Barang",
    label: "Barang",
    icon: <FileLineChart />,
    link: "/report-barang-kabag",
  },
  {
    id: "Perbaikan",
    label: "Perbaikan",
    icon: <FileLineChart />,
    link: "/report-perbaikan-kabag",
  },
  {
    id: "Barang Keluar",
    label: "Barang Keluar",
    icon: <FileLineChart />,
    link: "/laporan-barang-keluar",
  },
];

export { menuKabag };
