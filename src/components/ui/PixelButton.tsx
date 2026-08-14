import Link from 'next/link'
import type React from 'react'
import PixelIcon from './PixelIcon'
import { UI_SPRITES, type UiIconName } from '../../game/ui/uiSprites'

type CommonProps = {
  icon?: UiIconName
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

type ButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined
  }

type LinkProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: string
  }

type Props = ButtonProps | LinkProps

function classNames(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(' ')
}

export default function PixelButton(props: Props) {
  const {
    icon,
    children,
    variant = 'secondary',
    size = 'md',
    className = '',
    ...rest
  } = props

  const buttonClassName = classNames(
    'pixel-button',
    `pixel-button--${variant}`,
    `pixel-button--${size}`,
    className
  )

  const content = (
    <>
      {icon ? <PixelIcon sprite={UI_SPRITES.icons[icon]} scale={1} /> : null}
      <span>{children}</span>
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...anchorProps } = rest as Omit<LinkProps, keyof CommonProps>
    return (
      <Link href={props.href} className={buttonClassName} {...anchorProps}>
        {content}
      </Link>
    )
  }

  return (
    <button className={buttonClassName} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  )
}
