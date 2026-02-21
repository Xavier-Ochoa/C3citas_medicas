export function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card shadow-2xl fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-ink-600/50">
          <h2 className="font-display font-bold text-white text-lg">{titulo}</h2>
          <button onClick={onClose} className="text-ink-300 hover:text-white transition-colors text-xl leading-none">&times;</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Alert({ tipo = 'error', mensaje, onClose }) {
  const estilos = {
    error:   'bg-red-500/10 border-red-500/30 text-red-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    info:    'bg-blue-500/10 border-blue-500/30 text-blue-400',
  }
  const iconos = { error: '✕', success: '✓', info: 'ℹ' }
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${estilos[tipo]} fade-in`}>
      <span className="font-bold">{iconos[tipo]}</span>
      <span className="flex-1">{mensaje}</span>
      {onClose && <button onClick={onClose} className="opacity-60 hover:opacity-100">&times;</button>}
    </div>
  )
}
