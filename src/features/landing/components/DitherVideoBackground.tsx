import { useEffect, useRef } from 'react'

type DitherVideoBackgroundProps = {
  className?: string
  pixelSize?: number
}

export function DitherVideoBackground({
  className,
  pixelSize = 3,
}: DitherVideoBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video) {
      return
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    if (!ctx) {
      return
    }

    const bayer4x4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

    let rafId = 0
    const hiddenCanvas = document.createElement('canvas')
    let hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })

    if (!hiddenCtx) {
      return
    }

    const setupCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) {
        return
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(rect.width * dpr)
      canvas.height = Math.floor(rect.height * dpr)

      const sourceWidth = Math.max(1, Math.floor(canvas.width / pixelSize))
      const sourceHeight = Math.max(1, Math.floor(canvas.height / pixelSize))

      hiddenCanvas.width = sourceWidth
      hiddenCanvas.height = sourceHeight
      hiddenCtx = hiddenCanvas.getContext('2d', { willReadFrequently: true })
    }

    const drawFrame = () => {
      rafId = window.requestAnimationFrame(drawFrame)

      if (!hiddenCtx || video.readyState < 2) {
        return
      }

      const dstWidth = hiddenCanvas.width
      const dstHeight = hiddenCanvas.height
      const srcWidth = video.videoWidth
      const srcHeight = video.videoHeight

      if (srcWidth > 0 && srcHeight > 0) {
        const srcRatio = srcWidth / srcHeight
        const dstRatio = dstWidth / dstHeight

        let sx = 0
        let sy = 0
        let sWidth = srcWidth
        let sHeight = srcHeight

        // Cover-fit crop so the animation fills without stretching.
        if (srcRatio > dstRatio) {
          sWidth = Math.floor(srcHeight * dstRatio)
          sx = Math.floor((srcWidth - sWidth) / 2)
        } else {
          sHeight = Math.floor(srcWidth / dstRatio)
          sy = Math.floor((srcHeight - sHeight) / 2)
        }

        hiddenCtx.drawImage(
          video,
          sx,
          sy,
          sWidth,
          sHeight,
          0,
          0,
          dstWidth,
          dstHeight,
        )
      } else {
        hiddenCtx.drawImage(video, 0, 0, dstWidth, dstHeight)
      }

      const imageData = hiddenCtx.getImageData(
        0,
        0,
        hiddenCanvas.width,
        hiddenCanvas.height,
      )
      const data = imageData.data

      for (let y = 0; y < hiddenCanvas.height; y += 1) {
        for (let x = 0; x < hiddenCanvas.width; x += 1) {
          const index = (y * hiddenCanvas.width + x) * 4
          const r = data[index]
          const g = data[index + 1]
          const b = data[index + 2]

          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
          const threshold = bayer4x4[(y % 4) * 4 + (x % 4)] * 16

          // Keep highlights as true solid white, dither only the mid-tones.
          let color = 255
          if (luminance <= 32) {
            color = 0
          } else if (luminance < 208) {
            color = luminance > threshold ? 255 : 0
          }

          data[index] = color
          data[index + 1] = color
          data[index + 2] = color
          data[index + 3] = 255
        }
      }

      hiddenCtx.putImageData(imageData, 0, 0)

      ctx.imageSmoothingEnabled = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(hiddenCanvas, 0, 0, canvas.width, canvas.height)
    }

    setupCanvasSize()

    const start = () => {
      if (rafId === 0) {
        drawFrame()
      }
    }

    const stop = () => {
      if (rafId !== 0) {
        window.cancelAnimationFrame(rafId)
        rafId = 0
      }
    }

    const onResize = () => {
      setupCanvasSize()
    }

    video
      .play()
      .then(start)
      .catch(() => {
        start()
      })

    window.addEventListener('resize', onResize)

    return () => {
      stop()
      window.removeEventListener('resize', onResize)
    }
  }, [pixelSize])

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className ?? ''}`}
    >
      <video
        ref={videoRef}
        src="/ripple.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="sr-only"
      />
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
}
