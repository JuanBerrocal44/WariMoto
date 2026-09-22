import { useState } from 'react'
import warimotoLogo from './assets/warimoto-logo.png'

// ─── Types ───────────────────────────────────────────────────────────────────

type UserMode = 'pasajero' | 'conductor'
type Screen = 'home' | 'viajes' | 'emergencia' | 'perfil' | 'solicitud' | 'asociaciones'
type DriverStatus = 'libre' | 'ocupado'

// ─── Data ────────────────────────────────────────────────────────────────────

const CONDUCTORES = [
  { id: 1, nombre: 'Juan Pérez', foto: 'JP', calificacion: 4.8, anos: 3, placa: 'ABC-123', tipo: 'Moto lineal', distancia: '0.8 km', tiempo: '3 min', libre: true, lat: 38, lng: 55 },
  { id: 2, nombre: 'Carlos Quispe', foto: 'CQ', calificacion: 4.9, anos: 5, placa: 'XYZ-456', tipo: 'Moto sport', distancia: '1.2 km', tiempo: '5 min', libre: true, lat: 60, lng: 30 },
  { id: 3, nombre: 'Rosa Huanca', foto: 'RH', calificacion: 4.7, anos: 2, placa: 'LMN-789', tipo: 'Moto lineal', distancia: '2.1 km', tiempo: '8 min', libre: false, lat: 70, lng: 65 },
  { id: 4, nombre: 'Miguel Torres', foto: 'MT', calificacion: 4.6, anos: 4, placa: 'DEF-321', tipo: 'Moto sport', distancia: '0.5 km', tiempo: '2 min', libre: true, lat: 25, lng: 75 },
]

const VIAJES = [
  { id: 1, origen: 'Plaza de Armas', destino: 'Mercado Andrés F. Vivanco', fecha: '20 Sep 2026', hora: '09:14', precio: 'S/ 4.50', conductor: 'Juan Pérez', calificacion: 5, estado: 'completado' },
  { id: 2, origen: 'Hospital Regional', destino: 'Urb. Santa Elena', fecha: '18 Sep 2026', hora: '16:32', precio: 'S/ 6.00', conductor: 'Carlos Quispe', calificacion: 5, estado: 'completado' },
  { id: 3, origen: 'Estadio Ciudad de Cumaná', destino: 'Jr. Lima 234', fecha: '15 Sep 2026', hora: '08:05', precio: 'S/ 3.50', conductor: 'Rosa Huanca', calificacion: 4, estado: 'completado' },
  { id: 4, origen: 'Terminal Terrestre', destino: 'Barrio Belén', fecha: '10 Sep 2026', hora: '12:20', precio: 'S/ 5.50', conductor: 'Miguel Torres', calificacion: 5, estado: 'cancelado' },
]

// ─── Icons ───────────────────────────────────────────────────────────────────

const IconHome = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
)
const IconTrips = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2.05V4.07c3.94.49 7 3.85 7 7.93s-3.05 7.44-7 7.93v2.02c5.05-.51 9-4.76 9-9.95s-3.95-9.44-9-9.95zm-2 17.88c-3.38-.47-6-3.34-6-6.93s2.62-6.46 6-6.93V4.05C6 4.56 2 8.81 2 12s3.95 7.44 9 7.95V19.93z"/>
  </svg>
)
const IconEmergency = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
  </svg>
)
const IconProfile = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
)
const IconStar = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFC107">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
)
const IconSearch = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
)
const IconMotorcycle = ({ size = 20, color = '#003366' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M19.5 10.5c-.15 0-.3.01-.44.03L17.5 8H19V6h-3l-2 3H6.5C4.57 9 3 10.57 3 12.5S4.57 16 6.5 16c1.76 0 3.22-1.3 3.45-3h1.1c.23 1.7 1.69 3 3.45 3 1.76 0 3.22-1.3 3.45-3h.05c1.38 0 2.5-1.12 2.5-2.5S20.88 10.5 19.5 10.5zM6.5 14C5.67 14 5 13.33 5 12.5S5.67 11 6.5 11H10v.5c0 .98-.41 1.86-1.07 2.5A1.997 1.997 0 0 1 6.5 14zm8 0a1.997 1.997 0 0 1-1.43-.6A3.01 3.01 0 0 1 12 11v-.5h3.5L16.73 12a1.5 1.5 0 0 1-2.23 2z"/>
  </svg>
)
const IconLocation = ({ size = 16, color = '#003366' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
)
const IconClock = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
)
const IconCheck = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
  </svg>
)
const IconChevronRight = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
  </svg>
)
const IconBell = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
)

// ─── Logo Component ──────────────────────────────────────────────────────────

function WariMotoLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 28, md: 36, lg: 52 }
  const px = sizes[size]
  return (
    <div className="flex items-center gap-2">
      <img src={warimotoLogo} alt="WariMoto logo" style={{ width: px, height: px, objectFit: 'contain' }} />
      <span style={{ fontFamily: 'Outfit', fontWeight: 800 }}>
        <span style={{ color: '#003366', fontSize: size === 'lg' ? 28 : size === 'md' ? 20 : 16 }}>Wari</span>
        <span style={{ color: '#FFC107', fontSize: size === 'lg' ? 28 : size === 'md' ? 20 : 16 }}>Moto</span>
      </span>
    </div>
  )
}

