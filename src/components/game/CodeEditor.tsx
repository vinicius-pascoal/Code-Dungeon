import React, { useRef, useEffect, useState } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export default function CodeEditor({ value, onChange, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(Math.max(1, lines))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = textareaRef.current
      if (!textarea) return
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newValue = value.substring(0, start) + '\t' + value.substring(end)
      onChange(newValue)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1
      }, 0)
    }
  }

  return (
    <div className="flex border border-white/5 rounded-md overflow-hidden bg-bg h-full">
      <div className="bg-bg border-r border-white/10 select-none text-slate-500 font-mono text-sm p-3 overflow-hidden min-w-12">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i + 1} className="h-6 flex items-center justify-end pr-3">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="flex-1 p-3 bg-bg text-primaryText font-mono text-sm border-none outline-none resize-none disabled:opacity-60"
        spellCheck={false}
        style={{ tabSize: 2 }}
      />
    </div>
  )
}
