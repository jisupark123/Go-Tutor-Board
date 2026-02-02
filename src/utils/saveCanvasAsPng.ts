export default async function saveCanvasAsPng(canvas: HTMLCanvasElement, bgImageUrl: string, filename = 'canvas.png') {
  // 백업용 임시 캔버스 생성
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');
  if (!ctx) return;

  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;

  // 배경 이미지 로드
  const bgImage = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS 문제 방지
    img.src = bgImageUrl;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

  // 1️⃣ 배경 이미지 그리기
  ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  // 2️⃣ 원래 캔버스 내용 그리기
  ctx.drawImage(canvas, 0, 0);

  // 3️⃣ PNG로 저장
  tempCanvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
