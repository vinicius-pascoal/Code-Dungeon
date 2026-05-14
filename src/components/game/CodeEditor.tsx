import React, { useEffect, useRef, useState } from 'react'
import { RESERVED_COMMANDS } from '../../utils/commandParser'

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const KEYWORDS = ['if', 'else', 'while', 'for', 'function', 'var', 'let', 'const', 'return', 'true', 'false']
const ALL_COMPLETIONS = [...RESERVED_COMMANDS, ...KEYWORDS]

export default function CodeEditor({ value, onChange, disabled }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [lineCount, setLineCount] = useState(1)
  const [suggestion, setSuggestion] = useState<string | null>(null)
  const [cursorState, setCursorState] = useState({ lineIndex: 0, column: 0, prefix: '' })
  const [caretPosition, setCaretPosition] = useState({ lineIndex: 0, x: 0, visible: false })
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null)
  const [scrollTop, setScrollTop] = useState(0)

  useEffect(() => {
    const lines = value.split('\n').length
    setLineCount(Math.max(1, lines))
  }, [value])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea || disabled) {
      setSuggestion(null)
      setCursorState({ lineIndex: 0, column: 0, prefix: '' })
      setCaretPosition({ lineIndex: 0, x: 0, visible: false })
      setSelection(null)
      setScrollTop(0)
      return
    }

    const cursor = textarea.selectionStart
    const beforeCursor = value.slice(0, cursor)
    const linesBeforeCursor = beforeCursor.split('\n')
    const currentLine = linesBeforeCursor[linesBeforeCursor.length - 1] ?? ''
    const match = beforeCursor.match(/([a-zA-Z_]\w*)$/)
    const prefix = match?.[1] ?? ''
    const lineIndex = Math.max(0, linesBeforeCursor.length - 1)
    const column = currentLine.length

    setCursorState({ lineIndex, column, prefix })

    const computedStyle = window.getComputedStyle(textarea)
    const fontSize = parseFloat(computedStyle.fontSize) || 14
    const charWidth = fontSize * 0.62
    const selectionStart = textarea.selectionStart ?? cursor
    const selectionEnd = textarea.selectionEnd ?? cursor

    setSelection(selectionStart === selectionEnd ? null : { start: selectionStart, end: selectionEnd })
    setCaretPosition({
      lineIndex,
      x: column * charWidth,
      visible: true,
    })

    if (!prefix) {
      setSuggestion(null)
      return
    }

    const nextSuggestion = ALL_COMPLETIONS.find((cmd) => cmd.startsWith(prefix) && cmd !== prefix) ?? null
    setSuggestion(nextSuggestion)
  }, [value, disabled])

  useEffect(() => {
    if (disabled) return

    const handleDocumentSelectionChange = () => {
      const textarea = textareaRef.current
      if (!textarea || document.activeElement !== textarea) return

      handleSelectionUpdate()
    }

    document.addEventListener('selectionchange', handleDocumentSelectionChange)
    return () => document.removeEventListener('selectionchange', handleDocumentSelectionChange)
  }, [disabled, value])

  const normalizeCompletion = (command: string) => {
    if (command === 'if') return 'if (condition) {\n  \n}'
    if (command === 'else') return 'else {\n  \n}'
    if (command === 'while') return 'while (condition) {\n  \n}'
    if (command === 'for') return 'for (let i = 0; i < 10; i++) {\n  \n}'
    if (command === 'function') return 'function name() {\n  \n}'
    if (command === 'var' || command === 'let' || command === 'const') return `${command} name = 0;`
    if (command === 'return') return 'return 0;'
    if (RESERVED_COMMANDS.includes(command)) return `${command}();`
    return command
  }

  const applySuggestion = (command: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursor = textarea.selectionStart
    const beforeCursor = value.slice(0, cursor)
    const afterCursor = value.slice(cursor)
    const match = beforeCursor.match(/([a-zA-Z_]\w*)$/)
    const prefix = match?.[1] ?? ''
    const start = cursor - prefix.length
    const completion = normalizeCompletion(command)
    const nextLineBreakIndex = afterCursor.indexOf('\n')
    const currentLineSuffix = nextLineBreakIndex >= 0 ? afterCursor.slice(0, nextLineBreakIndex) : afterCursor
    const remainderAfterCurrentLine = nextLineBreakIndex >= 0 ? afterCursor.slice(nextLineBreakIndex) : ''
    const cleanedCurrentLineSuffix = currentLineSuffix.replace(/^[ \t]*\(\)[ \t]*;?/, '').replace(/^[ \t]*;?/, '')
    const cleanedAfterCursor = cleanedCurrentLineSuffix + remainderAfterCurrentLine
    const nextValue = value.slice(0, start) + completion + cleanedAfterCursor

    onChange(nextValue)

    window.setTimeout(() => {
      const nextCursor = start + completion.length
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = nextCursor
    }, 0)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  const handleSelectionUpdate = () => {
    const textarea = textareaRef.current
    if (!textarea) return

    const cursor = textarea.selectionStart
    const selectionStart = textarea.selectionStart ?? cursor
    const selectionEnd = textarea.selectionEnd ?? cursor
    const beforeCursor = value.slice(0, cursor)
    const linesBeforeCursor = beforeCursor.split('\n')
    const currentLine = linesBeforeCursor[linesBeforeCursor.length - 1] ?? ''
    const match = beforeCursor.match(/([a-zA-Z_]\w*)$/)
    const prefix = match?.[1] ?? ''

    setCursorState({
      lineIndex: Math.max(0, linesBeforeCursor.length - 1),
      column: currentLine.length,
      prefix,
    })

    const computedStyle = window.getComputedStyle(textarea)
    const fontSize = parseFloat(computedStyle.fontSize) || 14
    const charWidth = fontSize * 0.62
    setCaretPosition({
      lineIndex: Math.max(0, linesBeforeCursor.length - 1),
      x: currentLine.length * charWidth,
      visible: true,
    })
    setSelection(selectionStart === selectionEnd ? null : { start: selectionStart, end: selectionEnd })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault()
      applySuggestion(suggestion)
      return
    }

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

  const suggestionSuffix = suggestion && suggestion.startsWith(cursorState.prefix)
    ? `${suggestion.slice(cursorState.prefix.length)}();`
    : ''

  const lines = value.split('\n')
  const selectionStart = selection ? Math.min(selection.start, selection.end) : null
  const selectionEnd = selection ? Math.max(selection.start, selection.end) : null

  const hasSelection = Boolean(selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd)

  const getLineBounds = (index: number) => {
    let lineOffset = 0
    for (let i = 0; i < index; i += 1) {
      lineOffset += lines[i]?.length ?? 0
      lineOffset += 1
    }

    const lineStart = lineOffset
    const lineEnd = lineStart + (lines[index]?.length ?? 0)
    return { lineStart, lineEnd }
  }

  const getSelectionState = (index: number) => {
    if (selectionStart === null || selectionEnd === null) {
      return { selected: false, first: false, last: false }
    }

    const { lineStart, lineEnd } = getLineBounds(index)
    const selected = lineEnd > selectionStart && lineStart < selectionEnd
    if (!selected) {
      return { selected: false, first: false, last: false }
    }

    const first = lineStart <= selectionStart && selectionStart < lineEnd
    const last = lineStart < selectionEnd && selectionEnd <= lineEnd

    return { selected, first, last }
  }

  return (
    <div className="flex border border-white/5 rounded-md overflow-hidden bg-bg h-full min-h-0">
      <div className="relative bg-bg border-r border-white/10 select-none text-slate-500 font-mono text-sm min-w-12 overflow-hidden">
        <div
          className="p-3 will-change-transform"
          style={{ transform: `translateY(${-scrollTop}px)` }}
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div
              key={i + 1}
              className={[
                'h-6 flex items-center justify-end pr-3 transition-colors',
                i === cursorState.lineIndex ? 'text-primary bg-primary/10 border-r-2 border-primary/60' : '',
              ].join(' ')}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden font-mono text-sm text-primaryText">
          <div className="p-3 will-change-transform" style={{ transform: `translateY(${-scrollTop}px)` }}>
            {lines.map((line, index) => {
              const isCurrentLine = index === cursorState.lineIndex
              const selectionState = getSelectionState(index)
              const lineClassName = [
                'relative h-6 flex items-center whitespace-pre',
                selectionState.selected
                  ? [
                    'bg-primary/75 text-white ring-1 ring-inset ring-primary/95',
                    selectionState.first ? 'rounded-t-sm' : '',
                    selectionState.last ? 'rounded-b-sm' : '',
                  ].join(' ')
                  : '',
                !selectionState.selected && isCurrentLine ? 'bg-primary/10 ring-1 ring-inset ring-primary/30 rounded-sm' : '',
              ].join(' ')

              return (
                <div key={index} className={lineClassName}>
                  {isCurrentLine && suggestionSuffix ? (
                    <>
                      {line}
                      <span className={selectionState.selected ? 'text-white/80' : 'text-white/35'}>{suggestionSuffix}</span>
                    </>
                  ) : (
                    line
                  )}

                  {isCurrentLine && caretPosition.visible && !hasSelection ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      style={{ left: `${caretPosition.x}px` }}
                    />
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onScroll={syncScroll}
          onSelect={handleSelectionUpdate}
          onClick={handleSelectionUpdate}
          onKeyUp={handleSelectionUpdate}
          onFocus={handleSelectionUpdate}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="relative z-10 w-full h-full min-h-0 p-3 bg-transparent text-transparent caret-primary font-mono text-sm leading-6 border-none outline-none resize-none overflow-auto disabled:opacity-60 selection:bg-primary/30 selection:text-transparent"
          spellCheck={false}
          style={{ tabSize: 2 }}
        />

        {suggestion ? (
          <button
            type="button"
            disabled={disabled}
            onClick={() => applySuggestion(suggestion)}
            className="absolute bottom-3 right-3 z-10 rounded-md border border-primary/30 bg-panel/95 px-3 py-1 text-xs font-mono text-primaryText shadow-lg hover:bg-panel disabled:opacity-50"
          >
            Completar: {suggestion}
          </button>
        ) : null}
      </div>
    </div>
  )
}
