'use client'

import Image from 'next/image'
import { useState } from 'react'
import { generateSvgPlaceholder, getCategoryFallbackImage, getRandomAvatar } from '@/lib/imageUtils'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  fill?: boolean
  sizes?: string
  category?: string
  type?: 'news' | 'avatar' | 'general'
  placeholder?: 'blur' | 'empty'
  quality?: number
}

export function SafeImage({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false,
  fill = false,
  sizes,
  category = 'default',
  type = 'general',
  placeholder = 'blur',
  quality = 80,
  ...props
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      
      // Choose fallback based on type
      let fallbackSrc: string
      
      switch (type) {
        case 'avatar':
          fallbackSrc = getRandomAvatar()
          break
        case 'news':
          fallbackSrc = getCategoryFallbackImage(category)
          break
        default:
          fallbackSrc = generateSvgPlaceholder({
            width,
            height,
            text: 'Görsel Yüklenemedi',
            backgroundColor: '#f3f4f6',
            textColor: '#9ca3af'
          })
      }
      
      setImgSrc(fallbackSrc)
    }
  }

  // Generate blur placeholder
  const blurDataURL = generateSvgPlaceholder({
    width: 10,
    height: 10,
    text: '',
    backgroundColor: '#e5e7eb'
  })

  const imageProps = {
    src: imgSrc,
    alt,
    className,
    priority,
    quality,
    onError: handleError,
    ...(placeholder === 'blur' && { blurDataURL }),
    ...props
  }

  if (fill) {
    return (
      <Image
        {...imageProps}
        fill
        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
      />
    )
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  )
}

// Specific components for common use cases
export function NewsImage({ src, alt, category, className, ...props }: Omit<SafeImageProps, 'type'>) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      category={category}
      type="news"
      className={className}
      {...props}
    />
  )
}

export function AvatarImage({ src, alt, size = 150, className, ...props }: Omit<SafeImageProps, 'type' | 'width' | 'height'> & { size?: number }) {
  return (
    <SafeImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      type="avatar"
      className={`rounded-full ${className}`}
      {...props}
    />
  )
}