// ─── Map Component ───────────────────────────────────────────────────────────

function MapView({ conductores, selectedId, onSelectConductor }: {
  conductores: typeof CONDUCTORES
  selectedId: number | null
  onSelectConductor: (id: number) => void
}) {
  return (
    <div className="relative w-full h-full map-bg overflow-hidden">
      {/* Roads */}
      <div className="map-road-h" style={{ top: '30%', left: '5%', width: '90%' }} />
      <div className="map-road-h" style={{ top: '55%', left: '10%', width: '80%' }} />
      <div className="map-road-h" style={{ top: '75%', left: '5%', width: '60%' }} />
      <div className="map-road-v" style={{ left: '25%', top: '10%', height: '80%' }} />
      <div className="map-road-v" style={{ left: '60%', top: '5%', height: '70%' }} />
      <div className="map-road-v" style={{ left: '80%', top: '20%', height: '60%' }} />

      {/* Route line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path d="M 50% 62% Q 40% 45% 38% 38%" stroke="#003366" strokeWidth="3" strokeDasharray="6,4" fill="none" opacity="0.6"/>
      </svg>

      {/* User location */}
      <div className="absolute" style={{ left: '48%', top: '59%', transform: 'translate(-50%,-50%)' }}>
        <div className="relative">
          <div className="pulse-ring absolute inset-0 rounded-full" style={{ background: 'rgba(0,51,102,0.3)', width: 20, height: 20 }} />
          <div className="relative z-10 rounded-full border-3 border-white shadow-lg flex items-center justify-center"
            style={{ width: 20, height: 20, background: '#003366', border: '3px solid white' }} />
        </div>
      </div>

      {/* Driver markers */}
      {conductores.map(c => (
        <button
          key={c.id}
          onClick={() => onSelectConductor(c.id)}
          className="absolute transition-transform hover:scale-110 focus:outline-none moto-icon"
          style={{ left: `${c.lng}%`, top: `${c.lat}%`, transform: 'translate(-50%,-50%)', animationDelay: `${c.id * 0.3}s` }}
        >
          <div className={`rounded-full flex items-center justify-center shadow-lg border-2 transition-all ${selectedId === c.id ? 'scale-125 border-yellow-400' : 'border-white'}`}
            style={{ width: 38, height: 38, background: c.libre ? '#FFC107' : '#EF4444' }}>
            <IconMotorcycle size={20} color="#003366" />
          </div>
          {c.libre && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-500 border border-white" />}
        </button>
      ))}

      {/* Ayacucho label */}
      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold opacity-70"
        style={{ background: 'rgba(0,51,102,0.15)', color: '#003366' }}>
        📍 Ayacucho
      </div>

      {/* GPS button */}
      <button className="absolute bottom-4 right-4 w-10 h-10 card flex items-center justify-center shadow-md"
        style={{ borderRadius: 12 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#003366">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
      </button>
    </div>
  )
}

// ─── Driver Card ─────────────────────────────────────────────────────────────

function ConductorCard({ conductor, onSolicitar, onVerPerfil }: {
  conductor: typeof CONDUCTORES[0]
  onSolicitar: () => void
  onVerPerfil: () => void
}) {
  return (
    <div className="card p-4 slide-up">
      <div className="flex items-start gap-3 mb-3">
        <div className="rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ width: 52, height: 52, background: 'linear-gradient(135deg, #003366, #004488)' }}>
          {conductor.foto}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base" style={{ color: '#003366' }}>{conductor.nombre}</h3>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conductor.libre ? 'status-libre' : 'status-ocupado'}`}>
              {conductor.libre ? 'Libre' : 'Ocupado'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-0.5">
              <IconStar size={14} />
              <span className="text-sm font-semibold" style={{ color: '#1F2937' }}>{conductor.calificacion}</span>
            </div>
            <span className="text-xs" style={{ color: '#6B7280' }}>• {conductor.anos} años de experiencia</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: '#EEF2FF', color: '#3730A3' }}>
              {conductor.tipo}
            </span>
            <span className="text-xs font-mono" style={{ color: '#6B7280' }}>{conductor.placa}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 px-1">
        <div className="flex items-center gap-1.5">
          <div className="rounded-full flex items-center justify-center" style={{ width: 24, height: 24, background: '#FFF3CD' }}>
            <IconClock size={13} />
          </div>
          <span className="font-bold text-sm" style={{ color: '#003366' }}>{conductor.tiempo}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-full flex items-center justify-center" style={{ width: 24, height: 24, background: '#DBEAFE' }}>
            <IconLocation size={13} color="#1D4ED8" />
          </div>
          <span className="font-bold text-sm" style={{ color: '#003366' }}>{conductor.distancia}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={onVerPerfil} className="btn-navy flex-1 py-3 text-sm">
          Ver perfil
        </button>
        <button onClick={onSolicitar} className="btn-primary flex-[2] py-3 text-base">
          🏍️ Solicitar moto
        </button>
      </div>
    </div>
  )
}

// ─── Emergency Modal ──────────────────────────────────────────────────────────

function EmergencyModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-lg card p-6 slide-up m-4" style={{ borderRadius: 24 }}>
        {!sent ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                <IconEmergency size={26} />
              </div>
              <div>
                <h2 className="font-bold text-xl" style={{ color: '#003366' }}>Botón de Emergencia</h2>
                <p className="text-sm" style={{ color: '#6B7280' }}>Ayuda inmediata en Ayacucho</p>
              </div>
            </div>
            <p className="text-sm mb-5" style={{ color: '#374151' }}>
              Al activar la emergencia, tu ubicación GPS actual será enviada a la central de WariMoto y a los servicios de emergencia locales.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Policía Nacional', num: '105', color: '#1D4ED8', bg: '#DBEAFE' },
                { label: 'Bomberos', num: '116', color: '#D97706', bg: '#FEF3C7' },
                { label: 'Ambulancia', num: '117', color: '#DC2626', bg: '#FEE2E2' },
              ].map(e => (
                <a key={e.num} href={`tel:${e.num}`} className="flex flex-col items-center py-3 rounded-2xl font-bold text-center"
                  style={{ background: e.bg, color: e.color }}>
                  <span className="text-xl">{e.num}</span>
                  <span className="text-xs font-medium mt-0.5">{e.label}</span>
                </a>
              ))}
            </div>
            <button onClick={() => setSent(true)} className="w-full py-4 rounded-2xl font-bold text-white text-lg mb-3"
              style={{ background: 'linear-gradient(135deg, #DC2626, #B91C1C)', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}>
              🚨 ACTIVAR EMERGENCIA
            </button>
            <button onClick={onClose} className="w-full py-3 text-sm font-medium" style={{ color: '#6B7280' }}>
              Cancelar
            </button>
          </>
        ) : (
          <div className="text-center py-4 fade-in">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#DCFCE7' }}>
              <IconCheck size={32} />
            </div>
            <h3 className="font-bold text-xl mb-2" style={{ color: '#003366' }}>¡Emergencia activada!</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
              Tu ubicación ha sido compartida con la central de WariMoto y los servicios de emergencia de Ayacucho. Mantente en un lugar seguro.
            </p>
            <button onClick={onClose} className="btn-primary w-full py-3 text-base">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Solicitud Modal ─────────────────────────────────────────────────────────

function SolicitudModal({ conductor, destino, onClose }: {
  conductor: typeof CONDUCTORES[0]
  destino: string
  onClose: () => void
}) {
  const [step, setStep] = useState<'confirmar' | 'buscando' | 'encontrado'>('confirmar')

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-lg card p-6 slide-up m-4" style={{ borderRadius: 24 }}>
        {step === 'confirmar' && (
          <div className="fade-in">
            <h2 className="font-bold text-xl mb-1" style={{ color: '#003366' }}>Confirmar viaje</h2>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Revisa los detalles antes de solicitar</p>
            <div className="rounded-2xl p-4 mb-4" style={{ background: '#F8FAFF' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#003366' }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>Tu ubicación actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: '#FFC107' }} />
                <span className="text-sm font-medium" style={{ color: '#374151' }}>{destino || 'Plaza de Armas, Ayacucho'}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl mb-4" style={{ background: '#FFF8E6' }}>
              <div className="rounded-full flex items-center justify-center text-white font-bold"
                style={{ width: 40, height: 40, background: '#003366' }}>
                {conductor.foto}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#003366' }}>{conductor.nombre}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>{conductor.placa} • {conductor.tiempo} • {conductor.distancia}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-bold" style={{ color: '#003366' }}>S/ 4.50</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>estimado</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-navy flex-1 py-3 text-sm">Cancelar</button>
              <button onClick={() => setStep('buscando')} className="btn-primary flex-[2] py-3 text-base">
                Confirmar solicitud
              </button>
            </div>
          </div>
        )}
        {step === 'buscando' && (
          <div className="text-center py-6 fade-in">
            <div className="relative mx-auto mb-6" style={{ width: 80, height: 80 }}>
              <div className="absolute inset-0 rounded-full border-4 border-yellow-200" />
              <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <IconMotorcycle size={32} color="#003366" />
              </div>
            </div>
            <h3 className="font-bold text-xl mb-2" style={{ color: '#003366' }}>Buscando conductor...</h3>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>Conectando con {conductor.nombre}</p>
            <button onClick={() => setStep('encontrado')} className="btn-primary w-full py-3">
              Simular respuesta del conductor
            </button>
          </div>
        )}
        {step === 'encontrado' && (
          <div className="fade-in">
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#DCFCE7' }}>
                <IconCheck size={28} />
              </div>
              <h3 className="font-bold text-xl" style={{ color: '#003366' }}>¡Conductor en camino!</h3>
              <p className="text-sm" style={{ color: '#6B7280' }}>{conductor.nombre} aceptó tu solicitud</p>
            </div>
            <div className="rounded-2xl p-4 mb-4" style={{ background: '#F0FFF4', border: '1px solid #BBF7D0' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#6B7280' }}>Tiempo estimado de llegada</span>
                <span className="font-bold" style={{ color: '#16A34A' }}>{conductor.tiempo}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span style={{ color: '#6B7280' }}>Placa</span>
                <span className="font-bold font-mono" style={{ color: '#003366' }}>{conductor.placa}</span>
              </div>
            </div>
            <button onClick={onClose} className="btn-primary w-full py-3 text-base">Entendido</button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Driver Profile Modal ─────────────────────────────────────────────────────

function PerfilConductorModal({ conductor, onClose }: { conductor: typeof CONDUCTORES[0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="w-full max-w-lg card p-6 slide-up m-4" style={{ borderRadius: 24 }}>
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-bold text-xl" style={{ color: '#003366' }}>Perfil del conductor</h2>
          <button onClick={onClose} className="text-gray-400 text-2xl leading-none">&times;</button>
        </div>
        <div className="flex flex-col items-center mb-5">
          <div className="rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3"
            style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #003366, #004488)' }}>
            {conductor.foto}
          </div>
          <h3 className="font-bold text-xl" style={{ color: '#003366' }}>{conductor.nombre}</h3>
          <div className="flex items-center gap-1 mt-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width={18} height={18} viewBox="0 0 24 24" fill={i <= Math.floor(conductor.calificacion) ? '#FFC107' : '#E5E7EB'}>
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ))}
            <span className="ml-1 font-bold text-sm" style={{ color: '#003366' }}>{conductor.calificacion}</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Experiencia', value: `${conductor.anos} años`, icon: '⭐' },
            { label: 'Placa', value: conductor.placa, icon: '🏍️' },
            { label: 'Tipo', value: conductor.tipo, icon: '🔧' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: '#F8FAFF' }}>
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-bold text-sm" style={{ color: '#003366' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-3 mb-4 flex items-center gap-3" style={{ background: '#DCFCE7' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#16A34A' }}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#15803D' }}>Conductor verificado</p>
            <p className="text-xs" style={{ color: '#16A34A' }}>Documentos revisados por WariMoto</p>
          </div>
        </div>
        <button onClick={onClose} className="btn-primary w-full py-3 text-base">Cerrar perfil</button>
      </div>
    </div>
  )
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function HomeScreen({ onEmergency }: { onEmergency: () => void }) {
  const [destino, setDestino] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(1)
  const [showSolicitud, setShowSolicitud] = useState(false)
  const [showPerfil, setShowPerfil] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const selectedConductor = CONDUCTORES.find(c => c.id === selectedId && c.libre)

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between flex-shrink-0" style={{ background: 'white' }}>
        <WariMotoLogo size="md" />
        <button className="relative p-2" style={{ color: '#003366' }}>
          <IconBell size={24} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: '#FFC107' }} />
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 pb-3 flex-shrink-0" style={{ background: 'white' }}>
        <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl transition-all ${searchFocused ? 'ring-2 ring-yellow-400' : ''}`}
          style={{ background: '#F0F4FF' }}>
          <IconSearch size={18} />
          <input
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ fontFamily: 'Outfit', color: '#1F2937' }}
            placeholder="¿A dónde te llevamos?"
            value={destino}
            onChange={e => setDestino(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {destino && (
            <button onClick={() => setDestino('')} className="text-gray-400 text-lg leading-none">&times;</button>
          )}
        </div>

        {searchFocused && (
          <div className="absolute left-0 right-0 z-20 mx-4 mt-1 card p-2 fade-in" style={{ top: 155 }}>
            {['Plaza de Armas', 'Mercado Andrés F. Vivanco', 'Hospital Regional de Ayacucho', 'Terminal Terrestre'].map(lugar => (
              <button key={lugar} onClick={() => { setDestino(lugar); setSearchFocused(false) }}
                className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50">
                <IconLocation size={16} color="#FFC107" />
                <span className="text-sm" style={{ color: '#1F2937' }}>{lugar}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapView conductores={CONDUCTORES} selectedId={selectedId} onSelectConductor={setSelectedId} />

        {/* Stats strip */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm"
            style={{ background: 'white', color: '#003366' }}>
            <span style={{ color: '#22C55E' }}>●</span> {CONDUCTORES.filter(c => c.libre).length} conductores libres
          </div>
        </div>

        {/* Emergency FAB */}
        <button onClick={onEmergency}
          className="absolute top-3 right-14 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md"
          style={{ background: '#EF4444', color: 'white' }}>
          🚨 SOS
        </button>
      </div>

      {/* Driver card / list */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3" style={{ background: 'transparent' }}>
        {selectedConductor ? (
          <ConductorCard
            conductor={selectedConductor}
            onSolicitar={() => setShowSolicitud(true)}
            onVerPerfil={() => setShowPerfil(true)}
          />
        ) : (
          <div className="card p-4 text-center" style={{ color: '#6B7280' }}>
            <p className="text-sm">Toca un conductor en el mapa para ver su perfil</p>
            <p className="text-xs mt-1">Los íconos amarillos están libres</p>
          </div>
        )}
      </div>

      {showSolicitud && selectedConductor && (
        <SolicitudModal conductor={selectedConductor} destino={destino} onClose={() => setShowSolicitud(false)} />
      )}
      {showPerfil && selectedConductor && (
        <PerfilConductorModal conductor={selectedConductor} onClose={() => setShowPerfil(false)} />
      )}
    </div>
  )
}

function ViajesScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ background: 'white' }}>
        <h1 className="font-bold text-xl" style={{ color: '#003366' }}>Historial de viajes</h1>
        <p className="text-sm" style={{ color: '#6B7280' }}>Ayacucho • Septiembre 2026</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pt-2 pb-4 space-y-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-1">
          {[
            { label: 'Total viajes', value: '27', icon: '🏍️' },
            { label: 'Este mes', value: '4', icon: '📅' },
            { label: 'Km recorridos', value: '48.2', icon: '📍' },
          ].map(s => (
            <div key={s.label} className="card p-3 text-center">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="font-bold text-lg" style={{ color: '#003366' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {VIAJES.map(v => (
          <div key={v.id} className="card p-4 fade-in">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#003366' }} />
                  <span className="text-sm" style={{ color: '#374151' }}>{v.origen}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: '#FFC107' }} />
                  <span className="text-sm" style={{ color: '#374151' }}>{v.destino}</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${v.estado === 'completado' ? 'status-libre' : 'status-ocupado'}`}>
                {v.estado === 'completado' ? 'Completado' : 'Cancelado'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #F3F4F6' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: '#6B7280' }}>{v.conductor}</span>
                {v.estado === 'completado' && (
                  <div className="flex items-center gap-0.5">
                    {[...Array(v.calificacion)].map((_, i) => <IconStar key={i} size={11} />)}
                  </div>
                )}
              </div>
              <div className="text-right">
                <span className="font-bold text-sm" style={{ color: '#003366' }}>{v.precio}</span>
                <span className="text-xs ml-2" style={{ color: '#9CA3AF' }}>{v.fecha}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PerfilScreen({ mode, onToggleMode }: { mode: UserMode; onToggleMode: () => void }) {
  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="px-4 pt-6 pb-6 text-center" style={{ background: 'linear-gradient(160deg, #003366 0%, #004488 100%)' }}>
        <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-3xl border-4 border-yellow-400"
          style={{ background: 'rgba(255,193,7,0.2)' }}>
          MP
        </div>
        <h2 className="font-bold text-xl text-white">María Paulina Quispe</h2>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>Ayacucho, Perú</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <IconStar size={16} />
          <span className="font-bold text-white text-sm">4.9</span>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>• 27 viajes</span>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Mode toggle */}
        <div className="card p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: '#6B7280' }}>MODO DE USO</p>
          <div className="flex rounded-2xl overflow-hidden" style={{ background: '#F0F4FF' }}>
            {(['pasajero', 'conductor'] as UserMode[]).map(m => (
              <button key={m} onClick={() => m !== mode && onToggleMode()}
                className="flex-1 py-2.5 text-sm font-semibold capitalize transition-all"
                style={{
                  background: mode === m ? '#003366' : 'transparent',
                  color: mode === m ? 'white' : '#6B7280',
                  borderRadius: 14,
                }}>
                {m === 'pasajero' ? '🙋 Pasajero' : '🏍️ Conductor'}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="card p-4">
          <p className="text-xs font-semibold mb-3" style={{ color: '#6B7280' }}>INFORMACIÓN PERSONAL</p>
          {[
            { label: 'Teléfono', value: '+51 966 234 567' },
            { label: 'Correo', value: 'maria.quispe@gmail.com' },
            { label: 'DNI', value: '••••• 4521' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2.5" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <span className="text-sm" style={{ color: '#6B7280' }}>{item.label}</span>
              <span className="text-sm font-medium" style={{ color: '#1F2937' }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Menu */}
        <div className="card p-4">
          {[
            { icon: '🏢', label: 'Gestión de asociaciones', badge: '' },
            { icon: '🔔', label: 'Notificaciones', badge: '3' },
            { icon: '🛡️', label: 'Seguridad y privacidad', badge: '' },
            { icon: '❓', label: 'Ayuda y soporte', badge: '' },
            { icon: '📄', label: 'Términos y condiciones', badge: '' },
          ].map(item => (
            <button key={item.label} className="w-full flex items-center gap-3 py-3 hover:bg-gray-50 rounded-xl px-2 transition-colors"
              style={{ borderBottom: '1px solid #F9FAFB' }}>
              <span className="text-xl">{item.icon}</span>
              <span className="flex-1 text-left text-sm font-medium" style={{ color: '#1F2937' }}>{item.label}</span>
              {item.badge && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: '#EF4444' }}>
                  {item.badge}
                </span>
              )}
              <IconChevronRight size={18} />
            </button>
          ))}
        </div>

        <button className="w-full py-3 rounded-2xl font-semibold text-sm" style={{ color: '#EF4444', background: '#FEF2F2' }}>
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

// ─── Conductor Mode ───────────────────────────────────────────────────────────

function ConductorHome({ onEmergency }: { onEmergency: () => void }) {
  const [status, setStatus] = useState<DriverStatus>('libre')
  const [showSolicitud, setShowSolicitud] = useState(false)
  const [accepted, setAccepted] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ background: 'white' }}>
        <div className="flex items-center justify-between">
          <WariMotoLogo size="md" />
          <div className="flex items-center gap-3">
            <button onClick={onEmergency} className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{ background: '#FEE2E2', color: '#DC2626' }}>
              🚨 SOS
            </button>
            <button className="p-2" style={{ color: '#003366' }}>
              <IconBell size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Status toggle */}
      <div className="px-4 pb-3 flex-shrink-0" style={{ background: 'white' }}>
        <div className="flex items-center justify-between p-3 rounded-2xl" style={{ background: '#F8FAFF' }}>
          <div>
            <p className="font-bold text-sm" style={{ color: '#003366' }}>Estado actual</p>
            <p className={`text-xs font-semibold mt-0.5 ${status === 'libre' ? 'text-green-600' : 'text-red-500'}`}>
              {status === 'libre' ? '● Disponible para viajes' : '● No disponible'}
            </p>
          </div>
          <button
            onClick={() => setStatus(s => s === 'libre' ? 'ocupado' : 'libre')}
            className="relative rounded-full transition-all duration-300 flex-shrink-0"
            style={{
              width: 56, height: 30,
              background: status === 'libre' ? '#22C55E' : '#D1D5DB',
              boxShadow: status === 'libre' ? '0 2px 8px rgba(34,197,94,0.4)' : 'none',
            }}>
            <div className="absolute top-1 rounded-full bg-white shadow transition-all duration-300"
              style={{ width: 22, height: 22, left: status === 'libre' ? 30 : 4 }} />
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative min-h-0">
        <MapView conductores={CONDUCTORES} selectedId={null} onSelectConductor={() => {}} />

        {/* GPS indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-sm text-xs font-semibold"
          style={{ background: 'white', color: '#003366' }}>
          <span className="text-green-500">●</span> GPS activo
        </div>

        {/* Incoming request */}
        {status === 'libre' && !accepted && (
          <button onClick={() => setShowSolicitud(true)}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-lg pulse-ring"
            style={{ background: '#FFC107', color: '#003366', fontWeight: 700, fontSize: 14, minWidth: 220 }}>
            📱 Nueva solicitud de viaje
          </button>
        )}

        {accepted && (
          <div className="absolute bottom-4 left-3 right-3 card p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#003366' }}>MP</div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: '#003366' }}>María Paulina</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>Plaza de Armas → Mercado Vivanco</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm" style={{ color: '#22C55E' }}>S/ 4.50</p>
              <p className="text-xs" style={{ color: '#6B7280' }}>3 min</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="flex-shrink-0 px-4 py-4" style={{ background: 'white' }}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Hoy', value: 'S/ 48.50', sub: '8 viajes', icon: '💰' },
            { label: 'Calificación', value: '4.8 ★', sub: 'Excelente', icon: '⭐' },
            { label: 'En línea', value: '3h 24m', sub: 'hoy', icon: '⏱️' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: '#F8FAFF' }}>
              <div className="text-lg mb-0.5">{s.icon}</div>
              <div className="font-bold text-sm" style={{ color: '#003366' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#6B7280' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Incoming request modal */}
      {showSolicitud && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-lg card p-6 slide-up m-4" style={{ borderRadius: 24 }}>
            <h2 className="font-bold text-xl mb-1" style={{ color: '#003366' }}>¡Nueva solicitud!</h2>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>Una pasajera cerca de ti necesita transporte</p>
            <div className="rounded-2xl p-4 mb-4" style={{ background: '#F8FAFF' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#003366' }}>MP</div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#003366' }}>María Paulina</p>
                  <div className="flex items-center gap-1"><IconStar size={12} /><span className="text-xs" style={{ color: '#6B7280' }}>4.9</span></div>
                </div>
                <div className="ml-auto text-right">
                  <p className="font-bold" style={{ color: '#22C55E' }}>S/ 4.50</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>estimado</p>
                </div>
              </div>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#003366' }}/><span style={{ color: '#374151' }}>Plaza de Armas, Ayacucho</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: '#FFC107' }}/><span style={{ color: '#374151' }}>Mercado Andrés F. Vivanco</span></div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSolicitud(false)} className="btn-navy flex-1 py-3 text-sm">Rechazar</button>
              <button onClick={() => { setShowSolicitud(false); setAccepted(true) }} className="btn-primary flex-[2] py-3 text-base">
                ✓ Aceptar viaje
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────

function BottomNav({ active, onNavigate, onEmergency }: {
  active: Screen
  onNavigate: (s: Screen) => void
  onEmergency: () => void
}) {
  return (
    <nav className="flex-shrink-0 flex items-end justify-around px-2 pt-2 pb-3"
      style={{ background: 'white', borderTop: '1px solid #F3F4F6', boxShadow: '0 -2px 12px rgba(0,51,102,0.06)' }}>
      {[
        { id: 'home' as Screen, icon: IconHome, label: 'Inicio' },
        { id: 'viajes' as Screen, icon: IconTrips, label: 'Viajes' },
      ].map(tab => (
        <button key={tab.id} onClick={() => onNavigate(tab.id)}
          className={`nav-tab flex flex-col items-center gap-0.5 px-3 py-1 ${active === tab.id ? 'active' : ''}`}>
          <tab.icon size={22} />
          <span className="text-xs font-medium">{tab.label}</span>
          {active === tab.id && <div className="w-1 h-1 rounded-full" style={{ background: '#003366' }} />}
        </button>
      ))}

      {/* Emergency center button */}
      <button onClick={onEmergency}
        className="flex flex-col items-center gap-0.5 -mt-4"
        style={{ color: 'white' }}>
        <div className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, #EF4444, #B91C1C)', boxShadow: '0 4px 16px rgba(239,68,68,0.4)' }}>
          <IconEmergency size={22} />
          <span className="text-[9px] font-bold mt-0.5">SOS</span>
        </div>
      </button>

      {[
        { id: 'viajes' as Screen, icon: IconTrips, label: 'Viajes' },
        { id: 'perfil' as Screen, icon: IconProfile, label: 'Perfil' },
      ].slice(1).map(tab => (
        <button key={tab.id} onClick={() => onNavigate(tab.id)}
          className={`nav-tab flex flex-col items-center gap-0.5 px-3 py-1 ${active === tab.id ? 'active' : ''}`}>
          <tab.icon size={22} />
          <span className="text-xs font-medium">{tab.label}</span>
          {active === tab.id && <div className="w-1 h-1 rounded-full" style={{ background: '#003366' }} />}
        </button>
      ))}

      <button onClick={() => onNavigate('perfil')}
        className={`nav-tab flex flex-col items-center gap-0.5 px-3 py-1 ${active === 'perfil' ? 'active' : ''}`}>
        <IconProfile size={22} />
        <span className="text-xs font-medium">Perfil</span>
        {active === 'perfil' && <div className="w-1 h-1 rounded-full" style={{ background: '#003366' }} />}
      </button>
    </nav>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (mode: UserMode) => void }) {
  const [selectedMode, setSelectedMode] = useState<UserMode>('pasajero')

  return (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(160deg, #003366 0%, #004488 60%, #005599 100%)' }}>
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-12">
        <img src={warimotoLogo} alt="WariMoto" className="mb-4" style={{ width: 100, height: 100, objectFit: 'contain' }} />
        <h1 className="font-black text-4xl text-white mb-1">
          Wari<span style={{ color: '#FFC107' }}>Moto</span>
        </h1>
        <p className="text-sm font-medium text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Tu moto, más cerca, más segura
        </p>
        <p className="text-xs mt-1 font-medium" style={{ color: 'rgba(255,193,7,0.8)' }}>
          Ayacucho, Perú 🏔️
        </p>

        {/* Features */}
        <div className="mt-8 w-full space-y-3">
          {[
            { icon: '📍', text: 'Ubicación en tiempo real' },
            { icon: '✅', text: 'Conductores verificados' },
            { icon: '🚨', text: 'Botón de emergencia integrado' },
            { icon: '🌿', text: 'Diseño de bajo consumo de datos' },
          ].map(f => (
            <div key={f.text} className="flex items-center gap-3">
              <span className="text-lg">{f.icon}</span>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom panel */}
      <div className="px-6 pb-8 pt-6 rounded-t-3xl" style={{ background: 'white' }}>
        <h2 className="font-bold text-lg mb-1" style={{ color: '#003366' }}>Muévete con confianza</h2>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>¿Cómo quieres ingresar?</p>

        <div className="flex rounded-2xl overflow-hidden mb-4" style={{ background: '#F0F4FF' }}>
          {(['pasajero', 'conductor'] as UserMode[]).map(m => (
            <button key={m} onClick={() => setSelectedMode(m)}
              className="flex-1 py-3 text-sm font-semibold capitalize transition-all"
              style={{
                background: selectedMode === m ? '#003366' : 'transparent',
                color: selectedMode === m ? 'white' : '#6B7280',
                borderRadius: 14,
              }}>
              {m === 'pasajero' ? '🙋 Soy pasajero' : '🏍️ Soy conductor'}
            </button>
          ))}
        </div>

        <button onClick={() => onLogin(selectedMode)} className="btn-primary w-full py-4 text-base mb-3">
          Ingresar a WariMoto
        </button>
        <button className="w-full text-center text-sm" style={{ color: '#6B7280' }}>
          ¿No tienes cuenta? <span style={{ color: '#003366', fontWeight: 600 }}>Regístrate gratis</span>
        </button>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [userMode, setUserMode] = useState<UserMode>('pasajero')
  const [screen, setScreen] = useState<Screen>('home')
  const [showEmergency, setShowEmergency] = useState(false)

  if (!loggedIn) {
    return (
      <div className="flex justify-center items-start min-h-screen" style={{ background: '#E8EDF5', padding: '0' }}>
        <div className="w-full max-w-sm" style={{ height: '100dvh', maxHeight: 844 }}>
          <LoginScreen onLogin={(mode) => { setUserMode(mode); setLoggedIn(true) }} />
        </div>
        {/* Desktop sidebar */}
        <div className="hidden lg:flex flex-col justify-center pl-16 flex-1 max-w-xl">
          <WariMotoLogo size="lg" />
          <h2 className="font-black text-5xl mt-6 mb-3" style={{ color: '#003366', lineHeight: 1.1 }}>
            Muévete con<br /><span style={{ color: '#FFC107' }}>confianza</span>
          </h2>
          <p className="text-lg mb-6" style={{ color: '#4B5563' }}>
            La plataforma de transporte en moto que conecta pasajeros y motociclistas en Ayacucho de forma segura, rápida y confiable.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🛡️', title: 'Conductores verificados', desc: 'Todos con documentos revisados' },
              { icon: '📍', title: 'Seguimiento en tiempo real', desc: 'Sabe dónde estás siempre' },
              { icon: '🚨', title: 'Botón de emergencia', desc: 'Ayuda inmediata al instante' },
              { icon: '🏔️', title: 'Hecho para Ayacucho', desc: 'Conocemos la ciudad como nadie' },
            ].map(f => (
              <div key={f.title} className="rounded-2xl p-4" style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,51,102,0.08)' }}>
                <div className="text-2xl mb-2">{f.icon}</div>
                <p className="font-bold text-sm" style={{ color: '#003366' }}>{f.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-start min-h-screen" style={{ background: '#E8EDF5' }}>
      {/* Mobile shell */}
      <div className="w-full max-w-sm flex flex-col overflow-hidden shadow-2xl"
        style={{ height: '100dvh', maxHeight: 844, background: '#F8FAFF' }}>

        {/* Screen content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {userMode === 'pasajero' ? (
            <>
              {screen === 'home' && <HomeScreen onEmergency={() => setShowEmergency(true)} />}
              {screen === 'viajes' && <ViajesScreen />}
              {screen === 'perfil' && <PerfilScreen mode={userMode} onToggleMode={() => setUserMode('conductor')} />}
            </>
          ) : (
            <>
              {screen === 'home' && <ConductorHome onEmergency={() => setShowEmergency(true)} />}
              {screen === 'viajes' && <ViajesScreen />}
              {screen === 'perfil' && <PerfilScreen mode={userMode} onToggleMode={() => setUserMode('pasajero')} />}
            </>
          )}
        </div>

        {/* Nav */}
        <BottomNav active={screen} onNavigate={setScreen} onEmergency={() => setShowEmergency(true)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex flex-col justify-start pt-16 pl-12 flex-1 max-w-md">
        <WariMotoLogo size="lg" />
        <h2 className="font-black text-4xl mt-5 mb-3" style={{ color: '#003366', lineHeight: 1.15 }}>
          {userMode === 'pasajero' ? 'Tu viaje comienza aquí' : 'Panel del conductor'}
        </h2>
        <p className="text-base mb-5" style={{ color: '#4B5563' }}>
          {userMode === 'pasajero'
            ? 'Encuentra conductores verificados cerca de ti en Ayacucho. Seguro, rápido y confiable.'
            : 'Gestiona tus viajes, revisa tus ganancias y mantente disponible para los pasajeros de Ayacucho.'}
        </p>

        <div className="space-y-3">
          {(userMode === 'pasajero' ? [
            { screen: 'home' as Screen, icon: '🗺️', title: 'Mapa en vivo', desc: 'Conductores cerca de ti' },
            { screen: 'viajes' as Screen, icon: '📋', title: 'Mis viajes', desc: 'Historial y estadísticas' },
            { screen: 'perfil' as Screen, icon: '👤', title: 'Mi perfil', desc: 'Datos y preferencias' },
          ] : [
            { screen: 'home' as Screen, icon: '🏍️', title: 'Panel conductor', desc: 'Estado y solicitudes' },
            { screen: 'viajes' as Screen, icon: '📊', title: 'Mis viajes', desc: 'Ganancias e historial' },
            { screen: 'perfil' as Screen, icon: '👤', title: 'Mi perfil', desc: 'Documentos y datos' },
          ]).map(item => (
            <button key={item.screen} onClick={() => setScreen(item.screen)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all"
              style={{
                background: screen === item.screen ? '#003366' : 'white',
                color: screen === item.screen ? 'white' : '#1F2937',
                boxShadow: '0 2px 12px rgba(0,51,102,0.08)',
              }}>
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="font-bold text-sm">{item.title}</p>
                <p className="text-xs" style={{ opacity: 0.7 }}>{item.desc}</p>
              </div>
              {screen === item.screen && <IconChevronRight size={18} />}
            </button>
          ))}

          <button onClick={() => setShowEmergency(true)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-left"
            style={{ background: '#FEE2E2', color: '#DC2626', boxShadow: '0 2px 12px rgba(220,38,38,0.15)' }}>
            <span className="text-2xl">🚨</span>
            <div>
              <p className="font-bold text-sm">Botón de Emergencia</p>
              <p className="text-xs opacity-70">Activar ayuda inmediata</p>
            </div>
          </button>
        </div>
      </div>

      {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} />}
    </div>
  )
}
