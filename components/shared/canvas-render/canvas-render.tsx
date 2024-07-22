import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

type CanvasRenderProps = {
  style?: React.CSSProperties;
  videoRef: React.RefObject<HTMLVideoElement>;
};

export function CanvasRender(props: CanvasRenderProps) {
  const { videoRef, style } = props;
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!refCanvas.current || !videoRef.current) return;

    const canvas = refCanvas.current;
    const video = videoRef.current;
    let show = true;

    const setCanvasSize = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    const processFrame = () => {
      if (!canvas || !video || !show) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const red = data[i];
        const green = data[i + 1];
        const blue = data[i + 2];

        if (green > 90 && red < 90 && blue < 90) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(processFrame);
    };

    const onLoadedMetadata = () => {
      setCanvasSize();
      processFrame();
    };

    if (video.readyState >= 1) {
      setCanvasSize();
      processFrame();
    } else {
      video.addEventListener('loadedmetadata', onLoadedMetadata);
    }

    return () => {
      show = false;
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [videoRef]);

  return <canvas className={styles.wrap} style={style} ref={refCanvas} />;
}
