import { forwardRef, ReactNode } from "react";

interface ReportPrintProps {
  children: ReactNode;
  title?: string | null;
}

const ReportPrint = forwardRef<HTMLDivElement, ReportPrintProps>(
  ({ children, title }, ref) => {
    return (
      <div ref={ref} className="p-6 bg-white dark:bg-zink-800">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <img
              src="/images/pondok.png"
              alt="School Logo"
              className="h-20 w-20 mr-4"
            />
            <div className="text-center">
              <h1 className="text-lg font-bold">
                PONDOK PESANTREN DARUL ISTIQAMAH
              </h1>
              <p className="text-sm">
                JL. H. A. Syafawi Murakata Barabai Kab. HST, Kalsel
              </p>
              <p className="text-sm">website: www.darulistiqamah.ponpes.id</p>
            </div>
          </div>
          <hr className="border-t-2 border-black" />
        </div>
        <div className="px-8">
          {title && (
            <h2 className="text-2xl font-bold text-start mb-4">{title}</h2>
          )}
          {children}
          <div className="mt-8 flex justify-between">
            <div></div>
            <div className="text-center">
              {/* <p>Barabai, 31 Mei 2022</p> */}
              {/* ambil tanggal otomatis */}
              <p>
                Barabai,
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p>Kepala Madrasah,</p>

              <div className="mt-2">
                <img
                  src="/images/ttd_stempel.png"
                  alt="Stamp and Signature"
                  className="mx-auto h-32"
                />
              </div>
              <p className="mt-4 font-bold">HANIFAH, S.Pd.I</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ReportPrint;
