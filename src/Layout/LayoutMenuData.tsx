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
  Package,
  GanttChartSquareIcon,
  FileLineChart,
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
    id: "data-master",
    label: "Data Master",
    icon: <Package />,
    subItems: [
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
        id: "Asset",
        label: "Asset",
        icon: <GanttChartSquareIcon />,
        link: "/asset",
      },
      {
        id: "Barang",
        label: "Barang",
        icon: <Package />,
        link: "/barang-masuk",
      },
      {
        id: "Ruangan",
        label: "Ruangan",
        icon: <School />,
        link: "/ruangan",
      },
    ],
  },
  {
    label: "Data Surat",
    isTitle: true,
  },
  {
    id: "data-surat",
    label: "Data Surat",
    icon: <Mail />,
    subItems: [
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
        id: "Pengarsipan Surat",
        label: "Pengarsipan Surat",
        icon: <Mail />,
        link: "/pengarsipan-surat",
      },
    ],
  },
  {
    label: "Data Asset / Barang",
    isTitle: true,
  },
  // {
  //   id: "Barang",
  //   label: "Barang",
  //   icon: <PackagePlus />,
  //   link: "/barang",
  // },

  {
    id: "Asset / Barang",
    label: "Asset / Barang",
    icon: <PackagePlus />,
    subItems: [
      {
        id: "Asset / Barang",
        label: "Asset / Barang",
        icon: <PackagePlus />,
        link: "/asset-barang",
      },
      {
        id: "Asset Masuk",
        label: "Asset Masuk",
        icon: <PackagePlus />,
        link: "/asset-masuks",
      },
      {
        id: "Asset Keluar",
        label: "Asset Keluar",
        icon: <PackagePlus />,
        link: "/asset-keluar",
      },
      {
        id: "Barang Masuk",
        label: "Barang Masuk",
        icon: <PackagePlus />,
        link: "/barang-masuks",
      },
      {
        id: "Barang Keluar",
        label: "Barang Keluar",
        icon: <PackagePlus />,
        link: "/barang-keluar",
      },
    ],
  },
  {
    label: "Data Lainnya",
    isTitle: true,
  },
  {
    id: "Permintaan dan Perbaikan",
    label: "Permintaan dan Perbaikan",
    icon: <Share2 />,
    subItems: [
      {
        id: "Permintaan Baran",
        label: "Permintaan Barang",
        icon: <Share2 />,
        link: "/permintaan-barang",
      },
      {
        id: "Perbaikan Asset",
        label: "Perbaikan Asset",
        icon: <Award />,
        link: "/pengajuan-perbaikan-asset",
      },
      {
        id: "Perbaikan Barang",
        label: "Perbaikan Barang",
        icon: <Award />,
        link: "/pengajuan-perbaikan",
      },
    ],
  },
  {
    label: "Laporan Surat",
    isTitle: true,
  },
  {
    id: "Laporan Surat",
    label: "Laporan Surat",
    icon: <FileLineChart />,
    subItems: [
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
    ],
  },
  {
    label: "Laporan Barang / Asset",
    isTitle: true,
  },
  {
    id: "Laporan Barang / Asset",
    label: "Barang / Asset",
    icon: <FileLineChart />,
    subItems: [
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
    ],
  },
  // {
  //   label: "Crud",
  //   isTitle: true,
  // },
  // {
  //   id: "crud",
  //   label: "Siswa",
  //   icon: <Award />,
  //   link: "/siswa",
  // },
];

export { menuData };
