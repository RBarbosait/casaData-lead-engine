"use client";

type Props = {
  propertyId: string;
  title: string;
  address: string;
};

export default function QRCard({ propertyId, title, address }: Props) {

  // 🔥 FIX: fallback a producción (no localhost)
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://casadata-lead-engine.pages.dev");

  const url = `${baseUrl}/inmueble/${propertyId}?src=qr`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    url
  )}`;

  const downloadQR = () => {
    const link = document.createElement("a");
    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
      url
    )}`;
    link.download = "qr.png";
    link.click();
  };

  const printQR = () => {
    const w = window.open("", "_blank");
    if (!w) return;

    w.document.write(`
      <html>
        <body style="font-family:sans-serif;text-align:center;padding:40px">
          <h2>${title}</h2>
          <p>${address}</p>
          <img src="${qrUrl}" />
          <p style="margin-top:10px">${url}</p>
        </body>
      </html>
    `);

    w.document.close();
    w.print();
  };

  return (
    <div className="p-6 rounded-2xl border bg-white shadow-sm">
      <h3 className="font-semibold mb-4">QR de la publicación</h3>

      <div className="flex flex-col items-center gap-4">
        <img src={qrUrl} className="rounded-lg" />

        <div className="flex gap-3 w-full">
          <button
            className="flex-1 border rounded-xl py-2 text-sm hover:bg-gray-50"
            onClick={downloadQR}
          >
            Descargar
          </button>

          <button
            className="flex-1 border rounded-xl py-2 text-sm hover:bg-gray-50"
            onClick={printQR}
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
