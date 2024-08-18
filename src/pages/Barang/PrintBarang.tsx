import React, { forwardRef } from "react";

const PrintBarang = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref}>
      <div>
        <h1>PEMERINTAH KABUPATEN CILAWANG</h1>
        <p>DINAS PENDIDIKAN, PEMUDA, DAN OLAHRAGA</p>
        <p>SMA NEGERI 2 GUSU LAN</p>
      </div>
    </div>
  );
});

export default PrintBarang;
