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
    label: "Laporan Surat",
    isTitle: true,
  },
  {
    id: "Laporan Arsip Surat",
    label: "Arsip Surat",
    icon: <FileLineChart />,
    link: "/laporan-arsip-surat",
  },
  {
    id: "Laporan Surat Tugas",
    label: "Surat Tugas",
    icon: <FileLineChart />,
    link: "/laporan-surat-tugas",
  },
  {
    id: "Laporan Surat Keterangan Aktif",
    label: "Surat Keterangan Aktif",
    icon: <FileLineChart />,
    link: "/laporan-surat-keterangan-aktif",
  },
  {
    id: "Laporan Surat Berkelakuan Baik",
    label: "Surat Berkelakuan Baik",
    icon: <FileLineChart />,
    link: "/laporan-surat-berkelakuan-baik",
  },
  {
    label: "Laporan Barang / Asset",
    isTitle: true,
  },
  {
    id: "Laporan Barang / Asset",
    label: "Barang / Asset",
    icon: <FileLineChart />,
    link: "/laporan-barang-asset",
  },
  {
    id: "Laporan Barang Masuk",
    label: "Barang Masuk",
    icon: <FileLineChart />,
    link: "/laporan-barang-masuk",
  },
  {
    id: "Laporan Barang Keluar",
    label: "Barang Keluar",
    icon: <FileLineChart />,
    link: "/laporan-barang-keluar",
  },
  {
    id: "Laporan Permintaan Barang",
    label: "Permintaan Barang",
    icon: <FileLineChart />,
    link: "/laporan-permintaan-barang",
  },
  {
    id: "Laporan Perbaikan Barang",
    label: "Perbaikan Asset",
    icon: <FileLineChart />,
    link: "/laporan-perbaikan-asset",
  },
  {
    id: "Laporan Perbaikan Barang",
    label: "Perbaikan Barang",
    icon: <FileLineChart />,
    link: "/laporan-pengajuan-perbaikan",
  },
];

export { menuKabag };
