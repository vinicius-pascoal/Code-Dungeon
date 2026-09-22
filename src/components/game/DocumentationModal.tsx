import React from 'react'
import PixelButton from '../ui/PixelButton'
import PixelPanel from '../ui/PixelPanel'
import { getDocumentation, type CommandDoc, type ConceptDoc, useI18n } from '../../i18n'

type Props = {
  isOpen: boolean
  onClose: () => void
  availableCommands?: string[]
}

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <pre className="mt-3 overflow-auto border border-border/70 bg-bg p-3 font-mono text-xs leading-5 text-primaryText">
      <code>{lines.join('\n')}</code>
    </pre>
  )
}

function CommandCard({ item }: { item: CommandDoc }) {
  return (
    <article className="border-2 border-border bg-black p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pixel-command-chip">{item.command}</span>
        <h4 className="pixel-type text-xs font-black text-primaryText">{item.title}</h4>
      </div>
      <p className="mt-2 text-sm leading-6 text-secondaryText">{item.text}</p>
      <CodeBlock lines={item.example.split('\n')} />
    </article>
  )
}

function ConceptCard({ item, whenToUseLabel }: { item: ConceptDoc; whenToUseLabel: string }) {
  return (
    <article className="border-2 border-border bg-black p-3">
      <h4 className="pixel-type text-sm font-black text-primaryText">{item.title}</h4>
      <p className="mt-2 text-sm leading-6 text-secondaryText">{item.meaning}</p>
      <p className="mt-2 text-sm leading-6 text-secondaryText">
        <span className="font-black text-primaryText">{whenToUseLabel}</span> {item.whenToUse}
      </p>
      <CodeBlock lines={item.code} />
    </article>
  )
}

export default function DocumentationModal({ isOpen, onClose, availableCommands }: Props) {
  const { locale, t } = useI18n()

  if (!isOpen) return null

  const documentation = getDocumentation(locale)
  const availableSet = new Set(availableCommands ?? [])
  const shouldShowAll = !availableCommands?.length
  const isAvailable = (key: string) => shouldShowAll || availableSet.has(key)
  const availableMovementCommands = documentation.movement.filter((item) => isAvailable(item.key))
  const availableInteractionCommands = documentation.interaction.filter((item) => isAvailable(item.key))
  const availableConcepts = documentation.concepts.filter((item) => shouldShowAll || item.keys.some((key) => availableSet.has(key)))

  return (
    <div className="pixel-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <PixelPanel
        variant="modal"
        className="max-h-[92vh] w-full max-w-5xl overflow-hidden"
        eyebrow={t('docs.eyebrow')}
        title={t('docs.title')}
        icon="help"
        headerAction={
          <PixelButton type="button" icon="reset" size="sm" variant="ghost" onClick={onClose} aria-label={t('common.close')}>
            {t('common.close')}
          </PixelButton>
        }
        bodyClassName="max-h-[calc(92vh-5rem)] overflow-auto p-3 sm:p-4"
      >
        {availableMovementCommands.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">{t('docs.movement')}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {availableMovementCommands.map((item) => (
                <CommandCard key={item.command} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {availableInteractionCommands.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">{t('docs.interaction')}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {availableInteractionCommands.map((item) => (
                <CommandCard key={item.command} item={item} />
              ))}
            </div>
          </section>
        ) : null}

        {availableConcepts.length ? (
          <section className="mt-4">
            <h3 className="pixel-type text-sm font-black text-primaryText">{t('docs.concepts')}</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {availableConcepts.map((item) => (
                <ConceptCard key={item.title} item={item} whenToUseLabel={t('docs.whenToUse')} />
              ))}
            </div>
          </section>
        ) : null}
      </PixelPanel>
    </div>
  )
}
