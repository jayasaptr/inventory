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
  Package,
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
    label: "Data Master",
    isTitle: true,
  },
  {
    id: "Barang",
    label: "Barang",
    icon: <Package />,
    link: "/barang-masuk",
  },
  {
    label: "Data Surat",
    isTitle: true,
  },
  {
    id: "Surat Tugas",
    label: "Surat Tugas",
    icon: <Mail />,
    link: "/surat-tugas",
  },
  {
    id: "Surat Keterangan Aktif",
    label: "Surat Keterangan Aktif",
    icon: <Mail />,
    link: "/surat-keterangan-aktif",
  },
  {
    id: "Surat Berkelakuan Baik",
    label: "Surat Berkelakuan Baik",
    icon: <Mail />,
    link: "/surat-berkelakuan-baik",
  },
  {
    label: "Data Barang / Asset",
    isTitle: true,
  },
  {
    id: "Asset / Barang",
    label: "Asset / Barang",
    icon: <PackagePlus />,
    link: "/asset-barang",
  },
  // {
  //   id: "Barang Masuk",
  //   label: "Barang Masuk",
  //   icon: <PackagePlus />,
  //   link: "/barang-masuk",
  // },
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
    id: "Pengajuan Perbaikan Barang",
    label: "Pengajuan Perbaikan Barang",
    icon: <Award />,
    link: "/pengajuan-perbaikan",
  },
  {
    id: "Pengajuan Perbaikan Asset",
    label: "Pengajuan Perbaikan Asset",
    icon: <Award />,
    link: "/pengajuan-perbaikan-asset",
  },
];

export { menuUser };
